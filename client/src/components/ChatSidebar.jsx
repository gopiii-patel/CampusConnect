function ChatSidebar({
  onlineUsers,
  currentUser,
  selectedUser,
  setSelectedUser,
}) {
  return (
    <div className="w-[280px] border-r border-slate-800 bg-slate-900">

      <div className="p-4 border-b border-slate-800">
        <h2 className="text-white font-bold text-lg">
          Students
        </h2>
      </div>

      <div className="p-2 space-y-2">

        {onlineUsers
          .filter((u) => u._id !== currentUser?._id)
          .map((u) => (
            <button
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`w-full text-left p-3 rounded-2xl transition ${
                selectedUser?._id === u._id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{u.name}</span>

                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </button>
          ))}

      </div>
    </div>
  );
}

export default ChatSidebar;