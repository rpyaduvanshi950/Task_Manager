import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const STATUSES = ["todo", "ongoing", "done"];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("todo");

  const tasksColRef = useMemo(() => {
    if (!user) return null;
    return collection(db, "users", user.uid, "tasks");
  }, [user]);

  useEffect(() => {
    if (!tasksColRef) return;
    const q = query(tasksColRef, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(list);
    });
    return () => unsub();
  }, [tasksColRef]);

  async function addTask(e) {
    e.preventDefault();
    if (!newTitle.trim() || !tasksColRef) return;
    await addDoc(tasksColRef, {
      title: newTitle.trim(),
      status: newStatus,                 // "todo" | "ongoing" | "done"
      createdAt: serverTimestamp(),
      uid: user.uid,
      ownerName: user.displayName ?? null,
    });
    setNewTitle("");
    setNewStatus("todo");
  }

  async function setStatus(taskId, status) {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "tasks", taskId), { status });
  }

  async function removeTask(taskId) {
    await deleteDoc(doc(db, "users", user.uid, "tasks", taskId));
  }

  async function handleSignOut() {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (e) {
      // swallow or surface error as needed
      console.error('Sign out failed', e);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0b12] text-white">
      {/* top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
  <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-600" />
          <h1 className="text-lg font-semibold tracking-tight">The Crazy App</h1>
          <span className="text-xs text-white/50 hidden sm:inline">
            • Welcome {user?.displayName || "there"}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          Sign out
        </button>
      </header>

      {/* gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl bg-gradient-to-br from-indigo-600/30 via-purple-600/25 to-fuchsia-500/20"></div>
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full blur-3xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-blue-500/25"></div>
      </div>

      {/* content */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        {/* Add task card */}
  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <form onSubmit={addTask} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs uppercase tracking-wide text-white/60">
                Task title
              </label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Write project report"
                className="w-full rounded-xl bg-black/30 px-3 py-2 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-white/60">
                Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-xl bg-black/30 px-3 py-2 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-400"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-5 py-2.5 font-medium shadow-lg hover:scale-[1.02] active:scale-95 transition"
            >
              Add Task
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </form>
        </div>

        {/* Task lanes */}
        {/* Task lanes */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {STATUSES.map((lane) => (
            <div
              key={lane}
              className="rounded-2xl border border-white/10 bg-black/80 p-4 backdrop-blur-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide uppercase">
                  {lane === "todo" ? "To do" : lane === "ongoing" ? "Ongoing" : "Done"}
                </h2>
                <span className="text-xs text-white/50">
                  {
                    tasks.filter((t) => t.status === lane).length
                  }
                </span>
              </div>

              <ul className="space-y-3">
                {tasks
                  .filter((t) => t.status === lane)
                  .map((t) => (
                    <li
                      key={t.id}
                      className="group rounded-xl border border-white/10 bg-black/30 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">{t.title}</p>
                          <p className="mt-1 text-xs text-white/50">
                            {t.createdAt?.toDate
                              ? t.createdAt.toDate().toLocaleString()
                              : "…"}
                          </p>
                        </div>

                        <div className="flex items-center  gap-2">
                          {/* status changer */}
                          <select
                            value={t.status}
                            onChange={(e) => setStatus(t.id, e.target.value)}
                            className="rounded-lg bg-black/30 px-2 py-1 text-xs outline-none ring-1 ring-inset ring-white/10 hover:bg-white/15"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>

                          {/* delete */}
                          <button
                            onClick={() => removeTask(t.id)}
                            className="rounded-lg p-1 text-white/60 hover:text-white hover:bg-white/10"
                            title="Delete"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 6h18M8 6V4h8v2m-1 0v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6h10Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}

                {tasks.filter((t) => t.status === lane).length === 0 && (
                  <li className="rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-6 text-center text-sm text-white/50">
                    No tasks here yet.
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
