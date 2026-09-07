import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import API from "../api";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { useToast } from "../components/toastContext";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast("Passwords do not match.", "error");
      return;
    }
    if (password.length < 6) {
      toast("Password must be at least 6 characters.", "error");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/auth/reset-password", { token, password });
      toast(data.msg || "Password updated.");
      setDone(true);
      setTimeout(() => navigate("/Login"), 1200);
    } catch (err) {
      toast(err?.response?.data?.msg || "Could not reset password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Enter a new password for your account"
      footer={
        <p className="auth-switch">
          <Link to="/Login">Back to sign in</Link>
        </p>
      }
    >
      {!token ? (
        <p className="empty-note">This reset link is missing a token. Request a new one.</p>
      ) : done ? (
        <div className="auth-success">
          <p>Password updated! Redirecting you to sign in…</p>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirm new password</label>
            <input
              id="confirm"
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <Spinner /> : "Reset password"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}