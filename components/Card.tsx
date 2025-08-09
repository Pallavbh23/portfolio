import { cn } from "@/lib/cn";

export function Card({ className, children }: React.ComponentProps<"div">) {
  return (
    <div className={cn(
      "rounded-2xl border border-border bg-card text-card-foreground shadow-sm",
      "transition-transform will-change-transform hover:scale-[1.01]",
      className
    )}>
      {children}
    </div>
  );
}

export function CardBody({ className, children }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 md:p-8 stack-sm", className)}>{children}</div>;
}

export function CardTitle({ className, children }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-2xl md:text-3xl font-semibold tracking-tight", className)}>{children}</h3>;
}

export function CardMeta({ className, children }: React.ComponentProps<"div">) {
  return <div className={cn("text-sm text-muted-foreground", className)}>{children}</div>;
}
