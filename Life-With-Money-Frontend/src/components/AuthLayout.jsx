import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <img src={logo} alt="Life With Money" />
        <h1>Life With Money</h1>
        <p>Track daily expenses. Build better financial habits.</p>
      </div>

      <div className="auth-card-wrap">
        <div className="auth-card">
          <div className="auth-card-head">
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="auth-card-body">{children}</div>
          {footer && <div className="auth-card-foot">{footer}</div>}
        </div>
        <Link to="/" className="auth-back">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}