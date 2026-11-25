// Math Adventure — independent regression checks (no npm dependencies).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = __dirname;
const seed = Number(process.env.TEST_SEED ?? 20261125);
assert(Number.isInteger(seed) && seed >= 0 && seed <= 0xffffffff, 'Invalid TEST_SEED');
let state = seed >>> 0;
const math = Object.create(Math);
math.random = () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 4294967296; };
const context = vm.createContext({ Math: math });
for (const file of ['math-generator.js', 'maze-generator.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const { MathGenerator, MazeGenerator } = vm.runInContext('({MathGenerator, MazeGenerator})', context);
const groups = {
  mixed: ['addition', 'subtraction', 'missing-addend', 'missing-minuend', 'missing-subtrahend'],
  basic: ['addition', 'subtraction'],
  unknown: ['missing-addend', 'missing-minuend', 'missing-subtrahend']
};
let questionCount = 0, mazeCount = 0;
function checkQuestion(q, max, allowed, used) {
  assert(allowed.includes(q.type), `Unexpected type: ${q.type}`);
  assert(Number.isInteger(q.answer) && q.answer >= 1 && q.answer <= max);
  const m = /^(\d+|□)\s*([+−-])\s*(\d+|□)\s*=\s*(\d+|□)$/.exec(q.text);
  assert(m, `Invalid equation: ${q.text}`);
  const tokens = [m[1], m[3], m[4]];
  assert.equal(tokens.filter(x => x === '□').length, 1);
  const plus = m[2] === '+';
  const blank = tokens.indexOf('□');
  const type = plus ? (blank === 2 ? 'addition' : 'missing-addend') : ['missing-minuend','missing-subtrahend','subtraction'][blank];
  assert.equal(q.type, type, q.text);
  const [a,b,c] = tokens.map(x => x === '□' ? q.answer : Number(x));
  for (const n of [a,b,c]) assert(n >= 1 && n <= max, `Out of range: ${q.text}`);
  assert.equal(plus ? a+b : a-b, c, `Wrong answer: ${q.text}`);
  const pair = (plus ? [a,b] : [b,c]).sort((x,y)=>x-y);
  const key = `${pair[0]}+${pair[1]}=${plus ? c : a}`;
  assert.equal(q.key, key, 'Incorrect canonical key');
  assert(!used.has(key), `Equivalent duplicate: ${key}`);
  used.add(key); questionCount++;
}
function checkMaze(maze, config) {
  const { size, max, target, cells, start, end, solution, deadEnds } = maze;
  assert.equal(size, config.size); assert.equal(max, config.max); assert.equal(maze.difficulty, config.difficulty);
  if (config.target !== undefined) assert.equal(target, config.target);
  assert(Number.isInteger(target) && target >= 1 && target <= max);
  assert.equal(cells.length, size*size); assert.equal(start,0); assert.equal(end,cells.length-1); assert.equal(cells[start],null);
  const used = new Set();
  cells.forEach((q,i)=>{ if(i!==start) checkQuestion(q,max,config.types,used); });
  const open = new Set([start]);
  cells.forEach((q,i)=>{ if(q?.answer===target) open.add(i); });
  assert(open.has(end), 'Blocked goal');
  const near = i => [...open].filter(j => Math.abs(Math.floor(i/size)-Math.floor(j/size))+Math.abs(i%size-j%size)===1);
  assert.equal(near(start).length,1); assert.equal(near(end).length,1);
  const parent = new Map([[start,null]]), queue = [start];
  let edges = 0;
  for (let k=0;k<queue.length;k++) { const i=queue[k]; for(const j of near(i)){ edges++; if(!parent.has(j)){parent.set(j,i);queue.push(j);} } }
  assert.equal(parent.size,open.size,'Disconnected passable cells');
  assert.equal(edges/2,open.size-1,'Cycle / non-unique route');
  const route=[]; for(let i=end;i!==null;i=parent.get(i)) route.unshift(i);
  assert.deepEqual(Array.from(solution),route,'Incorrect answer route');
  const branches=[...open].filter(i=>!route.includes(i)&&near(i).length===1).sort((a,b)=>a-b);
  assert(branches.length>0,'Missing dead end');
  assert.deepEqual(Array.from(deadEnds).sort((a,b)=>a-b),branches,'Incorrect dead-end labels');
  assert.equal(MazeGenerator.validate(maze).valid,true);
  mazeCount++;
}
console.log(`Test seed: ${seed}`);
for (const max of [20,50,100]) for (const type of groups.mixed) {
  const used = new Set(), checked = new Set();
  const answer = Math.floor(max/2);
  for(let i=0;i<5;i++) { const q=MathGenerator.generate(answer,{max,types:[type],used}); assert.equal(q.answer,answer); checkQuestion(q,max,[type],checked); }
}
assert.throws(()=>MathGenerator.generate(0));
assert.throws(()=>MathGenerator.generate(10,{max:5}));
assert.throws(()=>MathGenerator.generate(5,{types:[]}));
const exhausted=new Set(); MathGenerator.generate(2,{max:2,types:['addition'],used:exhausted});
assert.throws(()=>MathGenerator.generate(2,{max:2,types:['addition'],used:exhausted}));
for(const size of [4,5,6]) for(const max of [20,50,100]) for(const difficulty of ['easy','medium','hard']) for(const types of Object.values(groups)) {
  const config={size,max,difficulty,types};
  for(let n=0;n<3;n++) { try { checkMaze(MazeGenerator.generate(config),config); } catch(e){console.error('Failed config:',JSON.stringify(config),'iteration:',n);throw e;} }
}
const config={size:4,max:100,target:42,difficulty:'medium',types:groups.mixed};
const sample=MazeGenerator.generate(config); checkMaze(sample,config);
const clone=()=>JSON.parse(JSON.stringify(sample));
const blocked=clone(); blocked.cells[blocked.end].answer=41; assert.equal(MazeGenerator.validate(blocked).valid,false);
const duplicate=clone(); duplicate.cells[2].key=duplicate.cells[1].key; assert.equal(MazeGenerator.validate(duplicate).valid,false);
const fake=clone(); fake.cells[1].answer=101; assert.throws(()=>checkMaze(fake,config));
assert.throws(()=>MazeGenerator.generate({size:3}));
assert.throws(()=>MazeGenerator.generate({max:10}));
assert.throws(()=>MazeGenerator.generate({difficulty:'invalid'}));
console.log(`PASS: ${mazeCount} mazes, ${questionCount} checked arithmetic questions, 10 negative/invalid checks.`);
