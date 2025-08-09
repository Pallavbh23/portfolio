"use client";
import { useEffect, useMemo, useRef, useState } from "react";

interface RepoLite {
  name: string;
  description: string | null;
  stargazers_count: number;
  html_url: string;
}

// AI keyword detection (simple heuristic)
const AI_KEYWORDS = [
  'ai','ml','llm','deep learning','machine learning','chat','chatbot','neural','transformer','gpt','langchain'
];
const SHORT_TOKENS = ['ai','ml','llm'];
const PHRASE_KEYWORDS = ['deep learning','machine learning','chat','chatbot','neural','transformer','gpt','langchain'];
const shortTokenRegex = /(^|[^a-z0-9])(ai|ml|llm)([^a-z0-9]|$)/i; // boundaries: start or non-alnum before/after
const isAIRepo = (r: RepoLite) => {
  const text = (r.name + ' ' + (r.description || '')).toLowerCase();
  // Check phrases (simple includes)
  if (PHRASE_KEYWORDS.some(k => text.includes(k))) return true;
  // Boundary-aware short tokens
  if (shortTokenRegex.test(text)) return true;
  return false;
};

// Priority function:
// 1. Any repo with >=1000 stars outranks everything.
// 2. Otherwise AI-tagged repos outrank non-AI regardless of star count.
// 3. Within same class, higher stars wins; tie-break by name for stability.
const priority = (r: RepoLite) => {
  if (r.stargazers_count >= 1000) return 2_000_000 + r.stargazers_count;
  if (isAIRepo(r)) return 1_000_000 + r.stargazers_count; // offset keeps all AI above any non-AI <1000 stars
  return r.stargazers_count;
};

// Heap helpers
const compare = (a: RepoLite, b: RepoLite) => {
  const pa = priority(a), pb = priority(b);
  if (pa !== pb) return pa - pb; // max-heap semantics (higher priority up)
  return a.name.localeCompare(b.name);
};
function heapifyDown(arr: RepoLite[], i: number) {
  const n = arr.length;
  while (true) {
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    let largest = i;
    if (l < n && compare(arr[l], arr[largest]) > 0) largest = l;
    if (r < n && compare(arr[r], arr[largest]) > 0) largest = r;
    if (largest !== i) { [arr[i], arr[largest]] = [arr[largest], arr[i]]; i = largest; } else break;
  }
}
function heapifyUp(arr: RepoLite[], i: number) {
  while (i > 0) {
    const p = Math.floor((i - 1) / 2);
    if (compare(arr[i], arr[p]) > 0) { [arr[i], arr[p]] = [arr[p], arr[i]]; i = p; } else break;
  }
}
function buildHeap(items: RepoLite[]): RepoLite[] { const h = [...items]; for (let i = Math.floor(h.length / 2) - 1; i >= 0; i--) heapifyDown(h, i); return h; }
function levels(arr: RepoLite[]) { const out: RepoLite[][] = []; let i=0, w=1; while(i<arr.length){ out.push(arr.slice(i,i+w)); i+=w; w*=2; } return out; }

export default function ProjectsHeapStack({ repos }: { repos: RepoLite[] }) {
  const initial = useMemo(() => buildHeap(repos), [repos]);
  const [heap, setHeap] = useState<RepoLite[]>(initial);
  const [stack, setStack] = useState<RepoLite[]>([]); // top = index 0
  const lastBatchRef = useRef<string>("");

  useEffect(() => { setHeap(buildHeap(repos)); }, [repos]);

  // Generic popMany (count undefined => all)
  const popMany = (count?: number) => {
    setHeap(prev => {
      const h = [...prev];
      const popped: RepoLite[] = [];
      const limit = count === undefined ? prev.length : count;
      for (let i = 0; i < limit && h.length; i++) {
        popped.push(h[0]);
        const last = h.pop()!;
        if (h.length) { h[0] = last; heapifyDown(h,0); }
      }
      if (popped.length) {
        const signature = popped.map(p=>p.html_url).join('|') + '::' + h.length;
        if (signature !== lastBatchRef.current) {
          lastBatchRef.current = signature;
          setStack(s => {
            // Reverse popped to mimic sequential pushes (latest popped at top)
            const batch = [...popped].reverse();
            const next = [...batch, ...s];
            return next;
          });
        }
      }
      return h;
    });
  };

  const opPop = () => popMany(1);
  const opPop3 = () => popMany(3);
  const opPopAll = () => popMany();

  // Pop from stack (top = first element)
  const opStackPop = () => {
    if (!stack.length) return;
    const [top, ...rest] = stack;
    setStack(rest);
    setHeap(prev => {
      if (prev.some(r => r.html_url === top.html_url)) return prev;
      const next = [...prev, top];
      heapifyUp(next, next.length - 1);
      return next;
    });
  };

  const heapLevels: RepoLite[][] = levels(heap);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
        I have shipped a lot of GitHub projects over the years. To make browsing less of a scroll-fest, this section uses a living <a href="https://medium.com/@amitai.turkel/understanding-the-max-min-heap-and-its-importance-f1f0e819184e" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted text-current">max-heap</a> so the most relevant work floats to the top. Relevance here is a composite priority: AI / ML / LLM–leaning projects (keyword heuristic with word-boundaries) outrank others unless something has truly massive stars (≥1000). Within each tier, higher stars win, then name for stability. Pop the root (1, 3, or all) to peel off the current highest-priority projects—they cascade into the stack (LIFO). Pop the stack to reinsert them and dynamically re-prioritize as you explore.
      </p>
      <div className="text-[11px] font-mono text-muted-foreground max-w-xl leading-snug">
        Priority formula: if stars &gt;= 1000 ⇒ 2,000,000 + stars; else if AI ⇒ 1,000,000 + stars; else ⇒ stars. (AI detected via: {AI_KEYWORDS.join(', ')}).
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Heap */}
        <div className="flex-1 min-w-[320px] space-y-4">
          <div className="flex flex-wrap gap-2">
            <button onClick={opPop} disabled={!heap.length} className="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-500">Pop</button>
            <button onClick={opPop3} disabled={!heap.length} className="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-500">Pop 3</button>
            <button onClick={opPopAll} disabled={!heap.length} className="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-500">Pop All</button>
            <div className="text-xs font-mono text-muted-foreground self-center ml-auto">Heap size: {heap.length}</div>
          </div>
          <div className="relative border border-border rounded-xl p-5 bg-card/60 backdrop-blur-sm overflow-x-auto">
            {heap.length === 0 && (
              <div className="text-sm text-muted-foreground">Heap empty. Rehydrate from the stack →</div>
            )}
            <div className="flex flex-col items-center gap-6 min-w-[640px] py-2 select-none">
              {heapLevels.map((lvl: RepoLite[], li: number) => (
                <div key={li} className="flex justify-center gap-6">
                  {lvl.map((repo: RepoLite, idx: number) => {
                    const index = Math.pow(2, li) - 1 + idx; // array index
                    const ai = isAIRepo(repo);
                    return (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={repo.html_url}
                        key={repo.html_url}
                        className="group relative w-40 rounded-lg border border-border bg-background/70 hover:bg-accent transition shadow-sm p-3 flex flex-col gap-2"
                        title={`${repo.name} • ${repo.stargazers_count}★${ai ? ' • AI' : ''}`}
                      >
                        <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded ${ai ? 'bg-rose-600/10 text-rose-600' : 'bg-indigo-600/10 text-indigo-600'} font-medium`}>{repo.stargazers_count}★{ai && '•AI'}</span>
                          <span className="opacity-60">#{index}</span>
                        </div>
                        <div className="text-sm font-semibold leading-tight line-clamp-2">{repo.name}</div>
                        {repo.description && (
                          <div className="text-xs text-muted-foreground line-clamp-3 leading-snug">{repo.description}</div>
                        )}
                      </a>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* RIGHT: Stack */}
        <div className="flex-1 min-w-[320px] space-y-4">
          <div className="flex flex-wrap gap-2">
            <button onClick={opStackPop} disabled={!stack.length} className="px-3 py-1.5 text-sm rounded bg-rose-600 text-white disabled:opacity-40 hover:bg-rose-500">Pop (return to heap)</button>
            <div className="text-xs font-mono text-muted-foreground self-center ml-auto">Stack size: {stack.length}</div>
          </div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-mono">Stack (LIFO)</div>
          <div className="h-2" aria-hidden />
          <div className="relative border-x border-b border-border rounded-b-xl bg-card/70 backdrop-blur-sm h-[480px] flex flex-col shadow-sm">
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-3">
              {stack.length === 0 && (
                <div className="text-sm text-muted-foreground py-2">Empty — pop items from heap to fill.</div>
              )}
              {stack.map((repo, i) => {
                const ai = isAIRepo(repo);
                return (
                  <a
                    key={repo.html_url + i}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-border bg-background/70 hover:bg-accent transition p-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold truncate max-w-[60%]">{repo.name}</div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${ai ? 'bg-rose-600/10 text-rose-600' : 'bg-indigo-600/10 text-indigo-600'}`}>{repo.stargazers_count}★{ai && '•AI'}</span>
                    </div>
                    {repo.description && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-snug">{repo.description}</p>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
