import { Fragment } from "react";
import { Link } from "react-router-dom";

type Item = { label: string; to?: string };

export default function Breadcrumbs({ items }: { items: Item[] }) {
  return (
    <nav className="text-sm text-white/70 mb-4" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="mx-2 text-white/40">›</span>}
          {it.to ? (
            <Link className="hover:text-white transition-colors" to={it.to}>
              {it.label}
            </Link>
          ) : (
            <span className="px-2 py-0.5 rounded bg-white/20 text-white font-medium">
              {it.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
