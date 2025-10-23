type Props = { children: React.ReactNode };

export default function TagPill({ children }: Props) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--c-soft)] border border-[var(--c-border)]">
      {children}
    </span>
  );
}
