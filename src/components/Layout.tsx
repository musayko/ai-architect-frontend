import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        {children} {/* Page content will be rendered here */}
      </main>
      {/* You could add a Footer component here later */}
      {/* <footer className="bg-gray-200 p-4 text-center text-sm text-gray-600">
        © 2025 AI Architect
      </footer> */}
    </div>
  );
};

export default Layout;