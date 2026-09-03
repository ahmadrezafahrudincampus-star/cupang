import clsx from 'clsx';

export default function Container({ children, className }) {
  return (
    <div className={clsx("max-w-[1440px] mx-auto px-6 md:px-16", className)}>
      {children}
    </div>
  );
}
