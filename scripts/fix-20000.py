"""修复 20000 错误文件中的语法错误"""
import subprocess, os, shutil

filepath = 'src/error-types-20000.ts'

with open(filepath, 'r') as f:
    lines = f.readlines()

fixed = 0
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped.startswith('if(if('):
        depth = stripped.count('if(')
        indent = line[:len(line) - len(line.lstrip())]
        new_lines = [f'{indent}function bad_nested_{i}() {{\n']
        for d in range(depth - 1):
            new_lines.append(f'{indent}  if (true) {{\n')
        new_lines.append(f'{indent}  if (true) {{}}\n')
        for d in range(depth - 1):
            new_lines.append(f'{indent}  }}\n')
        new_lines.append(f'{indent}}}\n')
        lines[i] = ''.join(new_lines)
        fixed += 1

with open(filepath, 'w') as f:
    f.writelines(lines)

print(f"Fixed {fixed} syntax errors")

# Test with ESLint
shutil.copy(filepath, 'src/_rt20000.ts')
result = subprocess.run(
    ['npx', 'eslint', '--config', '.eslintrc.cjs', 'src/_rt20000.ts'],
    capture_output=True, text=True, timeout=60
)
eslint_errors = result.stdout.count('error ')
print(f"ESLint errors: {eslint_errors}")
os.remove('src/_rt20000.ts')
