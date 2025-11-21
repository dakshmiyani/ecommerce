import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";


const Signup = () => {

     const baseURL = import.meta.env.VITE_BASE_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const submitHandler = async (e) => {
    e.preventDefault();
  
    try {
        setLoading(true);
        const res = await axios.post(`${baseURL}/users/register`, formData,{
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(res.data.success){
            navigate('/verify')
            toast.success(res.data.message);    
        }
    } catch (error) {
        toast.error(error.response.data.message);
        
    }finally{
        setLoading(false);
    }
    // Handle form submission logic here
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter given details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
         
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    required
                    value ={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    value ={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value ={formData.email}
                    onChange={handleChange}
                />
              </div>
            </div>
            <br />
            <div className="grid gap-2 relative">
              <div className="grid  gap-2">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                placeholder="Create password"
                type={showPassword ? "text" : "password"}
                required
                value ={formData.password}
                    onChange={handleChange}
              />
              {showPassword ? (
                <EyeOff
                  onClick={() => setShowPassword(false)}
                  className="w-6 h-6 text-gray-600 absolute right-3 top-7 cursor-pointer"
                />
              ) : (
                <Eye
                  onClick={() => setShowPassword(true)}
                  className="w-6 h-6 text-gray-600 absolute right-3 top-7 cursor-pointer"
                />
              )}
            </div>
        
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            onClick={submitHandler}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2"/> please wait</> : "Sign Up"}
          </Button>
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Login
            </Link>{" "}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
