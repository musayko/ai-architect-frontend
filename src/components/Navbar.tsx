import React from 'react';
import { Link } from 'react-router-dom'; 

const Navbar: React.FC = () => {
  return (
    <nav className="bg-background text-foreground shadow-md px-6 py-4 flex justify-between items-center"> {/* Basic styling with Tailwind classes */}
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/projects" className="text-xl font-bold text-gray-800">
          AI Architect
        </Link>
        {/* You can add more navigation links here later */}
        {/* For example:
        <ul className="flex space-x-4">
          <li>
            <Link to="/projects" className="text-gray-600 hover:text-gray-800">
              Projects
            </Link>
          </li>
        </ul>
        */}
      </div>
    </nav>
  );
};

export default Navbar;