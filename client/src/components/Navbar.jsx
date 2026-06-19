import { useContext } from "react";
import { Link } from "react-router-dom";
import { Search, GraduationCap, PlusCircle, LogOut, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const getInitials = (name) => {
    if (!name) return "CC";
    const parts = name.split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md shadow-lg shadow-slate-950/20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="flex items-center justify-center p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-all border border-indigo-500/20">
              <GraduationCap size={20} />
            </span>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">
              Campus<span className="text-indigo-400">Connect</span>
            </span>
          </Link>
          <span className="hidden text-xs text-slate-500 uppercase tracking-widest sm:inline border-l border-slate-800 pl-3">
            Social Student Hub
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="hidden flex-1 max-w-md mx-8 md:block">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search posts, marketplace, notes..."
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 text-white"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <button className="hidden rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 text-sm font-semibold transition shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 sm:flex items-center gap-1.5 border border-indigo-400/20">
            <PlusCircle size={16} />
            <span>Post</span>
          </button>

          {/* Profile Badge */}
          {user && (
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-medium text-slate-200 leading-none">{user.name}</span>
                <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                  {user.branch || "Student"}
                </span>
              </div>

              <Link to="/profile" title="View Profile">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="h-10 w-10 rounded-xl object-cover border border-slate-800 hover:border-indigo-500/50 transition-colors"
                  />
                ) : (
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/20 hover:scale-105 transition-transform">
                    {getInitials(user.name)}
                  </div>
                )}
              </Link>

              <button
                onClick={logout}
                title="Log Out"
                className="text-slate-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all active:scale-95"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
