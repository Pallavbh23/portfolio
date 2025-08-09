#!/usr/bin/env bash
set -euo pipefail

# 1) Directories
dirs=(
  "app"
  "app/api"
  "app/api/github"
  "app/api/og"
  "app/projects"
  "app/projects/[slug]"
  "components"
  "content"
  "content/projects"
  "lib"
  "public"
)

for d in "${dirs[@]}"; do
  mkdir -p "$d"
done

# 2) Files (empty placeholders)
files=(
  ".env.local.example"
  ".gitignore"
  "README.md"
  "next-env.d.ts"
  "next.config.js"
  "package.json"
  "postcss.config.js"
  "tailwind.config.ts"
  "tsconfig.json"

  "app/globals.css"
  "app/layout.tsx"
  "app/page.tsx"

  "app/api/github/route.ts"
  "app/api/og/route.tsx"

  "app/projects/page.tsx"
  "app/projects/[slug]/page.tsx"

  "components/DSAPlayground.tsx"
  "components/GraphHero.tsx"
  "components/LeetCode.tsx"
  "components/ProjectsGrid.tsx"
  "components/WorkLinkedList.tsx"

  "content/projects/sample-case-study.mdx"

  "lib/github.ts"

  "public/favicon.ico"  # will touch as empty file for now
)

for f in "${files[@]}"; do
  # ensure parent exists (in case of any path typos)
  mkdir -p "$(dirname "$f")"
  # create empty file (silently overwrite if exists)
  : > "$f"
done

# 3) Quick success message + tree
echo "✅ Portfolio scaffold created."
echo
echo "Structure:"
# Use 'tree' if available, otherwise fallback to find
if command -v tree >/dev/null 2>&1; then
  tree -a -I ".git"
else
  find . -type d -print | sed 's|[^/]*/|  |g;s|/|- |'
  echo
  echo "Files:"
  printf '%s\n' "${files[@]}"
fi

