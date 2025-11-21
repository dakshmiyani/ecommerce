import React from "react";
import { Button } from "./button";

const Hero = () => {
  return (
    <section className="bg-linear-to-r from-blue-400 via-blue-700 to-blue-900 text-white py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="z-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Latest Products
            </h1>
            <p className="text-base md:text-lg mb-8 text-blue-100 max-w-md">
              Discover cutting-edge technology and innovative designs in our
              latest collection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-blue-700 hover:bg-blue-700 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md">
                Shop Now
              </Button>

              <Button
              
                className=" bg-blue-700 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300"
              >
                View Deals
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className=" top-15 relative">
            <img
              src="/iphone.png"
              alt="iPhone"
              width={450}
              height={450}
              className="rounded-xl drop-shadow-2xl object-contain max-h-[420px] md:max-h-[480px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
