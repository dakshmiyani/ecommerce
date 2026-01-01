import React from 'react'
import { Input } from './input';
import { Label } from './label';


const FilterSideBar = ({allProdutcs = []}) => {
  const categories = allProdutcs.map(p => p.category)
const UniqueCategory = ["ALL", ...new Set(categories)];

const Brands= allProdutcs.map(p => p.brand)
const UniqueBrand = ["ALL", ...new Set(Brands)]


  console.log(Brands,"unique",UniqueBrand)




  return (
    <div className='bg-gray-100 mt-10 p-4 rounded-md h-max hidden md:block w-64'>  
      {/* search */}
       <Input  type="text" placeholder="search" className="bg-white p-2 rounded-md border-gray-400 border-2 w-full"/>
       {/* category */}
       <h1 className='mt-5 font-semibold text-xl'> Category</h1>
       <div className="flex flex-col gap-2 mt-3">
        {
          UniqueCategory.map((Item,index) =>(
            <div  key={index} className="flex items-center gap-2">
              <input type="radio" />
              <label htmlFor=""  >{Item}</label>

            </div>
          )
       )
        }
       </div>
       {/* brands */}
       <h1 className='mt-5 font-semibold text-xl'> Brand</h1>
       <select className='bg-white w-full border-gray-200 border-2 rounded-md'>
        {
         UniqueBrand.map((item,index) => {
         return <option key={index}>{item.toUpperCase()}</option>
         })
     
        }
        </select>
       </div>

  )
}

export default FilterSideBar
