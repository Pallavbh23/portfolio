"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Types
interface GraphNode {
  id: string;
  label?: string;
  nx: number; // normalized 0..1 x
  ny: number; // normalized 0..1 y
  href?: string; // anchor
  variant?: 'primary' | 'accent' | 'neutral' | 'alt';
}
interface GraphEdge { from: string; to: string; }

// Normalized layout (roughly similar to previous positioning, flattened vertically)
const NODE_DATA: GraphNode[] = [
  { id: 'Start', nx: 0.05, ny: 0.50, variant: 'primary' },
  { id: 'About', nx: 0.20, ny: 0.28, href: '#about', variant: 'accent' },
  { id: 'Work', nx: 0.34, ny: 0.50, href: '#work', variant: 'neutral' },
  { id: 'Projects', nx: 0.50, ny: 0.20, href: '#projects', variant: 'accent' },
  { id: 'Coding Stats', nx: 0.58, ny: 0.50, href: '#coding-stats', variant: 'alt' },
  { id: 'Writing', nx: 0.50, ny: 0.80, href: '#writing', variant: 'alt' },
  { id: 'Playground', nx: 0.79, ny: 0.50, href: '#playground', variant: 'accent' },
  { id: 'Contact', nx: 0.985, ny: 0.50, href: '#contact', variant: 'neutral' },
];

const EDGE_DATA: GraphEdge[] = [
  { from: 'Start', to: 'About' },
  { from: 'About', to: 'Work' },
  { from: 'Work', to: 'Projects' },
  { from: 'Work', to: 'Coding Stats' },
  { from: 'Work', to: 'Writing' },
  { from: 'Projects', to: 'Playground' },
  { from: 'Coding Stats', to: 'Playground' },
  { from: 'Writing', to: 'Playground' },
  { from: 'Playground', to: 'Contact' },
];

// Hook: media query
function useMedia(q: string) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mm = window.matchMedia(q);
    const h = () => setM(mm.matches);
    h();
    mm.addEventListener('change', h);
    return () => mm.removeEventListener('change', h);
  }, [q]);
  return m;
}

// Smooth scroll to anchor with hash update (use native smooth scroll)
const smoothScrollTo = (href: string) => {
  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (!el) return;
  // Native smooth scrolling (respect user reduced-motion if set globally)
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Immediately update the hash (after a tick to avoid jump in some browsers)
  requestAnimationFrame(() => {
    history.replaceState(null, '', href);
  });
};

// Reduced motion check
function usePrefersReducedMotion() {
  return useMedia('(prefers-reduced-motion: reduce)');
}

// Choose color tokens by variant
function variantFill(_v?: GraphNode['variant'], active?: boolean) {
  // Active now ONLY reflects hover state; focus no longer forces color
  if (active) return 'hsl(var(--primary))';
  return 'hsl(var(--card))';
}

function variantText(_v?: GraphNode['variant'], active?: boolean) {
  return active ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))';
}

// Utility to shorten edge so arrowhead doesn't overlap node shape
function shorten(x1:number,y1:number,x2:number,y2:number, delta:number){
  const dx = x2 - x1; const dy = y2 - y1; const len = Math.hypot(dx,dy) || 1;
  // Initial cap so we never invert
  let d = Math.max(0, Math.min(delta, (len / 2) - 2));
  // Ensure a minimum remaining visible shaft so arrow direction is visually clear (fixes Playground→Contact)
  const MIN_REMAIN = 40; // px in viewBox units
  if (len - 2*d < MIN_REMAIN) {
    d = Math.max(0, (len - MIN_REMAIN) / 2);
  }
  const ux = dx/len; const uy = dy/len;
  return { sx: x1 + ux*d, sy: y1 + uy*d, ex: x2 - ux*d, ey: y2 - uy*d };
}

export default function GraphHero() {
  const prefersReduced = usePrefersReducedMotion();
  const isCompact = useMedia('(max-width: 640px)');
  const ultraCompact = useMedia('(max-width: 430px)');
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string>('Start');
  const nodeRefs = useRef<Record<string, SVGGElement | null>>({});

  // Build maps
  const nodeMap = useMemo(() => new Map(NODE_DATA.map(n => [n.id, n])), []);
  const adjacency = useMemo(() => {
    const out: Record<string, string[]> = {};
    NODE_DATA.forEach(n => { out[n.id] = []; });
    EDGE_DATA.forEach(e => { out[e.from].push(e.to); });
    return out;
  }, []);

  // Build first-parent map via BFS from Start to obtain a single canonical path to any node
  const parentMap = useMemo(() => {
    const start = 'Start';
    const map = new Map<string, string | undefined>();
    if (!adjacency[start]) return map;
    map.set(start, undefined);
    const q: string[] = [start];
    while (q.length) {
      const cur = q.shift()!;
      for (const nxt of adjacency[cur] || []) {
        if (!map.has(nxt)) { // first path wins
          map.set(nxt, cur);
          q.push(nxt);
        }
      }
    }
    return map;
  }, [adjacency]);

  // Current hovered path (from Start to hovered) as a Set for O(1) lookup
  const pathSet = useMemo(() => {
    if (!hoverId) return new Set<string>();
    const s = new Set<string>();
    let cur: string | undefined = hoverId;
    while (cur) {
      s.add(cur);
      if (cur === 'Start') break;
      cur = parentMap.get(cur);
    }
    return s;
  }, [hoverId, parentMap]);

  // Dimensions for SVG viewBox
  const VB_WIDTH = 1000;
  const VB_HEIGHT = 360; // a bit shorter

  // Compute absolute coordinates once
  const coords = useMemo(() => {
    return EDGE_DATA.map(e => {
      const a = nodeMap.get(e.from)!; const b = nodeMap.get(e.to)!;
      return { id:`${e.from}-${e.to}`, from:e.from, to:e.to, a, b };
    });
  }, [nodeMap]);

  // Focus first node on mount
  useEffect(() => {
    const g = nodeRefs.current[focusId];
    g?.focus?.();
  }, [focusId]);

  // Keyboard directional navigation
  const handleDirectionalNav = useCallback((current: string, key: string) => {
    const cur = nodeMap.get(current);
    if (!cur) return;
    const candidates = NODE_DATA.filter(n => n.id !== current);
    let filtered: GraphNode[] = [];
    if (key === 'ArrowRight') filtered = candidates.filter(n => n.nx > cur.nx);
    if (key === 'ArrowLeft') filtered = candidates.filter(n => n.nx < cur.nx);
    if (key === 'ArrowDown') filtered = candidates.filter(n => n.ny > cur.ny);
    if (key === 'ArrowUp') filtered = candidates.filter(n => n.ny < cur.ny);
    if (filtered.length === 0) {
      // fallback: first outgoing
      const out = adjacency[current];
      if (out && out.length) setFocusId(out[0]);
      return;
    }
    // pick the nearest by Euclidean distance
    const target = filtered.reduce((best, n) => {
      const dx = n.nx - cur.nx; const dy = n.ny - cur.ny; const dist = Math.hypot(dx, dy);
      if (!best) return { node: n, dist };
      return dist < best.dist ? { node: n, dist } : best;
    }, null as null | { node: GraphNode; dist: number });
    if (target) setFocusId(target.node.id);
  }, [adjacency, nodeMap]);

  const onNodeKeyDown = useCallback((e: React.KeyboardEvent<SVGGElement>, n: GraphNode) => {
    if (['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].includes(e.key)) {
      e.preventDefault();
      handleDirectionalNav(n.id, e.key);
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && n.href) {
      e.preventDefault();
      smoothScrollTo(n.href);
    }
  }, [handleDirectionalNav]);

  const flashSection = useCallback((href:string)=>{
    const id = href.replace('#','');
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('section-flash'); // restart
    void el.offsetWidth; // force reflow
    el.classList.add('section-flash');
    setTimeout(()=>{ el.classList.remove('section-flash'); }, 3100);
  },[]);

  // Compact fallback: simple horizontally scrollable strip
  if (isCompact) {
    // Stack vertically with mini arrows indicating graph direction
    const list = NODE_DATA.filter(n=>n.href);
    return (
      <section className="relative">
        <div className="container-app py-10 md:py-14">
          <div className="mb-4 text-sm text-muted-foreground font-mono">site graph (compact)</div>
          <ul className="space-y-3" aria-label="Site sections navigation (compact graph)">
            {list.map((node, idx) => {
              const active = hoverId === node.id; // hover only
              const isLast = idx === list.length - 1;
              return (
                <li key={node.id} className="relative">
                  <button
                    onMouseEnter={() => setHoverId(node.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onFocus={() => setFocusId(node.id)}
                    onKeyDown={(e) => onNodeKeyDown(e as any, node)}
                    onClick={() => { if(node.href){ smoothScrollTo(node.href); flashSection(node.href); } }}
                    className={`w-full rounded-md px-4 py-2 text-sm font-medium text-left transition-colors flex items-center gap-2 ${active ? 'bg-primary text-primary-foreground' : 'bg-accent text-foreground hover:bg-primary/10'}`}
                  >
                    <span className="flex-1">{node.label || node.id}</span>
                  </button>
                  {!isLast && (
                    <div aria-hidden="true" className="flex justify-center py-1">
                      <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 12 12" fill="none">
                        <path d="M6 0v8M2.5 7.5 6 11l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      <div className="container-app py-14 md:py-20">
        <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">G</span>
          <span className="font-mono">site graph — navigate</span>
        </div>
        <div className="relative">
          <svg
            viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
            className="w-full h-[340px] md:h-[360px]"
            role="application"
            aria-label="Interactive site graph"
            onMouseLeave={() => setHoverId(null)}
          >
            <defs>
              <marker id="gh-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L8,4 L0,8 L2.2,4 z" fill="currentColor" />
              </marker>
            </defs>
            <AnimatePresence>
              {coords.map(c => {
                const aw = 16; // arrow avoid + node padding
                const aNode = c.a; const bNode = c.b;
                const VB_WIDTH = 1000; const VB_HEIGHT = 360; // ensure closure uses constants
                const charUnit=8.8, paddingX=44, H=58, innerBand=H/3.4; // replicate to compute width
                const labelA = aNode.label || aNode.id; const WA = Math.max(120, labelA.length*charUnit+paddingX);
                const labelB = bNode.label || bNode.id; const WB = Math.max(120, labelB.length*charUnit+paddingX);
                const padA = Math.max(WA,H)/2 + aw; const padB = Math.max(WB,H)/2 + aw;
                const x1=aNode.nx*VB_WIDTH, y1=aNode.ny*VB_HEIGHT, x2=bNode.nx*VB_WIDTH, y2=bNode.ny*VB_HEIGHT;
                const { sx, sy, ex, ey } = shorten(x1,y1,x2,y2, Math.min(padA,padB));
                const outgoingHover = hoverId === c.from;
                const anyHover = hoverId && (c.id.includes(hoverId));
                const onPath = pathSet.size && pathSet.has(c.from) && pathSet.has(c.to) && parentMap.get(c.to) === c.from;
                const stroke = onPath
                  ? 'hsl(var(--primary))'
                  : outgoingHover
                    ? 'hsl(var(--primary))'
                    : anyHover
                      ? 'hsl(var(--primary)/0.55)'
                      : 'hsl(var(--muted-foreground)/0.28)';
                const strokeWidth = onPath ? 2.4 : outgoingHover ? 2.2 : 1.6;
                return (
                  <motion.line
                    key={c.id}
                    x1={sx}
                    y1={sy}
                    x2={ex}
                    y2={ey}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    markerEnd="url(#gh-arrow)"
                    initial={prefersReduced ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: prefersReduced ? 0 : 0.7, ease: 'easeOut' }}
                  />
                );
              })}
            </AnimatePresence>

            {NODE_DATA.map(node => {
              const label = node.label || node.id;
              const inPath = pathSet.has(node.id);
              // dynamic geometry
              const charUnit = 8.8;
              const paddingX = 44;
              const H = 58;
              const innerBand = H / 3.4;
              const W = Math.max(120, label.length * charUnit + paddingX);
              const x = node.nx * VB_WIDTH;
              const y = node.ny * VB_HEIGHT;
              const path = [
                `M ${x} ${y - H / 2}`,
                `L ${x + W / 2} ${y - innerBand}`,
                `L ${x + W / 2} ${y + innerBand}`,
                `L ${x} ${y + H / 2}`,
                `L ${x - W / 2} ${y + innerBand}`,
                `L ${x - W / 2} ${y - innerBand}`,
                'Z',
              ].join(' ');

              const fillStyle = inPath ? 'hsl(var(--primary))' : 'hsl(var(--card))';
              const strokeCol = inPath ? 'hsl(var(--primary)/0.9)' : 'hsl(var(--border))';
              const textColor = inPath ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))';

              return (
                <g
                  key={node.id}
                  ref={el => { nodeRefs.current[node.id] = el; }}
                  role={node.href ? 'button' : undefined}
                  tabIndex={node.href ? 0 : -1}
                  aria-label={node.href ? `Jump to ${label}` : label}
                  data-node={node.id}
                  onMouseEnter={() => setHoverId(node.id)}
                  onMouseLeave={() => setHoverId(prev => (prev === node.id ? null : prev))}
                  onFocus={() => setFocusId(node.id)}
                  onKeyDown={e => onNodeKeyDown(e, node)}
                  onMouseDown={(e) => { e.preventDefault(); }}
                  onClick={() => node.href && (smoothScrollTo(node.href), flashSection(node.href))}
                  style={{ cursor: node.href ? 'pointer' : 'default', outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                  className="focus:outline-none focus-visible:outline-none"
                >
                  <path
                    d={path}
                    fill={fillStyle}
                    stroke={strokeCol}
                    strokeWidth={1}
                    style={{
                      filter: inPath
                        ? 'drop-shadow(0 4px 14px hsl(var(--primary)/0.55))'
                        : 'drop-shadow(0 2px 6px hsl(var(--foreground)/0.05))',
                      userSelect: 'none',
                      transition: 'fill 160ms, stroke 160ms'
                    }}
                  >
                    <title>{label}</title>
                  </path>
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fontSize={14}
                    fontFamily="var(--font-sans, system-ui, sans-serif)"
                    fontWeight={500}
                    fill={textColor}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
