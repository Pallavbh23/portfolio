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

    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    nodes.forEach((n) => {
      n.edges.forEach((eid) => {
        const target = nodes[eid];
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      });
    });

    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = visited.has(n.id) ? "#14B8A6" : "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#0B1220";
      ctx.stroke();
      ctx.fillStyle = "#0B1220";
      ctx.font = '14px system-ui, sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(n.id), n.x, n.y);
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
      <div className="flex gap-4 mb-4">
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
          className="bg-indigo-600 text-white px-3 py-1 rounded"
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
          className="bg-teal-500 text-white px-3 py-1 rounded"
          onClick={() => bfs(0)}
        >
          BFS from 0
        </button>
        <button
          className="bg-teal-500 text-white px-3 py-1 rounded"
          onClick={() => dfs(0)}
        >
          DFS from 0
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="border border-cloud rounded max-w-full h-auto"
      />
    </div>
  );
}
