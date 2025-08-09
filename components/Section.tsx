import { cn } from "@/lib/cn"; // or replace with a simple join if you don't have cn()

type Props = {
  className?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  padded?: boolean;   // adds vertical breathing room
};
export default function Section({ as: Tag = "section", className, children, padded = true }: Props) {
  return (
    <Tag className={cn("relative z-10", padded && "py-12 md:py-16")}>
      <div className={cn("container-app", className)}>{children}</div>
    </Tag>
  );
}
