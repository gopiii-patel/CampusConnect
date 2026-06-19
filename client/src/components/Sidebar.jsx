import { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { Home, ShoppingBag, MessageSquare, BookOpen, User, LogOut, Sparkles } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Campus Feed", description: "What's happening", icon: Home },
  { to: "/marketplace", label: "Marketplace", description: "Buy & sell items", icon: ShoppingBag },
  { to: "/messages", label: "Messages", description: "Student chat", icon: MessageSquare },
  { to: "/notes", label: "Notes Bank", description: "PDFs & study guides", icon: BookOpen },
  { to: "/profile", label: "My Profile", description: "Manage campus ID", icon: User },
];

function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  const getInitials = (name) => {
    if (!name) return "CC";
    const parts = name.split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <aside className="fixed inset-y-16 left-0 z-40 hidden w-72 overflow-y-auto border-r border-slate-800 bg-[#0f172a]/40 px-5 py-6 text-slate-200 shadow-xl shadow-slate-950/20 backdrop-blur-sm lg:block">
      {/* Student Quick Profile Card */}
      {user && (
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col items-center text-center backdrop-blur-md">
          <div className="relative mb-3">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-500/20"
              />
            ) : (
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white border-2 border-indigo-500/20 shadow-md">
                {getInitials(user.name)}
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" title="Online" />
          </div>
          <h2 className="text-base font-semibold text-white leading-tight">{user.name}</h2>
          <p className="text-[11px] text-indigo-400 font-medium uppercase tracking-wider mt-1">
            {user.branch || "General Student"}
          </p>
          {user.semester && (
            <p className="text-xs text-slate-400 mt-0.5">
              Sem {user.semester} • Year {user.year || "1"}
            </p>
          )}
        </div>
      )}

      {/* Main Hub Navigation */}
      <div className="mb-3 px-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
          Navigation
        </p>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all duration-200 border ${
                  isActive
                    ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-semibold"
                    : "border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50 hover:border-slate-800/60"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm leading-none">{item.label}</span>
                <span className="text-[10px] text-slate-500 mt-1 font-normal group-hover:text-slate-400">
                  {item.description}
                </span>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Campus Highlight Box */}
      <div className="mt-8 rounded-2xl border border-slate-800/80 bg-gradient-to-b from-indigo-500/5 to-violet-500/5 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 text-indigo-500/20">
          <Sparkles size={32} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Campus Tip</p>
        <h3 className="mt-2 text-sm font-semibold text-slate-200">Swapping Semester Notes?</h3>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
          Upload PDF lecture summaries in the Notes Bank and earn recommendations from batchmates!
        </p>
      </div>

      {/* Log Out Button */}
      <div className="mt-6 pt-6 border-t border-slate-800/60">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-slate-400 hover:text-red-400 hover:border-red-500/10 hover:bg-red-500/5 transition-all duration-200 active:scale-95 text-left"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="text-sm font-medium">Log Out Session</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
