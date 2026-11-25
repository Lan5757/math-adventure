// Math Adventure — arithmetic question generator
const MathGenerator = (() => {
  const TYPES = ["addition", "subtraction", "missing-addend",
    "missing-minuend", "missing-subtrahend"];
  const random = list => list[Math.floor(Math.random() * list.length)];

  function generate(answer, { max = 100, types = TYPES, used = new Set() } = {}) {
    if (!Number.isInteger(max) || max < 2 || max > 100 ||
        !Number.isInteger(answer) || answer < 1 || answer > max) {
      throw new Error("数字范围必须为 1 到 max，max 为 2 到 100");
    }
    if (!Array.isArray(types) || !types.length ||
        types.some(t => !TYPES.includes(t))) {
      throw new Error("请至少选择一种有效题型");
    }
    const groups = Object.fromEntries(types.map(t => [t, []]));
    function add(type, value, text, hint, key) {
      if (value === answer && groups[type] && !used.has(key)) {
        groups[type].push({ type, text, answer: value, hint, key });
      }
    }

    // 每组 a + b = c 只枚举一次，统一排除等价题。
    for (let a = 1; a <= max; a++) {
      for (let b = a; a + b <= max; b++) {
        const c = a + b;
        const key = `${a}+${b}=${c}`;
        if (used.has(key)) continue;
        add("addition", c, `${a} + ${b} = □`, "把两个数加起来。", key);
        add("missing-minuend", c, `□ − ${a} = ${b}`, "把减去的数加回去。", key);
        add("subtraction", a, `${c} − ${b} = □`, "从较大的数中减去另一个数。", key);
        add("missing-addend", a, `□ + ${b} = ${c}`, "用和减去已知的加数。", key);
        add("missing-subtrahend", a, `${c} − □ = ${b}`, "用被减数减去差。", key);
        if (a !== b) {
          add("subtraction", b, `${c} − ${a} = □`, "从较大的数中减去另一个数。", key);
          add("missing-addend", b, `${a} + □ = ${c}`, "用和减去已知的加数。", key);
          add("missing-subtrahend", b, `${c} − □ = ${a}`, "用被减数减去差。", key);
        }
      }
    }
    const available = Object.values(groups).filter(g => g.length > 0);
    if (!available.length) {
      throw new Error("没有符合条件的新题，请调整范围、题型或目标数字");
    }
    const question = random(random(available));
    used.add(question.key);
    return question;
  }

  return { generate };
})();
