import Features from '@/components/Features'
import Footer from '@/components/Footer'
import HomeCategoryProducts from '@/components/HomeCategoryProducts'
import Hero from '@/components/ui/Hero'
import React from 'react'

const Home = () => {
  return (
    <div>
      <Hero />
      <HomeCategoryProducts />
      <Features />
      <Footer />

    </div>
  )
}

export default Home