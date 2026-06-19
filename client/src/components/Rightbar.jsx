import { Flame, MessageCircle, BarChart3, Tag, ShoppingBag, BookOpen } from "lucide-react";

function Rightbar() {
  const trends = [
    { name: "PlacementPrep", posts: "128 posts", color: "text-amber-400" },
    { name: "Hackathon2026", posts: "94 posts", color: "text-indigo-400" },
    { name: "AIStudyGroup", posts: "62 posts", color: "text-emerald-400" },
    { name: "MarketplaceSwap", posts: "47 posts", color: "text-violet-400" },
  ];

  return (
    <aside className="fixed inset-y-16 right-0 z-40 hidden w-80 overflow-y-auto border-l border-slate-800 bg-[#0f172a]/40 px-5 py-6 xl:block backdrop-blur-sm">
      <div className="space-y-6">
        {/* Trending Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-slate-950/10 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-amber-500 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Trending Now</h2>
          </div>
          <div className="space-y-2.5">
            {trends.map((trend) => (
              <div
                key={trend.name}
                className="group flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/30 px-3.5 py-2.5 text-xs text-slate-200 transition-all hover:border-indigo-500/30 hover:bg-slate-900/50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 group-hover:text-indigo-400 transition-colors">#</span>
                  <span className="font-medium group-hover:text-white transition-colors">{trend.name}</span>
                </div>
                <span className="rounded-lg bg-slate-800/80 px-2 py-1 text-[10px] text-slate-400 font-mono">
                  {trend.posts}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pulse / Activity Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-slate-950/10 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Campus Pulse</h2>
          </div>
          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between rounded-xl bg-slate-950/30 border border-slate-800/60 p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Flame size={14} className="text-amber-500" />
                <span>Active study discussions</span>
              </div>
              <span className="font-bold text-white font-mono">24</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-950/30 border border-slate-800/60 p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <ShoppingBag size={14} className="text-indigo-400" />
                <span>Items listed today</span>
              </div>
              <span className="font-bold text-white font-mono">+18</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-950/30 border border-slate-800/60 p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <BookOpen size={14} className="text-emerald-400" />
                <span>Notes download spikes</span>
              </div>
              <span className="font-bold text-emerald-400 font-mono">112</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Rightbar;
