import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
};

export default function Button({ href, children, variant = 'primary' }: Props) {
  const base =
    'inline-block rounded-md px-6 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles =
    variant === 'primary'
      ? 'bg-accent-600 text-neutral-0 hover:bg-accent-700 focus:ring-accent-600'
      : 'border border-accent-600 text-accent-600 hover:bg-accent-100 focus:ring-accent-600';
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
