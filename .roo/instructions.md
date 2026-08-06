# Scholatia AI Development Instructions

Project Name:
Scholatia

Architecture

- Next.js 16
- TypeScript
- Tailwind CSS
- Engine-first architecture
- CRIE Architecture
- Learning Engine
- Marketplace Platform

General Rules

Always inspect:

git status

git diff

git log --oneline -5

before modifying files.

Never overwrite completed work.

Never regenerate completed modules.

Always reuse:

lib/

hooks/

types/

components/

Never duplicate business logic.

Mission Rules

Continue interrupted missions.

Resume exactly where execution stopped.

Do not restart completed waves.

Reuse existing engines.

Preserve repository architecture.

Quality Rules

Every mission must end with

npx tsc --noEmit

npm run lint

npm run build

Only stop after all pass.

Repository Rules

Do not commit.

Do not tag.

Do not modify governance.

Do not change documentation unless requested.

Output

Always finish with a completion report including:

- files changed
- verification
- remaining work