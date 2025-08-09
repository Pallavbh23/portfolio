// components/Section.tsx
import { cn } from "@/lib/cn"; // if you don't have cn(), replace cn(...) with [className].filter(Boolean).join(" ")
import type { ElementType, ReactNode } from 'react';

interface Props {
  id?: string;
  className?: string;
  children: ReactNode;
  as?: ElementType;
  padded?: boolean; // toggle vertical spacing
}

export default function Section({ id, as: Tag = 'section', className, children, padded = true }: Props) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[Section] render', { id, padded, tag: typeof Tag === 'string' ? Tag : Tag.displayName || 'Component' });
  }
  return (
    <Tag id={id} className={cn('relative z-10', padded && 'py-12 md:py-16')}>
      <div className={cn('container-app', className)}>{children}</div>
    </Tag>
  );
}
