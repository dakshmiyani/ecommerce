import React, { useState } from 'react'
import { Card,CardTitle ,CardHeader,CardContent} from '@/components/ui/card'
import { useSelector } from 'react-redux';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const Order = () => {
      const { cart } = useSelector((store) => store.product);
       const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : subtotal * 0.1;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
   const baseUrl =import.meta.env.VITE_BASE_URL

  const [formData, setFormData] = useState({
  firstName:"",
  lastName:"",
  phone: "",
  addressLine:"",
  city:"",
  state:"",
  zipcode:"",
    });

    const handleChange = (e) =>{
        const{name,value} =e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:value
            
        })
    );
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const res= axios.post(`${baseUrl}/order`)

            
        } catch (error) {
            toast.error(error.response.data.message)
            
        }

    }





  return (
    
    <div className='flex pt-50 pl-10 gap-4'>
      <div className>
          <Card className="sticky top-24 w-150">
                <CardHeader>
                  <CardTitle className="font-extralight text-4xl ml-5">Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-5 w-full">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping Cost</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
               
                  <div className="text-sm text-muted-foreground pt-4">
                    <p>* Free shipping on orders over ₹299</p>
                    <p>* 7 days return policy</p>
                    <p>* Secure checkout with SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
      </div>
      {/* shipping details */}
      <div className='flex  mr-10 w-full'>
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="font-extralight text-4xl ml-5">Shipping details</CardTitle>
            </CardHeader>

             <CardContent>
                <div className='flex flex-col gap-3 w-full' >
                    <div className='flex grid-col gap-2 w-full' >
                       <div className=' grid gap-2 w-full'>
                        <Label htmlfor ="fullName">First Name</Label>
                        <Input
                        className="w-full"
                           type= "text"
                           required
                           id ="firstName"
                           name="firstName"
                           value={formData.firstName}
                           onChange={handleChange}

                         >
                        
                        </Input>
                        </div>
                        
                        <div className='grid gap-2 w-full'>
                        <Label htmlfor ="lastName">Last Name</Label>
                        <Input
                         className="w-full"
                           type= "text"
                           required
                           id ="lastName"
                           name="lastName"
                           value={formData.lastName}
                           onChange={handleChange}

                         >
                        
                        </Input>
                        </div>

                    </div>

                    <div className='flex grid-col gap-2 w-full' >
                       <div className=' grid gap-2 w-full'>
                        <Label htmlfor ="addressLine">Address</Label>
                        <Input
                        className="w-full"
                           type= "text"
                           required
                           id ="addressLine"
                           name="addressLine"
                           value={formData.addressLine}
                           onChange={handleChange}

                         >
                        
                        </Input>
                        </div>

                    </div>

                    <div className='flex grid-col gap-2 w-full' >
                       <div className=' grid gap-2 w-full'>
                        <Label htmlfor ="phone">Mobile No.</Label>
                        <Input
                        className="w-full"
                           type= "Number"
                           required
                           id ="phone"
                           name="phone"
                           value={formData.phone}
                           onChange={handleChange}

                         >
                        
                        </Input>
                        </div>
                        
                        <div className='grid gap-2 w-full'>
                        <Label htmlfor ="city">City</Label>
                        <Input
                         className="w-full"
                           type= "text"
                           required
                           id ="city"
                           name="lastcityName"
                           value={formData.city}
                           onChange={handleChange}

                         >
                        
                        </Input>
                        </div>

                    </div>

                    <div className='flex grid-col gap-2 w-full' >
                       <div className=' grid gap-2 w-full'>
                        <Label htmlfor ="state">State</Label>
                        <Input
                        className="w-full"
                           type= "text"
                           required
                           id ="state"
                           name="state"
                           value={formData.state}
                           onChange={handleChange}

                         >
                        
                        </Input>
                        </div>
                        
                        <div className='grid gap-2 w-full'>
                        <Label htmlfor ="zipcode">Zip Code</Label>
                        <Input
                         className="w-full"
                           type= "text"
                           required
                           id ="zipcode"
                           name="zipcode"
                           value={formData.zipcode}
                           onChange={handleChange}

                         >
                        
                        </Input>
                        </div>

                    </div >
                    <div className='ml-50 mt-10'>
                      <Button variant="outline" className="bg-blue-600 text-white text-xl w-[300px] items-center"> payment</Button>
                      </div>
                </div>
             </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Order
