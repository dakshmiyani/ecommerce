import { useState } from 'react'
import React from 'react'
import { Button } from './components/ui/button'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' 
import Navbar from './components/ui/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Verify from './pages/Verify'
import VerfyEmail from './pages/VerfyEmail'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOtp from './pages/VerifyOtp'
import ResetPassword from './pages/ResetPassword'
import Products  from './pages/products'
import Cart from './pages/Cart'
import Order from './pages/Order'


import AdminLayout from './pages/AdminLayout';
import AdminProducts from './components/ui/AdminProducts';
import AddProduct from './components/ui/AddProducts';
import UpdateProduct from './components/ui/UpdateProduct';
import AdminOrders from './components/ui/AdminOrder'
import ProtectedAdminRoute from './routes/ProtectedRoute'
import AdminDashboard from './components/ui/AdminDashboard'

const router = createBrowserRouter([
  // Define your routes here
{
  path: "/",
  element: <><Navbar /><Home /></>
},
{
  path: "/login",
  element: <Login />
},
{
  path: "/signup",
  element: <Signup />
},
{
  path: "/verify",
  element: <Verify />
},
{
  path:"/verify/:token",
  element:< VerfyEmail/>
},
{
  path: "/profile/:userId",
  element:<><Navbar /><Profile /></>
},
{
  path: "/forgot-password",
  element: <ForgotPassword />
},
{
  path:"/verify-otp",
  element:<VerifyOtp />
},
{
  path:"/reset-password",
  element:<ResetPassword />
},
{
  path:"/products",
  element:<><Navbar /><Products/></>

},
{
  path:"/cart",
  element:<><Navbar /><Cart/></>
},
{
  path:"/order",
  element:<><Navbar /><Order/></>
},
 {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "update-product/:productId",
        element: <UpdateProduct />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
    ],
  },
])


function App() {


  return (
    <>
    <RouterProvider router={router} />
      
    </>
  )
}

export default App
