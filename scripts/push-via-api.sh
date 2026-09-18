#!/usr/bin/env bash
# 通过 GitHub API 推送文件（当 git push 因网络问题不可用时使用）
set -e
export PATH="/c/Users/张张/node-v20.17.0-win-x64:/c/Program Files/GitHub CLI:$PATH"

cd "$(dirname "$0")/.."

REPO="zzllcake/-"
BRANCH="main"
COMMIT_MSG="${1:-chore: update files}"
shift || true

if [ $# -eq 0 ]; then
  echo "用法: $0 '提交信息' 文件1 文件2 ..."
  exit 1
fi

echo "📡 获取当前分支状态..."
BASE_SHA=$(gh api "repos/$REPO/git/refs/heads/$BRANCH" --jq '.object.sha')
BASE_TREE=$(gh api "repos/$REPO/git/commits/$BASE_SHA" --jq '.tree.sha')
echo "  Base commit: $BASE_SHA"

# 为每个文件创建 blob
TREE_ITEMS="["
FIRST=true
for FILE in "$@"; do
  echo "📄 处理文件: $FILE"
  if [ ! -f "$FILE" ]; then
    echo "  ❌ 文件不存在: $FILE"
    exit 1
  fi

  # 创建 blob (用 --raw-field 传文件内容)
  BLOB_SHA=$(gh api "repos/$REPO/git/blobs" \
    -f content="$(cat "$FILE" | base64 -w0)" \
    -f encoding="base64" \
    --jq '.sha')
  echo "  Blob: $BLOB_SHA"

  if [ "$FIRST" = true ]; then
    FIRST=false
  else
    TREE_ITEMS="$TREE_ITEMS,"
  fi
  TREE_ITEMS="$TREE_ITEMS{\"path\":\"$FILE\",\"mode\":\"100644\",\"type\":\"blob\",\"sha\":\"$BLOB_SHA\"}"
done
TREE_ITEMS="$TREE_ITEMS]"

echo "🌳 创建 tree..."
cat > .tmp-tree.json << EOF
{"base_tree": "$BASE_TREE", "tree": $TREE_ITEMS}
EOF
NEW_TREE=$(gh api "repos/$REPO/git/trees" --input .tmp-tree.json --jq '.sha')
echo "  Tree: $NEW_TREE"

echo "📝 创建 commit..."
# 用 python 生成合法 JSON（处理换行和特殊字符）
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
cat > .tmp-ref.json << EOF
{"sha": "$NEW_COMMIT", "force": true}
EOF
gh api "repos/$REPO/git/refs/heads/$BRANCH" --method PATCH --input .tmp-ref.json --jq '.ref'

# 同步本地 git 状态
git fetch origin "$BRANCH" 2>/dev/null || true
git update-ref "refs/heads/$BRANCH" "$NEW_COMMIT" 2>/dev/null || true

echo ""
echo "✅ 推送完成！"
