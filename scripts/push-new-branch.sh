#!/usr/bin/env bash
# 通过 GitHub API 创建分支并推送文件（网络不通时使用）
# 用法: ./push-new-branch.sh <分支名> <提交信息> <文件1> [文件2...]
set -e
export PATH="/c/Users/张张/node-v20.17.0-win-x64:/c/Program Files/GitHub CLI:$PATH"

cd "$(dirname "$0")/.."

REPO="zzllcake/-"
BRANCH="$1"
COMMIT_MSG="$2"
shift 2

if [ -z "$BRANCH" ] || [ $# -eq 0 ]; then
  echo "用法: $0 <分支名> <提交信息> <文件1> [文件2...]"
  exit 1
fi

echo "📡 获取 main 分支状态..."
BASE_SHA=$(gh api "repos/$REPO/git/refs/heads/main" --jq '.object.sha')
BASE_TREE=$(gh api "repos/$REPO/git/commits/$BASE_SHA" --jq '.tree.sha')
echo "  Main commit: $BASE_SHA"

# 创建分支（如果不存在）
echo "🌿 创建分支: $BRANCH"
if gh api "repos/$REPO/git/refs/heads/$BRANCH" >/dev/null 2>&1; then
  echo "  ℹ️ 分支已存在，将更新它"
  BASE_SHA=$(gh api "repos/$REPO/git/refs/heads/$BRANCH" --jq '.object.sha')
  BASE_TREE=$(gh api "repos/$REPO/git/commits/$BASE_SHA" --jq '.tree.sha')
else
  gh api "repos/$REPO/git/refs" \
    -f ref="refs/heads/$BRANCH" \
    -f sha="$BASE_SHA" \
    --jq '.ref' >/dev/null
  echo "  ✅ 分支已创建"
fi

# 为每个文件创建 blob
TREE_ITEMS="["
FIRST=true
for FILE in "$@"; do
  echo "📄 处理文件: $FILE"
  if [ ! -f "$FILE" ]; then
    echo "  ❌ 文件不存在"
    exit 1
  fi

  BLOB_SHA=$(python -c "
import json, base64, subprocess, os
with open('$FILE', 'rb') as f:
    content = base64.b64encode(f.read()).decode()
payload = json.dumps({'content': content, 'encoding': 'base64'})
r = subprocess.run(['gh', 'api', 'repos/$REPO/git/blobs', '--input', '-'],
                   input=payload, capture_output=True, text=True)
if r.returncode != 0:
    print('ERROR:' + r.stderr, file=__import__('sys').stderr)
    exit(1)
print(json.loads(r.stdout)['sha'])
")
  echo "  Blob: $BLOB_SHA"

  if [ "$FIRST" = true ]; then FIRST=false; else TREE_ITEMS="$TREE_ITEMS,"; fi
  TREE_ITEMS="$TREE_ITEMS{\"path\":\"$FILE\",\"mode\":\"100644\",\"type\":\"blob\",\"sha\":\"$BLOB_SHA\"}"
done
TREE_ITEMS="$TREE_ITEMS]"

echo "🌳 创建 tree..."
python -c "
import json
with open('.tmp-tree.json', 'w', encoding='utf-8') as f:
    json.dump({'base_tree': '$BASE_TREE', 'tree': json.loads('''$TREE_ITEMS''')}, f)
"
NEW_TREE=$(gh api "repos/$REPO/git/trees" --input .tmp-tree.json --jq '.sha')
echo "  Tree: $NEW_TREE"

echo "📝 创建 commit..."
COMMIT_MSG="$COMMIT_MSG" NEW_TREE="$NEW_TREE" BASE_SHA="$BASE_SHA" python -c "
import json, os
payload = {
    'message': os.environ['COMMIT_MSG'],
    'tree': os.environ['NEW_TREE'],
    'parents': [os.environ['BASE_SHA']]
}
with open('.tmp-commit.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)
"
NEW_COMMIT=$(gh api "repos/$REPO/git/commits" --input .tmp-commit.json --jq '.sha')
echo "  Commit: $NEW_COMMIT"

echo "🚀 更新分支引用..."
python -c "
import json
with open('.tmp-ref.json', 'w') as f:
    json.dump({'sha': '$NEW_COMMIT', 'force': True}, f)
"
gh api "repos/$REPO/git/refs/heads/$BRANCH" --method PATCH --input .tmp-ref.json --jq '.ref'

rm -f .tmp-tree.json .tmp-commit.json .tmp-ref.json

echo ""
echo "✅ 分支 $BRANCH 推送完成！"
echo "🔗 https://github.com/$REPO/tree/$BRANCH"
