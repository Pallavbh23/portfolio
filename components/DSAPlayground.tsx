"use client";
import { useState, useEffect, useRef } from "react";

// ---------------- Shared Utilities ----------------
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ---------------- Graph Traversal (Existing) ----------------
type GNode = { id: number; x: number; y: number; edges: number[] };
function generateGraph(nodeCount: number, density: number): GNode[] {
  const nodes: GNode[] = Array.from({ length: nodeCount }, (_, i) => ({
    id: i,
    x: Math.random() * 600,
    y: Math.random() * 400,
    edges: [],
  }));
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      if (Math.random() < density) {
        nodes[i].edges.push(j);
        nodes[j].edges.push(i);
      }
    }
  }
  return nodes;
}
function GraphTraversal({ speed }: { speed: number }) {
  const [nodeCount, setNodeCount] = useState(8);
  const [density, setDensity] = useState(0.3);
  const [nodes, setNodes] = useState<GNode[]>(() => generateGraph(8, 0.3));
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    // grid
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = 1;
    const grid = 40;
    for (let x = 0; x < width; x += grid) { ctx.beginPath(); ctx.moveTo(x+0.5,0); ctx.lineTo(x+0.5,height); ctx.stroke(); }
    for (let y = 0; y < height; y += grid) { ctx.beginPath(); ctx.moveTo(0,y+0.5); ctx.lineTo(width,y+0.5); ctx.stroke(); }
    ctx.restore();
    // edges
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.25;
    nodes.forEach((n) => {
      n.edges.forEach((eid) => {
        if (eid < n.id) return;
        const target = nodes[eid];
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      });
    });
    // nodes
    nodes.forEach((n) => {
      const r = 24;
      ctx.beginPath();
      ctx.moveTo(n.x, n.y - r);
      ctx.lineTo(n.x + r, n.y);
      ctx.lineTo(n.x, n.y + r);
      ctx.lineTo(n.x - r, n.y);
      ctx.closePath();
      ctx.fillStyle = visited.has(n.id) ? '#4f46e5' : '#ffffff';
      ctx.shadowColor = visited.has(n.id) ? 'rgba(79,70,229,0.45)' : 'rgba(15,23,42,0.12)';
      ctx.shadowBlur = visited.has(n.id) ? 18 : 8;
      ctx.shadowOffsetY = 4;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = visited.has(n.id) ? '#6366f1' : '#cbd5e1';
      ctx.stroke();
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = visited.has(n.id) ? '#eef2ff' : '#0f172a';
      ctx.font = '600 14px system-ui, -apple-system, sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(n.id), n.x, n.y+1);
    });
  }, [nodes, visited]);

  async function bfs(start: number) {
    if (runningRef.current) return; runningRef.current = true;
    const seen = new Set<number>();
    const queue: number[] = [start];
    while (queue.length) {
      const current = queue.shift()!;
      if (seen.has(current)) continue;
      seen.add(current);
      setVisited(new Set(seen));
      await sleep(speed);
      nodes[current].edges.forEach((n) => { if (!seen.has(n)) queue.push(n); });
    }
    runningRef.current = false;
  }
  async function dfs(start: number) {
    if (runningRef.current) return; runningRef.current = true;
    const seen = new Set<number>();
    async function visit(n: number) {
      if (seen.has(n)) return;
      seen.add(n);
      setVisited(new Set(seen));
      await sleep(speed);
      for (const neighbor of nodes[n].edges) { await visit(neighbor); }
    }
    await visit(start);
    runningRef.current = false;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-xs">
        <label className="flex items-center gap-1">Nodes:
          <input type="number" value={nodeCount} min={3} max={15} onChange={e=>setNodeCount(Number(e.target.value))} className="border ml-1 w-16 rounded px-1 py-0.5 bg-background" />
        </label>
        <label className="flex items-center gap-1">Density:
          <input type="number" step="0.1" value={density} min={0.1} max={1} onChange={e=>setDensity(Number(e.target.value))} className="border ml-1 w-16 rounded px-1 py-0.5 bg-background" />
        </label>
        <button onClick={()=>{setVisited(new Set()); setNodes(generateGraph(nodeCount, density));}} className="px-2 py-1 rounded bg-indigo-600 text-white text-xs">New Graph</button>
        <button onClick={()=>bfs(0)} className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">BFS</button>
        <button onClick={()=>dfs(0)} className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">DFS</button>
        <button onClick={()=>setVisited(new Set())} className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-xs">Reset</button>
      </div>
      <canvas ref={canvasRef} width={800} height={480} className="border border-border rounded-lg max-w-full h-auto bg-card" />
    </div>
  );
}

// ---------------- Tower of Hanoi ----------------
interface HanoiMove { from: number; to: number; }
function generateHanoiMoves(n: number, from: number, to: number, aux: number, acc: HanoiMove[]) {
  if (n === 0) return; generateHanoiMoves(n-1, from, aux, to, acc); acc.push({from, to}); generateHanoiMoves(n-1, aux, to, from, acc);
}
function TowerOfHanoi({ speed }: { speed: number }) {
  const [disks, setDisks] = useState(4);
  const [pegs, setPegs] = useState<number[][]>([[],[],[]]);
  const [running, setRunning] = useState(false);
  useEffect(()=>{ setPegs([Array.from({length:disks},(_,i)=>disks-i),[],[]]); },[disks]);

  async function play() {
    if (running) return; setRunning(true);
    const moves: HanoiMove[] = [];
    generateHanoiMoves(disks,0,2,1,moves);
    const local = pegs.map(p=>[...p]);
    for (const mv of moves) {
      const d = local[mv.from].pop()!;
      local[mv.to].push(d);
      setPegs(local.map(p=>[...p]));
      await sleep(speed);
    }
    setRunning(false);
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-xs items-center">
        <label className="flex items-center gap-1">Disks:
          <input type="number" min={1} max={8} value={disks} onChange={e=>setDisks(Number(e.target.value))} disabled={running} className="border ml-1 w-16 rounded px-1 py-0.5 bg-background" />
        </label>
        <button onClick={play} disabled={running} className="px-2 py-1 rounded bg-indigo-600 text-white text-xs disabled:opacity-40">Play</button>
        <button onClick={()=>setPegs([Array.from({length:disks},(_,i)=>disks-i),[],[]])} disabled={running} className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-xs">Reset</button>
        <div className="text-[10px] text-muted-foreground">Moves optimal: {Math.pow(2,disks)-1}</div>
      </div>
      <div className="flex justify-around items-end h-80 border border-border rounded-lg bg-card px-4 py-6">
        {pegs.map((peg,pi)=>(
          <div key={pi} className="flex flex-col-reverse items-center gap-1 w-1/3">
            <div className="w-1 bg-border flex-1" />
            {peg.map((d,i)=>(
              <div key={i} className="h-5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 shadow text-[10px] font-mono text-white flex items-center justify-center" style={{width:`${(d/disks)*100}%`, minWidth: 24}}>{d}</div>
            ))}
            <div className="mt-2 text-[10px] text-muted-foreground">Peg {pi+1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Sorting Visualizer (Bubble Sort) ----------------
function SortingVisualizer({ speed }: { speed: number }) {
  const [size, setSize] = useState(24);
  const [arr, setArr] = useState<number[]>([]);
  const [iIdx,setIIdx] = useState<number|null>(null);
  const [jIdx,setJIdx] = useState<number|null>(null);
  const [running,setRunning] = useState(false);
  useEffect(()=>{ reset(); },[]); // eslint-disable-line
  function reset() { const a = Array.from({length:size},()=>Math.floor(Math.random()*100)+5); setArr(a); setIIdx(null); setJIdx(null); }
  async function sort() {
    if (running) return; setRunning(true);
    const a = [...arr];
    for (let i=0;i<a.length;i++) {
      setIIdx(i);
      for (let j=0;j<a.length-i-1;j++) {
        setJIdx(j);
        if (a[j] > a[j+1]) { [a[j],a[j+1]] = [a[j+1],a[j]]; setArr([...a]); }
        await sleep(speed/4);
      }
    }
    setIIdx(null); setJIdx(null); setRunning(false);
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-xs items-center">
        <label className="flex items-center gap-1">Size:
          <input type="number" min={5} max={64} value={size} onChange={e=>{setSize(Number(e.target.value));}} disabled={running} className="border ml-1 w-20 rounded px-1 py-0.5 bg-background" />
        </label>
        <button onClick={()=>{ if(running) return; reset(); }} className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-xs">Randomize</button>
        <button onClick={()=>{reset(); sort();}} disabled={running} className="px-2 py-1 rounded bg-indigo-600 text-white text-xs disabled:opacity-40">Bubble Sort</button>
      </div>
      <div className="h-80 border border-border rounded-lg bg-card flex items-end gap-[2px] p-2 overflow-hidden">
        {arr.map((v,idx)=>(
          <div key={idx} className={`flex-1 rounded-t ${idx===iIdx? 'bg-rose-500': idx===jIdx? 'bg-indigo-500':'bg-indigo-300 dark:bg-indigo-700'} transition-all`} style={{height:`${v}%`, minWidth:4}} />
        ))}
      </div>
    </div>
  );
}

// ---------------- N-Queens ----------------
interface Coord { r: number; c: number; }
function NQueens({ speed }: { speed: number }) {
  const [n,setN] = useState(6);
  const [board,setBoard] = useState<number[]>(Array(6).fill(-1)); // board[row] = col
  const [running,setRunning] = useState(false);
  const [currentRow,setCurrentRow] = useState<number|null>(null);
  const [solutions,setSolutions] = useState<number>(0);
  useEffect(()=>{ setBoard(Array(n).fill(-1)); setSolutions(0); },[n]);
  function safe(row:number,col:number, b:number[]) {
    for (let r=0;r<row;r++) {
      const c = b[r];
      if (c===col || Math.abs(c-col)===Math.abs(r-row)) return false;
    }
    return true;
  }
  async function solve() {
    if (running) return; setRunning(true); setSolutions(0);
    const b = Array(n).fill(-1);
    let count = 0;
    async function backtrack(row:number) {
      if (row===n) { count++; setSolutions(count); return; }
      setCurrentRow(row);
      for (let col=0; col<n; col++) {
        if (safe(row,col,b)) {
          b[row]=col; setBoard([...b]); await sleep(speed);
          await backtrack(row+1);
          b[row]=-1; setBoard([...b]); await sleep(speed/4);
        }
      }
    }
    await backtrack(0);
    setCurrentRow(null); setRunning(false);
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-xs items-center">
        <label className="flex items-center gap-1">N:
          <input type="number" min={4} max={10} value={n} onChange={e=>setN(Number(e.target.value))} disabled={running} className="border ml-1 w-16 rounded px-1 py-0.5 bg-background" />
        </label>
        <button onClick={solve} disabled={running} className="px-2 py-1 rounded bg-indigo-600 text-white text-xs disabled:opacity-40">Solve</button>
        <button onClick={()=>{ if(running) return; setBoard(Array(n).fill(-1)); setSolutions(0); }} className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-xs">Reset</button>
        <div className="text-[10px] text-muted-foreground">Solutions: {solutions}</div>
      </div>
      <div className="inline-block border border-border rounded overflow-hidden shadow">
        {Array.from({length:n}).map((_,r)=>(
          <div key={r} className="flex">
            {Array.from({length:n}).map((__,c)=>{
              const queen = board[r]===c;
              const dark = (r+c)%2===1;
              return (
                <div key={c} className={`w-10 h-10 flex items-center justify-center text-xs font-semibold ${dark? 'bg-slate-400/30 dark:bg-slate-600/40':'bg-slate-100 dark:bg-slate-800'} ${queen? 'text-rose-600':'text-slate-500'} ${currentRow===r? 'ring-2 ring-indigo-500':''}`}>{queen? '♛':''}</div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Binary Search ----------------
function BinarySearchExplorer({ speed }: { speed: number }) {
  const [size,setSize] = useState(32);
  const [arr,setArr] = useState<number[]>([]);
  const [target,setTarget] = useState<number>(0);
  const [targetInput,setTargetInput] = useState<string>('');
  const [lo,setLo] = useState<number|null>(null);
  const [hi,setHi] = useState<number|null>(null);
  const [mid,setMid] = useState<number|null>(null);
  const [found,setFound] = useState<number|null>(null);
  const [running,setRunning] = useState(false);
  useEffect(()=>{ reset(true); },[]); // eslint-disable-line
  function makeArray(n:number){ return Array.from({length:n},(_,i)=>i*2); }
  function reset(preserveTarget=false) { const a = makeArray(size); setArr(a); const t = preserveTarget && a.includes(target)? target : a[Math.floor(Math.random()*a.length)]; setTarget(t); setTargetInput(String(t)); setLo(null); setHi(null); setMid(null); setFound(null); }
  function snapToValid(val:number){ if (arr.length===0) return val; const min=arr[0], max=arr[arr.length-1]; if (val<min) val=min; if (val>max) val=max; const even = Math.round(val/2)*2; return Math.min(max, Math.max(min, even)); }
  function commitTarget() { if (running) return; if (targetInput.trim()==='') { setTargetInput(String(target)); return; } const num = Number(targetInput); if (Number.isNaN(num)) { setTargetInput(String(target)); return; } const snapped = snapToValid(num); setTarget(snapped); setTargetInput(String(snapped)); }
  async function search() {
    if (running) return; commitTarget(); setRunning(true); let l=0,r=arr.length-1; setLo(l); setHi(r); setFound(null);
    while (l<=r) { const m = Math.floor((l+r)/2); setMid(m); await sleep(speed/2); if (arr[m]===target) { setFound(m); break; } if (arr[m]<target) { l=m+1; } else { r=m-1; } setLo(l); setHi(r); }
    setRunning(false);
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-xs items-center">
        <label className="flex items-center gap-1">Size:
          <input type="number" min={8} max={128} value={size} onChange={e=>{ if(running) return; setSize(Number(e.target.value)); }} disabled={running} className="border ml-1 w-20 rounded px-1 py-0.5 bg-background" />
        </label>
        <label className="flex items-center gap-1">Target:
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={targetInput}
            onChange={e=>{ const v=e.target.value; if (/^[0-9]*$/.test(v)) { setTargetInput(v); } }}
            onBlur={commitTarget}
            onKeyDown={e=>{ if(e.key==='Enter') { commitTarget(); } }}
            disabled={running}
            className="border ml-1 w-24 rounded px-1 py-0.5 bg-background"
            placeholder="even"
          />
        </label>
        <button onClick={()=>reset(true)} disabled={running} className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-xs">Rebuild</button>
        <button onClick={()=>{ if(running) return; const t = arr[Math.floor(Math.random()*arr.length)]; setTarget(t); setTargetInput(String(t)); }} disabled={running} className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-xs">Random Target</button>
        <button onClick={search} disabled={running} className="px-2 py-1 rounded bg-indigo-600 text-white text-xs disabled:opacity-40">Search</button>
        <div className="text-[10px] text-muted-foreground">Range: {arr[0]} – {arr[arr.length-1]} (evens)</div>
        {found!==null && <div className="text-[10px] text-emerald-600">Found index {found}</div>}
      </div>
      <div className="flex flex-wrap gap-1 max-w-full">
        {arr.map((v,i)=>(
          <div key={i} className={`px-2 py-1 rounded text-[10px] font-mono border ${i===mid? 'bg-indigo-600 text-white border-indigo-600': i===found? 'bg-emerald-600 text-white border-emerald-600': (lo!==null && hi!==null && (i<lo || i>hi))? 'opacity-30 border-transparent':'bg-card border-border'}`}>{v}</div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Main Playground Wrapper ----------------
const MODES = [
  { id: 'graph', label: 'Graph Traversal (BFS / DFS)', component: GraphTraversal, blurb: 'Explore BFS vs DFS order on a random undirected graph.' },
  { id: 'hanoi', label: 'Tower of Hanoi', component: TowerOfHanoi, blurb: 'Classic recursive puzzle – optimal moves 2^n - 1.' },
  { id: 'sort', label: 'Sorting Visualizer', component: SortingVisualizer, blurb: 'Animated Bubble Sort (O(n^2)) on random array.' },
  { id: 'nqueens', label: 'N-Queens Solver', component: NQueens, blurb: 'Backtracking placement of queens so none attack each other.' },
  { id: 'binary', label: 'Binary Search Explorer', component: BinarySearchExplorer, blurb: 'Halve the search space each probe on a sorted array.' },
];

export default function DSAPlayground() {
  const [mode,setMode] = useState<string>('hanoi');
  const [speed,setSpeed] = useState(500);
  const active = MODES.find(m=>m.id===mode)!;
  const ActiveComponent = active.component as any;
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Playground</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">Interactive algorithm mini-games. Choose one below and tweak parameters or speed to see the underlying mechanics. Great for quick intuition pumps.</p>
      </div>
      <div className="flex flex-wrap gap-4 items-end">
        <label className="text-sm">Game
          <select value={mode} onChange={e=>setMode(e.target.value)} className="block mt-1 border rounded px-2 py-1 bg-background">
            {MODES.map(m=> <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </label>
        <label className="text-sm">Speed (ms / step)
          <input type="number" value={speed} min={20} max={2000} onChange={e=>setSpeed(Number(e.target.value))} className="block mt-1 border rounded px-2 py-1 w-28 bg-background" />
        </label>
        <div className="text-[11px] font-mono text-muted-foreground max-w-sm leading-snug">{active.blurb}</div>
      </div>
      <div>
        <ActiveComponent speed={speed} />
      </div>
      <div className="pt-4 border-t border-border text-[11px] text-muted-foreground space-y-1 max-w-2xl">
        <p>Implemented mini-games: {MODES.map(m=>m.label).join(' • ')}.</p>
        <p>Ideas for future additions: Dijkstra / A*, Segment Trees, Union-Find visualizer, Trie explorer.</p>
      </div>
    </div>
  );
}
