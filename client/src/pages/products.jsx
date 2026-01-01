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
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productSlice'



const Products = () => {
  const{products} = useSelector(store => store.product)
    

  const baseURL = import.meta.env.VITE_BASE_URL;
   const[allProdutcs, setAllProducts] = useState([])
   const[loading, setLoading] = useState(false);
   const[search,setSearch] = useState("");
   const[category,setCategory]=useState("ALL")
   const[brand,setBrand]=useState("ALL")
   const[sortOrder, setSortOrder]=useState('');

   const[ priceRnage, setPriceRange] = useState([0,999999]);
   const dispatch = useDispatch()

    const getAllproducts = async()=>{
        try {
            setLoading(true)
            const res = await axios.get(`${baseURL}/products/all-products`);
         if (res.data?.success) {
      setAllProducts(res.data.products);
      dispatch(setProducts(res.data.products))
    }
  } catch (error) {
    console.log(error);
    

  toast.error(
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong"
  );
        }finally{
          setLoading(false)
        }

    }

    useEffect(()=>{
        getAllproducts()
    },[])


    useEffect(()=>{
      if(allProdutcs.length === 0) return;
      

      let filtered= [...allProdutcs]

      if(search.trim() !== ""){
        filtered=filtered.filter(p=>p.productNmae?.toLowerCase().includes(search.toLocaleLowerCase()))
      }
      if(category !== "ALL"){
        filtered = filtered.filter(p=>p.category === category);
      }
      if(brand !== "ALL"){
        filtered=filtered.filter(p => p.brand ===brand);
      }
      filtered=filtered.filter(p => p.productPrice >= priceRnage[0] && p.productPrice <= priceRnage[1])
       

      if(sortOrder ==="lowtoHigh"){
        filtered.sort((a,b)=> a.productPrice -b.productPrice)
      }else if(sortOrder === "hightoLow"){
        filtered.sort((a,b)=>b.productPrice - a.productPrice)
      }

      dispatch(setProducts(filtered))
    },[search,category,brand,priceRnage,sortOrder, allProdutcs]);


console.log(allProdutcs)

  return (
    <div className='pt-60 pl-5'>
    <div className="max-w-7xl mc-auto flex gap-7">
{/* Filter Side Bar */}
<FilterSideBar allProdutcs={allProdutcs} 
search={search}
setSearch={setSearch}

brand ={brand}
setBrand={setBrand}
category= {category}
setCategory={setCategory}
priceRnage={priceRnage}
setPriceRange ={setPriceRange}
/>
{/* main product */}
      <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-4">
            <Select onValuChange={(value) => setSortOrder(value)} >
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
      {
        products.map((product)=>{
          return <ProductCard key={product._id} product={product} loading={loading} />
        })
}
 

 
  
</div>
</div>
 </div>
</div>
  )}


export default Products
