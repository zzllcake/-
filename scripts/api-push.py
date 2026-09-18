#!/usr/bin/env python3
"""通过 GitHub API 创建分支并推送文件（解决 git push 网络问题）。

用法:
    python scripts/api-push.py <分支名> <提交信息> <文件1> [文件2 ...]
"""
import json
import os
import subprocess
import sys
import base64

REPO = 'zzllcake/-'
GH = 'gh'


def gh_api(path, method='GET', payload=None, raw=False):
    """调用 gh api，返回解析后的 JSON（或原始字符串）"""
    cmd = [GH, 'api', path, '--method', method]
    if payload is not None:
        cmd += ['--input', '-']
    r = subprocess.run(
        cmd,
        input=json.dumps(payload) if payload is not None else None,
        capture_output=True,
        text=True,
        encoding='utf-8',
    )
    if r.returncode != 0:
        raise RuntimeError(f'gh api 失败: {r.stderr.strip()}')
    return r.stdout if raw else json.loads(r.stdout)


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)

    branch = sys.argv[1]
    commit_msg = sys.argv[2]
    files = sys.argv[3:]

    # 1. 获取 main 分支信息
    print(f'📡 获取 main 分支...')
    main_ref = gh_api(f'repos/{REPO}/git/refs/heads/main')
    base_sha = main_ref['object']['sha']
    base_tree = gh_api(f'repos/{REPO}/git/commits/{base_sha}')['tree']['sha']
    print(f'   main: {base_sha[:8]}')

    # 2. 创建或复用分支
    print(f'🌿 创建分支: {branch}')
    try:
        existing = gh_api(f'repos/{REPO}/git/refs/heads/{branch}')
        base_sha = existing['object']['sha']
        base_tree = gh_api(f'repos/{REPO}/git/commits/{base_sha}')['tree']['sha']
        print(f'   ℹ️ 分支已存在，基于 {base_sha[:8]} 更新')
    except RuntimeError:
        gh_api(f'repos/{REPO}/git/refs', 'POST', {
            'ref': f'refs/heads/{branch}',
            'sha': base_sha,
        })
        print(f'   ✅ 分支已创建')

    # 3. 为每个文件创建 blob
    tree_items = []
    for filepath in files:
        if not os.path.isfile(filepath):
            print(f'❌ 文件不存在: {filepath}')
            sys.exit(1)

        with open(filepath, 'rb') as f:
            content_b64 = base64.b64encode(f.read()).decode('ascii')

        blob = gh_api(f'repos/{REPO}/git/blobs', 'POST', {
            'content': content_b64,
            'encoding': 'base64',
        })
        print(f'📄 {filepath} → blob {blob["sha"][:8]}')
        tree_items.append({
            'path': filepath.replace('\\', '/'),
            'mode': '100644',
            'type': 'blob',
            'sha': blob['sha'],
        })

    # 4. 创建 tree
    print('🌳 创建 tree...')
    new_tree = gh_api(f'repos/{REPO}/git/trees', 'POST', {
        'base_tree': base_tree,
        'tree': tree_items,
    })
    print(f'   tree: {new_tree["sha"][:8]}')

    # 5. 创建 commit
    print('📝 创建 commit...')
    new_commit = gh_api(f'repos/{REPO}/git/commits', 'POST', {
        'message': commit_msg,
        'tree': new_tree['sha'],
        'parents': [base_sha],
    })
    print(f'   commit: {new_commit["sha"][:8]}')

    # 6. 更新分支引用
    print('🚀 更新分支...')
    gh_api(f'repos/{REPO}/git/refs/heads/{branch}', 'PATCH', {
        'sha': new_commit['sha'],
        'force': True,
    })

    print()
    print(f'✅ 推送完成！')
    print(f'🔗 https://github.com/{REPO}/tree/{branch}')


if __name__ == '__main__':
    main()
