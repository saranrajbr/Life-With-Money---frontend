import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../api";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { useToast } from "../components/toastContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      toast("Welcome back!");
      navigate("/Dashboard");
    } catch (err) {
      toast(err?.response?.data?.msg || "Login failed. Check your credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (response) => {
    setGoogleError("");
    try {
      // GoogleLogin returns an id_token in `response.credential`
      const { data } = await API.post("/auth/google", { token: response.credential });
      localStorage.setItem("token", data.token);
      toast("Signed in with Google!");
      navigate("/Dashboard");
    } catch (err) {
      toast(err?.response?.data?.msg || "Google sign-in failed. Please try again.", "error");
    }
  };

  const onGoogleError = () => {
    setGoogleError("Google sign-in was cancelled or failed.");
    toast("Google sign-in failed.", "error");
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue tracking your money"
      footer={
        <p className="auth-switch">
          Don't have an account? <Link to="/Register">Create one</Link>
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="auth-forgot-row">
          <Link to="/ForgotPassword" className="auth-forgot">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="auth-submit" disabled={loading}>
          {loading ? <Spinner /> : "Sign In"}
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
          text="signin_with"
          shape="pill"
          theme="filled_blue"
        />
        {googleError && <p className="auth-error">Google sign-in isn't available right now.</p>}
      </div>
    </AuthLayout>
  );
}