---
name: math-adventure
description: Develop, fix, review, or test Math Adventure arithmetic questions, racing mazes, child-facing interactions, and matching A4 puzzle and answer sheets. Use for game changes or release verification.
---

# Math Adventure development workflow

## 1. Inspect and scope
Read root `AGENTS.md`, the relevant source files and existing tests. Identify the requested change and preserve approved gameplay. For cosmetic changes, do not rewrite the math or path engine. For new features, establish concrete acceptance checks before coding.

## 2. Implement and validate
- Generate questions from arithmetic fact families with canonical keys; independently parse equations to verify answers, type and numeric bounds. Preserve per-maze deduplication across correct and distractor questions.
- Generate a valid layout first, populate target-answer and distractor cells, then derive the passable graph from actual answers. Verify orthogonal adjacency, connectivity, unique route and off-path dead ends. Never relax validity to recover from generation failure.
- Current public settings: sizes 4, 5, 6; max 20, 50, 100; basic, unknown or mixed question types; easy/medium/hard distractors. Difficulty currently controls preferred distractor distances (fallbacks are possible), not full pedagogical progression. Do not claim otherwise.
- Preserve the example, two-stage hint, reversible route, correct/wrong feedback, trophy condition and restart/new-maze distinction. A wrong or non-adjacent click must not advance the car.
- Render online puzzle, print puzzle and print answers from the same maze data. Child output must not reveal solutions even after online play. Keep the game's route and settings unchanged by printing.

## 3. Verify
Run from repository root:

```sh
node test-generators.cjs
```

For changes to randomized generation, optionally run another reproducible seed, e.g. `TEST_SEED=42 node test-generators.cjs` in a POSIX shell. Record seed and failing settings if any. Do not weaken assertions just to pass.

For UI changes, open the site from a local static server if available (e.g. `python -m http.server 8000`); check actual separate script loading and homepage/game navigation. Test correct and wrong moves, backtracking from a dead end, hints, restart, new puzzle, trophy and settings as applicable. Check narrow and desktop widths, keyboard use and legibility.

For print changes, render both puzzle and answer PDFs using a browser when available; check 4×4, 5×5 and 6×6, A4 single-page fit, readable Chinese, no clipping, matching IDs/questions, and the validated answer route. Test printing after moves and confirm state is preserved. Never substitute a screenshot of an imagined result for a real browser render.

## 4. Deliver
Report what changed, what tests ran and their actual results, what could not be tested, and the files to add/replace. Keep beginner instructions short and give a reproducible verification step. Do not claim live GitHub Pages deployment, physical printing, or child testing unless actually verified. Update documentation only to reflect implemented behavior.
