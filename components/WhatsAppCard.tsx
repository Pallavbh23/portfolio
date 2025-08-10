"use client";
import { useState, useEffect, useCallback } from "react";

export default function WhatsAppCard() {
  const number = "+919671876007";
  const chatUrl = `https://wa.me/${number.replace(/^[+]/,'')}`;
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (!copied) return; const t = setTimeout(()=>setCopied(false),1800); return ()=>clearTimeout(t); }, [copied]);

  const copy = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try { await navigator.clipboard.writeText(number); setCopied(true); } catch { /* ignore */ }
  }, [number]);

  const openChat = useCallback((e: React.MouseEvent|React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(chatUrl, '_blank', 'noopener,noreferrer');
  }, [chatUrl]);

  return (
    <div className="group relative rounded-xl border border-border bg-card p-6 flex flex-col gap-3 card-hover overflow-hidden h-full">
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-emerald-500/5 via-emerald-500/0 to-emerald-500/10" />
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-medium">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 .5C7.44.5.5 7.44.5 16S7.44 31.5 16 31.5 31.5 24.56 31.5 16 24.56.5 16 .5Zm8.87 22.87c-.38 1.07-2.25 1.98-3.1 2.02-.79.04-1.77.3-6.04-1.25-5.07-1.99-8.3-7.2-8.55-7.53-.24-.33-2.04-2.71-2.04-5.17 0-2.46 1.29-3.67 1.75-4.18.46-.5 1-.63 1.33-.63.33 0 .66 0 .95.02.3.01.71-.12 1.11.84.41.96 1.39 3.41 1.52 3.66.13.25.21.54.04.87-.17.33-.26.54-.5.83-.25.29-.53.65-.75.88-.25.25-.51.52-.22 1.02.29.5 1.29 2.13 2.77 3.46 1.9 1.7 3.49 2.23 3.99 2.48.5.25.79.21 1.08-.13.29-.33 1.25-1.46 1.58-1.96.33-.5.66-.42 1.12-.25.46.17 2.92 1.37 3.41 1.62.5.25.83.38.95.58.13.21.13 1.21-.25 2.29Z"/></svg>
        </div>
        <div className="flex-1">
          <div className="text-sm uppercase tracking-wide text-muted-foreground">Phone / WhatsApp</div>
          <div className="text-lg font-semibold select-text">+91 9671876007</div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">Copy the number or open a WhatsApp chat.</p>
      <div className="mt-auto flex gap-2">
        <button
          type="button"
          onClick={copy}
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition border border-emerald-600/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 ${copied ? 'ring-2 ring-emerald-400/60' : ''}`}
          aria-label={copied ? 'Copied' : 'Copy phone number'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          type="button"
          onClick={openChat}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition border border-emerald-600/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700"
          aria-label="Open WhatsApp chat"
        >
          <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 .5C7.44.5.5 7.44.5 16S7.44 31.5 16 31.5 31.5 24.56 31.5 16 24.56.5 16 .5Zm8.87 22.87c-.38 1.07-2.25 1.98-3.1 2.02-.79.04-1.77.3-6.04-1.25-5.07-1.99-8.3-7.2-8.55-7.53-.24-.33-2.04-2.71-2.04-5.17 0-2.46 1.29-3.67 1.75-4.18.46-.5 1-.63 1.33-.63.33 0 .66 0 .95.02.3.01.71-.12 1.11.84.41.96 1.39 3.41 1.52 3.66.13.25.21.54.04.87-.17.33-.26.54-.5.83-.25.29-.53.65-.75.88-.25.25-.51.52-.22 1.02.29.5 1.29 2.13 2.77 3.46 1.9 1.7 3.49 2.23 3.99 2.48.5.25.79.21 1.08-.13.29-.33 1.25-1.46 1.58-1.96.33-.5.66-.42 1.12-.25.46.17 2.92 1.37 3.41 1.62.5.25.83.38.95.58.13.21.13 1.21-.25 2.29Z"/></svg>
          Chat
        </button>
      </div>
      {copied && (
        <div className="pointer-events-none absolute top-2 right-2 text-[10px] font-medium bg-emerald-600 text-white px-2 py-1 rounded shadow animate-in fade-in slide-in-from-top-2">Copied!</div>
      )}
    </div>
  );
}
