import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-medium">© 2025 Faculty of Engineering, University of Ruhuna</p>
            <p className="text-xs text-slate-500 mt-1">Study Hall Management System</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <a
              href="https://www.eng.ruh.ac.lk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-white hover:underline transition-colors"
            >
              Visit Faculty Website
            </a>
            <div className="text-xs text-slate-400">
              <p>Email: ardf@eng.ruh.ac.lk</p>
              <p>Contact: +(94) 912245765</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
