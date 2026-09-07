import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { useToast } from "../components/toastContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/forgot-password", { email });
      setSent(true);
      toast(data.msg || "Reset link sent.", "info");
    } catch (err) {
      toast(err?.response?.data?.msg || "Something went wrong. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your account email and we'll send you a reset link"
      footer={
        <p className="auth-switch">
          Remembered it? <Link to="/Login">Back to sign in</Link>
        </p>
      }
    >
      {sent ? (
        <div className="auth-success">
          <p>
            If an account exists for <strong>{email}</strong>, a reset link has been
            sent. Check your inbox (and spam folder). Links expire after 15 minutes.
          </p>
          <Link to="/Login" className="btn btn-outline btn-block">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <Button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <Spinner /> : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}