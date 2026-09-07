import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import { useToast } from "../components/toastContext";
import API from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Password forms
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => toast("Could not load profile.", "error"))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetFields = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirm("");
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      toast("Passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 6) {
      toast("Password must be at least 6 characters.", "error");
      return;
    }
    setBusy(true);
    try {
      const url = user.hasPassword ? "/auth/change-password" : "/auth/set-password";
      const body = user.hasPassword ? { oldPassword, newPassword } : { password: newPassword };
      const { data } = await API.put(url, body);
      toast(data.msg || "Password updated.");
      resetFields();
      setUser((u) => ({ ...u, hasPassword: true }));
    } catch (err) {
      toast(err?.response?.data?.msg || "Could not update password.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppLayout>
      <div className="page">
        <header className="page-head">
          <div>
            <h1>Profile</h1>
            <p className="page-head-sub">Your account details.</p>
          </div>
        </header>

        <section className="card profile-card">
          {loading ? (
            <div className="list-loading"><Spinner /> Loading…</div>
          ) : user ? (
            <div className="profile-wrap">
              <div className="profile-avatar">
                {user.email ? user.email[0].toUpperCase() : "U"}
              </div>
              <div className="profile-fields">
                <div className="pf-field">
                  <label>Email</label>
                  <div className="pf-value">{user.email}</div>
                </div>
                <div className="pf-field">
                  <label>Sign-in method</label>
                  <div className="pf-value">
                    {user.googleid ? "Google Account" : "Email & Password"}
                  </div>
                </div>
                <div className="pf-field">
                  <label>Account status</label>
                  <div className="pf-value"><span className="status-ok">● Active</span></div>
                </div>
                {user.salary ? (
                  <div className="pf-field">
                    <label>Monthly salary</label>
                    <div className="pf-value">{user.salary.toLocaleString()}</div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="empty-note">No profile data.</p>
          )}
        </section>

        {user && (
          <section className="card profile-card">
            <div className="card-head">
              <h2>{user.hasPassword ? "Change password" : "Set a password"}</h2>
              <span className="card-head-sub">
                {user.hasPassword
                  ? "Update your sign-in password"
                  : "Your Google account has no password yet. Set one to also sign in with email & password."}
              </span>
            </div>

            <form className="auth-form pf-password-form" onSubmit={submitPassword}>
              {user.hasPassword && (
                <div className="field">
                  <label htmlFor="old-password">Current password</label>
                  <input
                    id="old-password"
                    type="password"
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              )}
              <div className="field">
                <label htmlFor="new-password">New password</label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="field">
                <label htmlFor="confirm-password">Confirm new password</label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" disabled={busy}>
                {busy ? <Spinner /> : user.hasPassword ? "Change password" : "Set password"}
              </Button>
            </form>
          </section>
        )}
      </div>
    </AppLayout>
  );
}