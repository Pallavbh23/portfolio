"use client";
import { useState, useEffect, useRef } from "react";

type Node = { id: number; x: number; y: number; edges: number[] };

function generateGraph(nodeCount: number, density: number): Node[] {
  const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => ({
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

export default function DSAPlayground() {
  const [nodeCount, setNodeCount] = useState(8);
  const [density, setDensity] = useState(0.3);
  const [speed, setSpeed] = useState(500);
  const [nodes, setNodes] = useState<Node[]>(() => generateGraph(8, 0.3));
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // background subtle grid
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = 1;
    const grid = 40;
    for (let x = 0; x < width; x += grid) {
      ctx.beginPath(); ctx.moveTo(x+0.5,0); ctx.lineTo(x+0.5,height); ctx.stroke();
    }
    for (let y = 0; y < height; y += grid) {
      ctx.beginPath(); ctx.moveTo(0,y+0.5); ctx.lineTo(width,y+0.5); ctx.stroke();
    }
    ctx.restore();

    // edges
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.25;
    nodes.forEach((n) => {
      n.edges.forEach((eid) => {
        if (eid < n.id) return; // draw once
        const target = nodes[eid];
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      });
    });

    // nodes as diamonds
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
    const seen = new Set<number>();
    const queue: number[] = [start];
    while (queue.length) {
      const current = queue.shift()!;
      if (seen.has(current)) continue;
      seen.add(current);
      setVisited(new Set(seen));
      await new Promise((r) => setTimeout(r, speed));
      nodes[current].edges.forEach((n) => {
        if (!seen.has(n)) queue.push(n);
      });
    }
  }

  async function dfs(start: number) {
    const seen = new Set<number>();
    async function visit(n: number) {
      if (seen.has(n)) return;
      seen.add(n);
      setVisited(new Set(seen));
      await new Promise((r) => setTimeout(r, speed));
      for (const neighbor of nodes[n].edges) {
        await visit(neighbor);
      }
    }
    await visit(start);
  }

  return (
    <div>
      <div className="flex gap-4 mb-4 flex-wrap">
        <label>
          Nodes:
          <input
            type="number"
            value={nodeCount}
            min={3}
            max={15}
            onChange={(e) => setNodeCount(Number(e.target.value))}
            className="border ml-2 w-16"
          />
        </label>
        <label>
          Density:
          <input
            type="number"
            step="0.1"
            value={density}
            min={0.1}
            max={1}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="border ml-2 w-16"
          />
        </label>
        <label>
          Speed (ms):
          <input
            type="number"
            value={speed}
            min={50}
            max={2000}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="border ml-2 w-20"
          />
        </label>
        <button
          className="bg-indigo-600 text-white px-3 py-1 rounded shadow hover:shadow-md transition"
          onClick={() => {
            setVisited(new Set());
            setNodes(generateGraph(nodeCount, density));
          }}
        >
          New Graph
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        <button
          className="bg-primary text-primary-foreground px-3 py-1 rounded shadow hover:shadow-md transition"
          onClick={() => bfs(0)}
        >
          BFS from 0
        </button>
        <button
          className="bg-primary text-primary-foreground px-3 py-1 rounded shadow hover:shadow-md transition"
          onClick={() => dfs(0)}
        >
          DFS from 0
        </button>
        <button
          className="bg-slate-200 text-slate-800 px-3 py-1 rounded shadow hover:shadow-md transition dark:bg-slate-700 dark:text-slate-100"
          onClick={() => setVisited(new Set())}
        >
          Reset Visited
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={480}
        className="border border-border rounded-lg max-w-full h-auto bg-card"
      />
    </div>
  );
}
