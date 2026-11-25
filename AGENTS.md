# Math Adventure — repository instructions

## Product scope
- Build guided arithmetic games for children, initially ages 5–6. Prioritize ability over age. Preserve the approved racing maze: move one orthogonally adjacent cell at a time, solve for the target number, explore dead ends, reach the trophy. Do not change this mechanic without maintainer approval.
- Prioritize reliable arithmetic, guidance, online play and A4 printing over extra games or decorative polish. Keep future themes and mechanics separate from the math engine.
- Use simplified Chinese for the current game UI. Keep public project documentation bilingual where practical. Explain changes to a beginner maintainer in small, concrete steps.

## Architecture
- Keep the static HTML/CSS/JavaScript/SVG site compatible with GitHub Pages. No backend, accounts, tracking, paid services or new dependencies without approval.
- `index.html`: landing page; `maze.html`: game, settings, feedback and print views.
- `math-generator.js`: `MathGenerator.generate(answer, {max, types, used})` returns `{type, text, answer, hint, key}`.
- `maze-generator.js`: `MazeGenerator.generate`, `validate`, `neighbors`. Preserve existing interfaces unless all callers and tests are updated together. Load math generator first using classic scripts.
- `test-generators.cjs`: independent Node.js regression tests; `.github/workflows/tests.yml`: CI.

## Non-negotiable quality rules
- All operands, results and answers must be positive integers within the selected range under the current rules. Check the actual equation, not only stored answer fields.
- No duplicate arithmetic fact families within a maze: canonicalize a+b=c with a <= b, including inverse subtraction and commuted addition. If the pool is exhausted, report a clear error instead of silently allowing repeats.
- The start is open; every other cell has a question, including the trophy. Only target-answer cells are passable. The passable graph must be connected and acyclic, with a unique start-to-trophy path and at least one off-path dead end. Do not expose unvisited correct cells visually.
- Keep the red car independent of feedback colors: blue start, green correct/current/visited cell with a check, red wrong attempt with a cross; wrong moves must not move the car. Allow backtracking. A correct dead-end move is still correct.
- Provide a worked example, supportive feedback and progressive hints; no shaming or compulsory speed pressure. Maintain readable Chinese, large touch targets and visible focus. Do not rely on color alone.
- Print the current puzzle and matching parent answer sheet without changing game state. Keep matching identifiers, hide answers on child sheet, show validated route on answer sheet; check A4, Chinese glyphs, margins and no clipping.
- Do not collect child personal information, add secrets, or copy third-party assets/code without checking permissions. Repository license is not yet selected; do not assume public means licensed for reuse.

## Verification and delivery
- For game changes, follow `.agents/skills/math-adventure/SKILL.md`. Run `node test-generators.cjs` from the repository root. Preserve existing tests and add regression tests for changed logic.
- When relevant, test actual browser interaction, mobile layout and print preview/PDF. CI currently covers generators, not the full UI or print output.
- Keep changes small. Report files changed, tests actually run and their results, remaining limitations, and exact upload/verification steps. Never claim an unrun check passed or update release status before verification.
