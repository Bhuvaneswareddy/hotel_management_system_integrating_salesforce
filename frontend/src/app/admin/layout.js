import "../../app/globals.css";
import Sidebar from "../../components/admin/Sidebar";
import TopBar from "../../components/admin/TopBar";

export const metadata = {
  title: "Admin | Hotel Management",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="px-6 py-6 max-w-6xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
