import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../api";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { useToast } from "../components/toastContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
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
      await API.post("/auth/register", { email, password });
      toast("Registration successful — please sign in.");
      navigate("/Login");
    } catch (err) {
      toast(err?.response?.data?.msg || "Registration failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (response) => {
    try {
      const { data } = await API.post("/auth/google", { token: response.credential });
      localStorage.setItem("token", data.token);
      toast("Account created with Google!");
      navigate("/Dashboard");
    } catch (err) {
      toast(err?.response?.data?.msg || "Google sign-up failed. Please try again.", "error");
    }
  };

  const onGoogleError = () => {
    toast("Google sign-up was cancelled or failed.", "error");
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start tracking your finances in minutes"
      footer={
        <p className="auth-switch">
          Already have an account? <Link to="/Login">Sign in</Link>
        </p>
      }
    >
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

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="field">
          <label htmlFor="confirm">Confirm password</label>
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
          {loading ? <Spinner /> : "Create Account"}
        </Button>
      </form>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <div className="google-btn-wrap">
        <GoogleLogin
          onSuccess={onGoogleSuccess}
          onError={onGoogleError}
          useOneTap={false}
          text="signup_with"
          shape="pill"
          theme="filled_blue"
        />
      </div>
    </AuthLayout>
  );
}