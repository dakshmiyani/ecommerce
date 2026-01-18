import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const linkBase =
  "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* LOGO */}
        <div className="px-6 py-5 border-b border-gray-800">
          <h2 className="text-xl font-semibold tracking-wide">
            Admin Panel
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage your store
          </p>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            Orders
          </NavLink>

          <NavLink
            to="/admin/add-product"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            Add Product
          </NavLink>
        </nav>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-800 text-xs text-gray-400">
          © {new Date().getFullYear()} Admin
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
