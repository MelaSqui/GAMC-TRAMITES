import { Fragment } from "react";
import { Link } from "react-router-dom";

type Item = { label: string; to?: string };

export default function Breadcrumbs({ items }: { items: Item[] }) {
  return (
    <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="mx-2 text-slate-400">›</span>}
          {it.to ? (
            <Link className="hover:text-slate-700" to={it.to}>
              {it.label}
            </Link>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
              {it.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
