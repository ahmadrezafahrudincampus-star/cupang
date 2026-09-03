import clsx from 'clsx';

export default function Section({ children, id, className, background = 'default' }) {
  const bgClasses = {
    default: 'bg-background',
    surface: 'bg-surface',
    lowest: 'bg-surface-container-lowest',
    primary: 'bg-primary-container'
  };

  return (
    <section id={id} className={clsx("py-20 md:py-32", bgClasses[background], className)}>
      {children}
    </section>
  );
}
