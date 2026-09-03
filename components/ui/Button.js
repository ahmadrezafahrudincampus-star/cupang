import Link from 'next/link';
import clsx from 'clsx';

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  href, 
  children, 
  className,
  ...rest 
}) {
  const baseClasses = "inline-flex items-center justify-center font-body uppercase tracking-[0.1em] text-xs font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "border border-primary text-primary hover:bg-primary/5",
    secondary: "text-on-surface hover:text-primary border-b border-transparent hover:border-primary",
    ghost: "text-muted hover:text-on-surface"
  };

  const sizes = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4"
  };

  const isSecondaryOrGhost = variant === 'secondary' || variant === 'ghost';
  const sizeClasses = isSecondaryOrGhost ? "py-1" : sizes[size];
  const classes = clsx(baseClasses, variants[variant], sizeClasses, className);

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
