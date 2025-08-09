"use client";
import { memo } from "react";

function BackgroundDecorBase() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/* soft corner blob */}
      <div className="absolute -top-24 -left-24 h-[36rem] w-[36rem] rounded-full blur-3xl"
           style={{ background: "radial-gradient(50% 50% at 50% 50%, hsl(var(--primary)/0.12) 0%, transparent 70%)" }} />
      {/* faint diagonal sheen */}
      <div className="absolute inset-0"
           style={{ background: "linear-gradient(120deg, transparent 0%, hsl(var(--muted)/0.3) 40%, transparent 90%)" }} />
    </div>
  );
}
const BackgroundDecor = memo(BackgroundDecorBase);
export default BackgroundDecor;
