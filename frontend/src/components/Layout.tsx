import { Link } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="header">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="font-semibold">
            <span className="text-blue-600">GAMC</span> · Trámites
          </Link>
          <a
            href="https://www.cochabamba.bo"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Portal GAMC
          </a>
        </div>
      </header>

      <main className="container section-padding">{children}</main>

      <footer className="footer">
        <div className="footer-inner">
          © {new Date().getFullYear()} GAMC · Información referencial
        </div>
      </footer>
    </div>
  );
}
