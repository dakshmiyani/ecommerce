import React from "react";
import { Button } from "./button";
import { X } from "lucide-react";

const MobileFilterDrawer = ({ open, onClose, children }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl
        transform transition-transform duration-300
        ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-lg">Filters</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          {children}
        </div>

        <div className="p-4 border-t">
          <Button onClick={onClose} className="w-full bg-blue-600 text-white">
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default MobileFilterDrawer;
