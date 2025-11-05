import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0b0b12] text-white">
      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl bg-gradient-to-br from-indigo-600/30 via-purple-600/25 to-fuchsia-500/20" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full blur-3xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-blue-500/25" />
      </div>

      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-8">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide text-white/70">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Productivity • Minimal • Secure
        </span>

        <h1 className="font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl">
          The Crazy App 
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
        Build, test, and ship with confidence.
A backend-controlled testing app with Google sign-in, airtight onboarding, and a snappy Android task manager to validate real-world flows—end to end.
        </p>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
        A single place to test auth, form validation, and CRUD flows—exactly how your users will experience them.
        </p>



        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <button
            onClick={() => navigate("/login")}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 active:scale-95"
          >
            {user ? "Go to Dashboard" : "Log in"}
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <p className="mt-6 text-xs text-white/50">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
        <p className="mt-2 text-xs text-white/50">
          Built by Pushpender Yadav.
        </p>
        
        </div>
      </section>

      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
    </main>
  );
}
