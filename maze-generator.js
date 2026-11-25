// Math Adventure — number maze generator v0.1
// Load math-generator.js before this file (classic browser scripts).
const MazeGenerator = (() => {
  const pick = xs => xs[Math.floor(Math.random() * xs.length)];
  function shuffle(xs) {
    const out = [...xs];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
  function neighbors(i, size) {
    const row = Math.floor(i / size), col = i % size;
    return [row > 0 ? i - size : -1, row < size - 1 ? i + size : -1,
      col > 0 ? i - 1 : -1, col < size - 1 ? i + 1 : -1].filter(n => n >= 0);
  }

  // Build an induced path: no shortcuts between nonconsecutive cells.
  function buildLayout(size) {
    const end = size * size - 1;
    const path = [0], active = new Set(path);
    const maxSteps = 2 * (size - 1) + 4;
    let budget = 5000;
    function search() {
      const at = path[path.length - 1];
      if (at === end) return true;
      if (--budget < 0) return false;
      for (const n of shuffle(neighbors(at, size))) {
        const distance = 2 * (size - 1) - Math.floor(n / size) - n % size;
        if (active.has(n) || path.length + distance > maxSteps ||
            neighbors(n, size).filter(v => active.has(v)).length !== 1) continue;
        path.push(n); active.add(n);
        if (search()) return true;
        path.pop(); active.delete(n);
      }
      return false;
    }
    if (!search()) return null;
    const branches = [];
    // Add branches only at internal path cells; never create a cycle.
    const branchLimit = size === 4 ? 2 : 3;
    const attachments = new Set();
    for (let b = 0; b < branchLimit; b++) {
      const options = [];
      for (const p of path.slice(1, -1)) {
        if (attachments.has(p)) continue;
        for (const n of neighbors(p, size)) {
          if (!active.has(n) && neighbors(n, size).filter(v => active.has(v)).length === 1)
            options.push([p, n]);
        }
      }
      if (!options.length) break;
      const [p, n] = pick(options);
      active.add(n); attachments.add(p); branches.push(n);
    }
    return branches.length ? { path, active } : null;
  }

  // Reconstruct passable cells from actual question answers, not the planned layout.
  function validate(maze) {
    const { size, target, cells, start, end } = maze;
    const fail = reason => ({ valid: false, reason });
    if (!Number.isInteger(size) || size < 4 || size > 6 ||
        !Array.isArray(cells) || cells.length !== size * size ||
        start !== 0 || end !== cells.length - 1 ||
        !Number.isInteger(target) || cells[start] !== null ||
        cells.some((q, i) => i !== start && (!q || !Number.isInteger(q.answer) || typeof q.key !== 'string'))) {
      return fail('Invalid maze data');
    }
    const keys = cells.filter(Boolean).map(q => q.key);
    if (new Set(keys).size !== keys.length) return fail('Duplicate question relation');
    const open = new Set([start, ...cells.flatMap((q, i) => q && q.answer === target ? [i] : [])]);
    if (!open.has(end)) return fail('Goal is blocked');
    const adjacent = i => neighbors(i, size).filter(n => open.has(n));
    if (adjacent(start).length !== 1 || adjacent(end).length !== 1) return fail('Invalid entrance or goal');
    const queue = [start], parent = new Map([[start, null]]);
    let degreeSum = 0;
    for (let k = 0; k < queue.length; k++) {
      const at = queue[k], ns = adjacent(at);
      degreeSum += ns.length;
      for (const n of ns) if (!parent.has(n)) { parent.set(n, at); queue.push(n); }
    }
    if (!parent.has(end) || parent.size !== open.size) return fail('Disconnected route');
    if (degreeSum / 2 !== open.size - 1) return fail('Cycle or alternative route');
    const solution = [];
    for (let i = end; i !== null; i = parent.get(i)) solution.push(i);
    solution.reverse();
    const deadEnds = [...open].filter(i => !solution.includes(i) && adjacent(i).length === 1);
    if (!deadEnds.length) return fail('Missing dead end');
    return { valid: true, solution, deadEnds };
  }

  function generate({ size = 4, max = 100, target, difficulty = 'medium', types } = {}) {
    if (![4, 5, 6].includes(size) || !Number.isInteger(max) || max < 20 || max > 100)
      throw new Error('支持4–6格的方形迷宫，数字范围上限为20–100');
    if (target !== undefined && (!Number.isInteger(target) || target < 1 || target > max))
      throw new Error('目标数字必须在1到数字上限之间');
    if (!['easy', 'medium', 'hard'].includes(difficulty)) throw new Error('未知难度');
    const allTypes = ['addition', 'subtraction', 'missing-addend', 'missing-minuend', 'missing-subtrahend'];
    if (types !== undefined && (!Array.isArray(types) || !types.length || types.some(t => !allTypes.includes(t))))
      throw new Error('请至少选择一种有效题型');
    for (let attempt = 0; attempt < 40; attempt++) {
      const layout = buildLayout(size);
      if (!layout) continue;
      const goal = target ?? (Math.floor(max * .25) + Math.floor(Math.random() * (Math.floor(max * .65) - Math.floor(max * .25) + 1)));
      const used = new Set(), cells = Array(size * size).fill(null);
      const opts = { max, used, ...(types ? { types } : {}) };
      try {
        // Reserve target-answer questions first, including the trophy cell.
        for (const i of shuffle([...layout.active].filter(i => i !== 0)))
          cells[i] = MathGenerator.generate(goal, opts);
        const alternatives = Array.from({ length: max }, (_, i) => i + 1).filter(n => n !== goal);
        for (const i of shuffle(cells.map((_, i) => i).filter(i => !layout.active.has(i)))) {
          const nearby = alternatives.filter(n => Math.abs(n - goal) <= (difficulty === 'hard' ? 2 : 5));
          const distant = alternatives.filter(n => Math.abs(n - goal) >= 6);
          const preferred = difficulty === 'easy' ? distant : nearby;
          // Fall back to other values if the preferred answers run out of unique relations.
          const candidates = [...shuffle(preferred), ...shuffle(alternatives.filter(n => !preferred.includes(n)))];
          for (const n of candidates) {
            try { cells[i] = MathGenerator.generate(n, opts); break; }
            catch (err) { /* This answer may have no unused question relations. */ }
          }
          if (!cells[i]) throw new Error('Insufficient unique questions');
        }
        const maze = { size, max, target: goal, difficulty, start: 0, end: size * size - 1, cells };
        const result = validate(maze);
        if (result.valid) return { ...maze, solution: result.solution, deadEnds: result.deadEnds };
      } catch (err) { /* Try a fresh layout/target if the question pool is insufficient. */ }
    }
    throw new Error('无法生成满足要求的迷宫，请增加数字范围或题型、缩小迷宫或调整目标数字');
  }
  return { generate, validate, neighbors };
})();
