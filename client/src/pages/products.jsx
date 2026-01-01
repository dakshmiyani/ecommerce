import React, { useEffect, useState } from 'react'
import FilterSideBar from '../components/ui/FilterSideBar'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,

  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ProductCard from '@/components/ui/ProductCart'
import axios, { all } from 'axios'


const Products = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
   const[allProdutcs, setAllProducts] = useState([])
   const[loading, setLoading] = useState(false);

    const getAllproducts = async()=>{
        try {
            setLoading(true)
            const res = await axios.get(`${baseURL}/products/all-products`);
         if (res.data?.success) {
      setAllProducts(res.data.products);
    }
  } catch (error) {
    console.log(error);

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch products";

    console.error(message);
            
        }finally{
            setLoading(false)
        }

    }

    useEffect(()=>{
        getAllproducts()
    },[])

console.log(allProdutcs)

  return (
    <div className='pt-60 pl-5'>
    <div className="max-w-7xl mc-auto flex gap-7">
{/* Filter Side Bar */}
<FilterSideBar allProdutcs={allProdutcs}/>
{/* main product */}
      <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-4">
            <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="sort by price" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
         
          <SelectItem value="lowtoHigh">Price: Low to High</SelectItem>
          <SelectItem value="hightoLow">Price: High to Low</SelectItem>
         
        </SelectGroup>
      </SelectContent>
    </Select>
          </div>
          {/* product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7 ">
                {/* map products here */ }
      {Array.isArray(allProdutcs) &&
  allProdutcs.map((product) => (
    <ProductCard
      key={product._id}
      product={product}
      loading={loading}
    />
  ))
}
 

 
  
</div>
</div>
 </div>
</div>
  )}


export default Products
