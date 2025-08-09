"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

type Node = { id: string; x: number; y: number; href?: string };
type Edge = { from: string; to: string };

const nodes: Node[] = [
  { id: "Start", x: 80, y: 220 },
  { id: "About", x: 260, y: 120, href: "#about" },
  { id: "Work", x: 420, y: 220, href: "#work" },
  { id: "Projects", x: 600, y: 120, href: "#projects" },
  { id: "Writing", x: 600, y: 320, href: "#writing" },
  { id: "Playground", x: 780, y: 220, href: "#playground" },
  { id: "Contact", x: 960, y: 220, href: "#contact" },
];

const edges: Edge[] = [
  { from: "Start", to: "About" },
  { from: "About", to: "Work" },
  { from: "Work", to: "Projects" },
  { from: "Work", to: "Writing" },
  { from: "Projects", to: "Playground" },
  { from: "Writing", to: "Playground" },
  { from: "Playground", to: "Contact" },
];

export default function GraphHero() {
  const [hover, setHover] = useState<string | null>(null);
  const coordinates = useMemo(() => {
    const map = new Map(nodes.map((n) => [n.id, n]));
    return edges.map((e) => ({
      x1: map.get(e.from)!.x,
      y1: map.get(e.from)!.y,
      x2: map.get(e.to)!.x,
      y2: map.get(e.to)!.y,
      id: `${e.from}-${e.to}`,
    }));
  }, []);

  return (
    <section className="relative container pt-16 pb-24">
      <div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
          I build reliable payment flows and{" "}
          <span className="background text-ink px-2 rounded">
            clean data pipes
          </span>
          .
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Python • Kafka • Redis • MySQL • Spring Boot • AWS
        </p>
      </div>

      <div className="mt-10 rounded-xl bg-mist border border-cloud/70 shadow-card overflow-hidden">
        <svg viewBox="0 0 1040 420" className="w-full h-[420px]">
          <AnimatePresence>
            {coordinates.map((c) => (
              <motion.line
                key={c.id}
                x1={c.x1}
                y1={c.y1}
                x2={c.x2}
                y2={c.y2}
                stroke={
                  hover && c.id.includes(hover)
                    ? "#14B8A6"
                    : "rgba(11,18,32,0.15)"
                }
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2 }}
              />
            ))}
          </AnimatePresence>

          {nodes.map((n) => (
            <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
              <motion.circle
                r={28}
                fill="#FFFFFF"
                stroke="rgba(11,18,32,0.2)"
                strokeWidth={2}
                whileHover={{ scale: 1.07 }}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
              />
              {n.href ? (
                <Link href={n.href}>
                  <text
                    textAnchor="middle"
                    y="6"
                    className="cursor-pointer fill-ink font-medium"
                  >
                    {n.id}
                  </text>
                </Link>
              ) : (
                <text
                  textAnchor="middle"
                  y="6"
                  className="fill-ink font-medium"
                >
                  {n.id}
                </text>
              )}
            </g>
          ))}
        </svg>
        <div className="px-6 pb-6 text-sm text-slate-500">
          enqueue node → traverse graph → update visited set ✓
        </div>
      </div>
    </section>
  );
}
