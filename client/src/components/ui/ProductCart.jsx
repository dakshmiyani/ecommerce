import React from "react";
import { Button } from "./button";
import { Skeleton } from "./skeleton";

const ProductCard = ({ product ,loading}) => {
  const { productImg, productPrice, productName } = product;

  return (
    <div className="shadow-lg rounded-lg overflow-hidden h-max">
      <div className="w-full h-full aspect-square overflow-hidden">
       {
        loading? <Skeleton className="w-full h-full rounded-lg"/> :<img
          src={productImg?.[0]?.url}
          alt={productName}
          className="w-full h-full transition-transform duration-300 hover:scale-105"
        />
       }
    </div>
        {
            loading?  <div className="px-2 space-y-2 my-2">
                <Skeleton className="w-[200px] h-4"/> 
                <Skeleton className="w-[100px] h-4"/> 
                <Skeleton className="w-[150px] h-8"/> 
            </div>:<div className="p-4">
        <h3 className="font-semibold text-lg">{productName}</h3>
        <p className="text-gray-600">₹{productPrice}</p>
        <Button className="bg-blue-700 mb-3 w-full" >Add to Cart</Button>
      </div>

        }

  

      
    </div>
  );
};

export default ProductCard;
