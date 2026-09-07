import { Link } from "react-router-dom";
import pigmoney from "../assets/pigmoney.png";
import moneyhand from "../assets/moneyhand.png";
import logo from "../assets/logo.png";
import mail from "../assets/Group Message.png";
import instagram from "../assets/Instagram Circle.png";
import facebook from "../assets/Facebook.png";
import linkedin from "../assets/LinkedIn Circled.png";

const FEATURES = [
  {
    icon: "📅",
    title: "Calendar-based tracking",
    text: "Log expenses on any day with a calendar-first interface."
  },
  {
    icon: "🗂️",
    title: "Smart categories",
    text: "Grocery, rent, fuel, pocket money, stocks and more — organised automatically."
  },
  {
    icon: "📊",
    title: "Overview & insights",
    text: "See day, week, month and year net across every category."
  },
  {
    icon: "📈",
    title: "Stock portfolio",
    text: "Track holdings, cost basis and profit/loss in one place."
  }
];

const SOCIALS = [
  { href: "mailto:saranrajbr@gmail.com", src: mail, alt: "mail" },
  {
    href: "https://www.instagram.com/saranrajbr?igsh=MWlyZGUxY3J6NHJldg==",
    src: instagram,
    alt: "instagram"
  },
  {
    href: "https://www.facebook.com/share/18HBNTqcH3/",
    src: facebook,
    alt: "facebook"
  },
  {
    href: "https://www.linkedin.com/in/saran-raj-b-r-04913932b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    src: linkedin,
    alt: "linkedin"
  }
];

export default function Home() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="landing-logo">
          <img src={logo} alt="Life With Money" />
          <span className="landing-logo-text">
            <strong>Life With Money</strong>
            <small>Personal Finance</small>
          </span>
        </div>
        <nav className="landing-actions">
          <Link className="btn btn-ghost" to="/Login">Sign in</Link>
          <Link className="btn btn-primary" to="/Register">Get started</Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-text">
          <span className="landing-tag">Simple &amp; Secure</span>
          <h1>Track your money.<br />Control your life.</h1>
          <p>
            A smart, calendar-based expense manager that gives you complete visibility
            over your finances — day by day, month by month.
          </p>
          <div className="landing-hero-actions">
            <Link className="btn btn-primary btn-lg" to="/Register">Create free account</Link>
            <Link className="btn btn-outline btn-lg" to="/Login">Sign in</Link>
          </div>
        </div>
        <div className="landing-hero-img">
          <img src={moneyhand} alt="Hand holding money" />
        </div>
      </section>

      <section className="landing-features">
        <h2>Everything you need to stay financially confident</h2>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-banner">
        <img src={pigmoney} alt="Piggy bank" />
        <div>
          <h2>Managing money shouldn't be confusing</h2>
          <p>
            Log daily expenses, analyse spending patterns and make better financial
            decisions — all in one simple dashboard.
          </p>
        </div>
      </section>

      <footer className="landing-footer">
        <span className="landing-contact-label">Contact</span>
        <div className="landing-socials">
          {SOCIALS.map((s) => (
            <a key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer">
              <img src={s.src} alt={s.alt} className={s.alt} />
            </a>
          ))}
        </div>
        <span className="landing-copy">© {new Date().getFullYear()} Life With Money</span>
      </footer>
    </div>
  );
}