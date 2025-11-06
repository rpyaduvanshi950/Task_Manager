import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const destination = location.state?.from?.pathname || "/dashboard";

  async function handleGoogle() {
    try {
      // Popup is easiest for local dev; fallback to redirect on popup blockers
      await signInWithPopup(auth, googleProvider);
      navigate(destination, { replace: true });
    } catch (e) {
      // Some browsers/environments block popups
      await signInWithRedirect(auth, googleProvider);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#0b0b12] text-white">
        <div className="animate-pulse text-white/70">Loading…</div>
      </div>
    );
  }

  // Avoid navigating during render — perform redirect in an effect
  useEffect(() => {
    if (!loading && user) {
      navigate(destination, { replace: true });
    }
  }, [user, loading, navigate, destination]);

  return (
    <div className="min-h-screen w-full bg-[#0b0b12] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <h2 className="text-2xl font-semibold tracking-tight text-center">Welcome back</h2>
        <p className="mt-2 text-center text-white/70 text-sm">
          Sign in to continue to <span className="font-medium text-white">The Crazy App</span>
        </p>

        <button
          onClick={handleGoogle}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white text-black px-4 py-3 font-medium transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path fill="#4285F4" d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.5-1.6 4.4-5.27 4.4a5.57 5.57 0 1 1 0-11.14 4.86 4.86 0 0 1 3.43 1.34l2.34-2.27A8.47 8.47 0 0 0 12.18 3 8.58 8.58 0 1 0 20.76 12c0-.62-.07-1.07-.17-1.57h.76z"/>
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-xs text-white/50">
          By signing in you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
