import React from "react";

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "default" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const classesByVariant: Record<ButtonVariant, string> = {
  default: "bg-zinc-900 text-white hover:bg-zinc-800",
  outline: "border border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-100",
  ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100",
};

const classesBySize: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2 text-sm",
  lg: "h-12 px-6 py-3 text-base",
};

const cn = (...values: Array<string | undefined>) => values.filter(Boolean).join(" ");

export function Button({
  asChild = false,
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  const baseClassName = cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
    "disabled:pointer-events-none disabled:opacity-50",
    classesByVariant[variant],
    classesBySize[size],
    className,
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: cn(baseClassName, child.props.className),
    });
  }

  return (
    <button className={baseClassName} {...props}>
      {children}
    </button>
  );
}
