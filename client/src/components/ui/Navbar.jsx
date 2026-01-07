import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";
import { toast } from "sonner";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const baseURL = import.meta.env.VITE_BASE_URL;

const Navbar = () => {
  const {cart} = useSelector(store => store.product)
  console.log(cart)
  const user = useSelector((state) => state.user?.User);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        dispatch(setUser(null)); // clear Redux user
        localStorage.removeItem("accessToken"); // remove token
        toast.success(res.data.message);
        navigate("/");
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
    <header className="bg-blue-50 fixed w-full z-20 border-b border-blue-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo */}
        <Link to="/">
          <img
            src="/ecommerce.webp"
            alt="E-commerce Logo"
            className="w-[150px] cursor-pointer"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <ul className="flex gap-7 items-center text-lg font-medium text-gray-700">
            <li>
              <Link
                to="/"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Products
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  to={`/profile/${user._id}`}
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  Hello, {user.firstName}
                </Link>
              </li>
            )}
          </ul>

          {/* Cart Icon */}
          <Link to="/cart" className="relative flex items-center">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            <span className="bg-blue-500 rounded-full absolute text-white text-xs -top-2 -right-3 px-1.5 py-0.5">
           {cart.items[0].quantity}

            </span>
          </Link>

          {/* Auth Button */}
          {user ? (
            <Button
              onClick={logoutHandler}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 ml-4"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 ml-4"
            >
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
