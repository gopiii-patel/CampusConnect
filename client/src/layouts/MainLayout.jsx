import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Rightbar from "../components/Rightbar";
import BottomNav from "../components/BottomNav";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <Sidebar />
      <Rightbar />
      <div className="pt-16 pb-24 lg:pl-72 xl:pr-80">
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}

export default MainLayout;
