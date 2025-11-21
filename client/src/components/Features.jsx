import React from "react";
import { Truck, Shield, Headphones } from "lucide-react";

const Features = () => {
  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 1️⃣ Free Shipping */}
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Free Shipping</h3>
              <p className="text-muted-foreground text-sm">
                On orders over $50
              </p>
            </div>
          </div>

          {/* 2️⃣ Secure Payment */}
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Secure Payment</h3>
              <p className="text-muted-foreground text-sm">
                100% secure transactions
              </p>
            </div>
          </div>

          {/* 3️⃣ 24/7 Support */}
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Headphones className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">24/7 Support</h3>
              <p className="text-muted-foreground text-sm">
                Always here to help you
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
