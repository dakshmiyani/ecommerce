import React from 'react'
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';


const FilterSideBar = ({allProdutcs = [],priceRnage,setPriceRange, search,setSearch,brand,setBrand,category,setCategory}) => {



  const categories = allProdutcs.map(p => p.category)
const UniqueCategory = ["ALL", ...new Set(categories)];

const Brands= allProdutcs.map(p => p.brand)
const UniqueBrand = ["ALL", ...new Set(Brands)]


  console.log(Brands,"unique",UniqueBrand)


  const handleCategoryClick = (val)=>{
    setCategory(val)
  }
const handleBrandChange = (e) =>{
  setBrand(e.target.value)
}

const handleMinChnage= (e) =>{
  const value = Number(e.target.value);
  if(value <= priceRnage[1]) setPriceRange([value,priceRnage[1]]) 
}

const handleMaxChnage= (e) =>{
  const value = Number(e.target.value);
  if(value >= priceRnage[1]) setPriceRange([priceRnage[0],value]) 
}
 const resetFilters = () =>{
  setSearch("");
setBrand("ALL");
setCategory("ALL");
setPriceRange[0,999999]

 }

  return (
    <div className='bg-gray-100 mt-10 p-4 rounded-md h-max hidden md:block w-64'>  
      {/* search */}
       <Input  type="text"
       value = {search}
       onChange ={(e)=>setSearch(e.target.value)}
        placeholder="search"
         className="bg-white p-2 rounded-md border-gray-400 border-2 w-full"/>
       {/* category */}
       <h1 className='mt-5 font-semibold text-xl'> Category</h1>
       <div className="flex flex-col gap-2 mt-3">
        {
          UniqueCategory.map((Item,index) =>(
            <div  key={index} className="flex items-center gap-2">
              <input type="radio" checked={category === Item} onChange={()=>handleCategoryClick(Item)} />
              <label htmlFor=""  >{Item}</label>

            </div>
          )
       )
        }
       </div>
       {/* brands */}
       <h1 className='mt-5 font-semibold text-xl'> Brand</h1>
       <select className='bg-white w-full border-gray-200 border-2 rounded-md' value={brand} onChange={handleBrandChange} > 
        {
         UniqueBrand.map((item,index) => {
         return <option key={index} value={item} >{item.toUpperCase()}</option>
         })
     
        }
        </select>
        {/* price range */}
        <h1 className='mt-5 font-semibold text-xl mb-3' >Price Range</h1>
        <div className="flex flex-col gap-2">
          <label htmlFor="">
            Price Range: ₹{priceRnage[0]} - ₹{priceRnage[1]}
          </label>
          <div className="flex gap-2 items-center">
            <input type="number" min="0" max="5000" value={priceRnage[0]} onChange={handleMinChnage} className='w-20 p-1 border border-gray-300 rounded' />
            <span>-</span>
            <input type="number" min="0" max="999999" value={priceRnage[1]} onChange={handleMaxChnage} className='w-20 p-1 border border-gray-300 rounded' />
          </div>
          <input type="range" min="0" max="5000" step="100" className='w-full' value={priceRnage[0]} onChange={handleMinChnage}/>
          <input type="range" min="0" max="999999" step="100" className='w-full' />
        </div>
        {/* reset button */}
        <Button onClick={resetFilters} className="bg-blue-600 text-white mt-5 w-full cursor-pointer"  >Reset Filters</Button>
       </div>

  )
}

export default FilterSideBar
