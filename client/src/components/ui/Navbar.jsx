import { ShoppingCart, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";
import { toast } from "sonner";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const baseURL = import.meta.env.VITE_BASE_URL;

const Navbar = () => {
  const { cart } = useSelector((store) => store.product);
  const user = useSelector((state) => state.user?.User);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Safe cart count
  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${baseURL}/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem("accessToken");
        toast.success(res.data.message);
        navigate("/");
        setMenuOpen(false);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        dispatch(setUser(null));
        toast.info("Session expired. Logged out automatically.");
        navigate("/");
      } else {
        toast.error(error.response?.data?.message || "Logout failed");
      }
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="bg-blue-50 fixed w-full z-20 border-b border-blue-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 sm:px-6">

          {/* Logo */}
          <Link to="/">
            <img
              src="/ecommerce.webp"
              alt="E-commerce Logo"
              className="w-[130px] sm:w-[150px]"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex gap-7 items-center text-lg font-medium text-gray-700">
              <li>
                <Link to="/" className="hover:text-blue-600">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-600">Products</Link>
              </li>
              {user && (
                <li>
                  <Link
                    to={`/profile/${user._id}`}
                    className="hover:text-blue-600"
                  >
                    Hello, {user.firstName}
                  </Link>
                </li>
              )}
            </ul>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="bg-blue-500 absolute -top-2 -right-3 text-white text-xs rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <Button onClick={logoutHandler} className="bg-blue-600 text-white">
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white"
              >
                Login
              </Button>
            )}
          </nav>

          {/* Mobile Icons */}
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="bg-blue-500 absolute -top-2 -right-3 text-white text-xs rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setMenuOpen(true)}>
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* RIGHT DRAWER MENU */}
      <div
        className={`fixed top-0 right-0 z-40 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-4 text-gray-700">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>

          {user && (
            <Link
              to={`/profile/${user._id}`}
              onClick={() => setMenuOpen(false)}
            >
              Hello, {user.firstName}
            </Link>
          )}

          <div className="mt-6">
            {user ? (
              <Button
                onClick={logoutHandler}
                className="w-full bg-blue-600 text-white"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="w-full bg-blue-600 text-white"
              >
                Login
              </Button>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
