import { cn } from "@/lib/utils";

type SkeletonVariant = "rect" | "circle" | "text";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: SkeletonVariant;
};

const styles: Record<SkeletonVariant, string> = {
  rect: "rounded-xl",
  circle: "rounded-full aspect-square",
  text: "rounded-full h-4",
};

const Skeleton = ({ variant = "rect", className, ...props }: SkeletonProps) => (
  <div
    aria-hidden="true"
    className={cn("animate-pulse bg-muted/90", styles[variant], className)}
    {...props}
  />
);

export default Skeleton;
