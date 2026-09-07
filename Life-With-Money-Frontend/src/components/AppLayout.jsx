import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useToast } from "./toastContext";

const NAV = [
  { to: "/Dashboard", label: "Dashboard", icon: "📅" },
  { to: "/Budgets", label: "Overview", icon: "📊" },
  { to: "/Profiles", label: "Profile", icon: "👤" }
];

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast("Signed out", "info");
    navigate("/Login");
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Life With Money" />
          <div className="sidebar-brand-text">
            <strong>Life With Money</strong>
            <span>Personal Finance</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-label">Menu</span>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-ghost sidebar-logout" onClick={handleLogout}>
            <span>↩</span> Sign out
          </button>
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}