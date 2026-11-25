# 🏎️ Math Adventure

**Turn math practice into an adventure.**

A customizable math game project for children, designed for both interactive browser play and printable activities.

[![Play online](https://img.shields.io/badge/Play-Online-d33b36)](https://lan5757.github.io/math-adventure/)
[![Tests](https://github.com/Lan5757/math-adventure/actions/workflows/tests.yml/badge.svg)](https://github.com/Lan5757/math-adventure/actions/workflows/tests.yml)

**[Play Math Adventure](https://lan5757.github.io/math-adventure/) · [Racing Maze](https://lan5757.github.io/math-adventure/maze.html) · [Feedback](https://github.com/Lan5757/math-adventure/issues)**

## About

Math Adventure started with a simple idea: make arithmetic practice feel like a real game rather than another worksheet. Parents can customize activities according to a child's current mathematical abilities, and children can explore, solve problems and reach a goal.

## First Game: Racing Maze

Find the route to the trophy by moving through neighboring cells whose equations have the target answer. Move up, down, left or right, explore branches, and backtrack when needed.

- Randomly generated mazes with a validated unique solution and dead ends.
- Addition, subtraction and missing-number problems.
- Arithmetic ranges up to 20, 50 or 100.
- 4 × 4, 5 × 5 and 6 × 6 grids.
- Adjustable difficulty and question types.
- Worked examples, progressive hints and immediate visual feedback.
- A4 printable worksheets and matching answer keys.
- No child account required.

## How to Play

1. Open the online game and choose the desired settings.
2. Read the target number and the worked example.
3. Solve the neighboring equations and select a cell with the target answer.
4. Follow the route to the trophy. Backtrack if a branch leads to a dead end.
5. Generate another maze or print the current puzzle and its answer key.

## Engineering

Built with HTML, CSS, JavaScript and SVG. Hosted with GitHub Pages.

| File | Purpose |
| --- | --- |
| `index.html` | Website homepage |
| `maze.html` | Interactive racing maze and printing |
| `math-generator.js` | Arithmetic question generation and equivalent-question deduplication |
| `maze-generator.js` | Maze generation and path validation |
| `test-generators.cjs` | Automated generator tests |
| `.github/workflows/tests.yml` | GitHub Actions workflow |
| `AGENTS.md` | Project development guidelines |
| `.agents/skills/math-adventure/SKILL.md` | Repository-level development skill |

Run the generator tests locally with Node.js 22:

```bash
node test-generators.cjs
```

The tests check arithmetic correctness, numeric bounds, duplicate mathematical relationships, maze connectivity, unique solution paths and invalid inputs. Browser interaction and physical print quality also require separate checks.

## Roadmap

- [x] Interactive arithmetic maze
- [x] Random question and maze generation
- [x] Parent settings and hints
- [x] A4 print layout and answer keys
- [x] Automated generator tests
- [ ] First tagged release and broader parent feedback
- [ ] Improved learning progression and accessibility
- [ ] Additional themes and game mechanics
- [ ] Reusable game-generation components for new activities

## Feedback and Contributions

Parents, educators and developers are welcome to suggest improvements via [GitHub Issues](https://github.com/Lan5757/math-adventure/issues). Please do not include children's names, photos or other identifying information.

## License

The license is pending. A public repository does not by itself grant permission to reuse or redistribute its code. Licensing will be clarified before the first tagged release.

---

# 中文介绍

Math Adventure（数学冒险乐园）希望让孩子在游戏中练习数学，而不是单纯重复做题。家长可以按照孩子的实际数学能力调整内容和难度。

**[进入游戏网站](https://lan5757.github.io/math-adventure/) · [立即体验赛车迷宫](https://lan5757.github.io/math-adventure/maze.html)**

## 当前玩法：冠军赛车挑战

计算相邻格子中的算式，只经过答案等于通行密码的格子，通过探索和返回找到通往终点奖杯的路线。

- 支持 20、50、100 以内的加减法及未知数题。
- 支持 4×4、5×5、6×6 迷宫和不同难度。
- 随机生成关卡，验证数学正确性、等价题去重和唯一通关路线。
- 提供示范题、分级提示、正确与错误的视觉反馈。
- 支持网页互动、A4 打印和对应答案页。
- 无需注册儿童账号。

## 项目理念与后续计划

先把一种算术迷宫玩法做好，再根据真实试玩反馈扩展主题、教学难度和新玩法。数学正确性、游戏可解性、儿童体验和打印质量是项目的基本要求。

欢迎家长和开发者通过 [Issues](https://github.com/Lan5757/math-adventure/issues) 提出建议。反馈时请勿上传儿童个人信息。

目前项目处于首次正式版本发布前的试玩阶段，开源许可证待确定。
