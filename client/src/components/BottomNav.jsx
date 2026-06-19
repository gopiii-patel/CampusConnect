import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, MessageSquare, BookOpen, User } from "lucide-react";

const mobileItems = [
  { to: "/", label: "Feed", icon: Home },
  { to: "/marketplace", label: "Shop", icon: ShoppingBag },
  { to: "/messages", label: "Chat", icon: MessageSquare },
  { to: "/notes", label: "Notes", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: User },
];

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a]/90 border-t border-slate-800 backdrop-blur-md sm:hidden shadow-2xl">
      <div className="mx-auto flex max-w-lg justify-around px-2 py-2">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center rounded-xl py-1.5 px-3.5 text-[10px] font-semibold transition-all duration-200 border ${
                  isActive
                    ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`
              }
            >
              <Icon size={18} className="mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
