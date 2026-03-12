import React, { useState } from 'react'
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card'
import { useSelector } from 'react-redux';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import { Link } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { setCart } from '@/redux/productSlice';
import { useDispatch } from 'react-redux';
const Order = () => {
  const { cart } = useSelector((store) => store.product);
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : subtotal * 0.1;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
  const baseUrl = import.meta.env.VITE_BASE_URL
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const accessToken = localStorage.getItem("accessToken")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value

    })
    );
  }

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create Order in DB
      const res = await axios.post(
        `${baseUrl}/order/create`,
        { shippingAddress: formData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        const orderId = res.data.order._id;

        // Step 2: Load Razorpay script
        const resScript = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!resScript) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          return;
        }

        // Step 3: Create Razorpay Order
        const rzpOrderRes = await axios.post(
          `${baseUrl}/payment/create-order`,
          { orderId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!rzpOrderRes.data.success) {
          toast.error("Failed to create Razorpay order");
          return;
        }

        const { amount, id: rzpOrderId, currency } = rzpOrderRes.data.order;

        // Step 4: Open Razorpay Checkout Modal
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key', // Ensure this environment variable is set in frontend
          amount: amount.toString(),
          currency: currency,
          name: "Ecommerce",
          description: "Order Payment",
          order_id: rzpOrderId,
          handler: async function (response) {
            // Step 5: Verify Payment
            try {
              const verifyRes = await axios.post(
                `${baseUrl}/payment/verify-payment`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: orderId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (verifyRes.data.success) {
                // 🔥 fetch updated cart
                const Cartres = await axios.get(`${baseUrl}/cart/getcart`, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                });
                dispatch(setCart(Cartres.data.cart));
                toast.success("Payment verified successfully!");
                navigate("/products");
              }
            } catch (error) {
              toast.error("Payment verification failed");
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            contact: formData.phone,
          },
          theme: {
            color: "#2563eb", // blue-600
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };





  return (

    <div className='flex pt-50 pl-10 gap-4'>
      <div >
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
                  <Label htmlFor="fullName">First Name</Label>
                  <Input
                    className="w-full"
                    type="text"
                    required
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}

                  >

                  </Input>
                </div>

                <div className='grid gap-2 w-full'>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    className="w-full"
                    type="text"
                    required
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}

                  >

                  </Input>
                </div>

              </div>

              <div className='flex grid-col gap-2 w-full' >
                <div className=' grid gap-2 w-full'>
                  <Label htmlFor="addressLine">Address</Label>
                  <Input
                    className="w-full"
                    type="text"
                    required
                    id="addressLine"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}

                  >

                  </Input>
                </div>

              </div>

              <div className='flex grid-col gap-2 w-full' >
                <div className=' grid gap-2 w-full'>
                  <Label htmlFor="phone">Mobile No.</Label>
                  <Input
                    className="w-full"
                    type="Number"
                    required
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}

                  >

                  </Input>
                </div>

                <div className='grid gap-2 w-full'>
                  <Label htmlFor="city">City</Label>
                  <Input
                    className="w-full"
                    type="text"
                    required
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}

                  >

                  </Input>
                </div>

              </div>

              <div className='flex grid-col gap-2 w-full' >
                <div className=' grid gap-2 w-full'>
                  <Label htmlFor="state">State</Label>
                  <Input
                    className="w-full"
                    type="text"
                    required
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}

                  >

                  </Input>
                </div>

                <div className='grid gap-2 w-full'>
                  <Label htmlFor="zipcode">Zip Code</Label>
                  <Input
                    className="w-full"
                    type="text"
                    required
                    id="zipcode"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}

                  >

                  </Input>
                </div>

              </div >
              <div className='ml-50 mt-10'>
                <Button onClick={handleSubmit} variant="outline" className="bg-blue-600 text-white text-xl w-[300px] items-center"> payment</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Order
