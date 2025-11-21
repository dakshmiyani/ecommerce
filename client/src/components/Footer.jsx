import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-[#0b132b] text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* ====== Brand Section ====== */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-blue-500 text-3xl font-bold">🛒 KART</span>
          </div>
          <p className="text-sm mb-4">
            Powering Your World with the Best in Electronics.
          </p>
          <ul className="text-sm space-y-1">
            <li>123 Electronics St, Style City, NY 10001</li>
            <li>Email: support@Zapto.com</li>
            <li>Phone: (123) 456-7890</li>
          </ul>
        </div>

        {/* ====== Customer Service ====== */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Customer Service
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-pink-400 transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-400 transition-colors">
                Shipping & Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-400 transition-colors">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-400 transition-colors">
                Order Tracking
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-400 transition-colors">
                Size Guide
              </a>
            </li>
          </ul>
        </div>

        {/* ====== Follow Us ====== */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-pink-400 transition-colors">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:text-pink-400 transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-pink-400 transition-colors">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-pink-400 transition-colors">
              <FaPinterestP size={20} />
            </a>
          </div>
        </div>

        {/* ====== Newsletter ====== */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Stay in the Loop
          </h3>
          <p className="text-sm mb-4">
            Subscribe to get special offers, free giveaways, and more.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-white px-3 py-2 rounded-l-lg text-gray-800 outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* ====== Bottom Footer ====== */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © 2025{" "}
        <span className="text-blue-500 font-semibold">EKart</span>. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
