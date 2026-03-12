import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ui/ProductCart";
import { Skeleton } from "./ui/skeleton";

const HomeCategoryProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const baseURL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${baseURL}/products/all-products`);
                if (res.data?.success) {
                    const fetchedProducts = res.data.products;
                    setProducts(fetchedProducts);

                    // Extract unique categories
                    const uniqueCats = [...new Set(fetchedProducts.map(p => p.category || "Uncategorized"))];
                    setCategories(uniqueCats);
                }
            } catch (error) {
                console.error("Failed to fetch products for home page", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [baseURL]);

    if (loading) {
        return (
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">Featured Collection</h2>
                    <div className="flex justify-center gap-3 mb-8 overflow-x-auto pb-2">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-64 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    const filteredProducts = activeCategory === "All"
        ? products
        : products.filter(p => (p.category || "Uncategorized") === activeCategory);

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Collection</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Explore our premium selection of products tailored just for you.</p>
                </div>

                {/* Category Filter Chips */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <button
                        onClick={() => setActiveCategory("All")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === "All" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-blue-600"}`}
                    >
                        All
                    </button>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${activeCategory === category ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-blue-600"}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Unified Dense Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 items-stretch">
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="w-full flex justify-center">
                            <div className="w-full max-w-[280px]">
                                <ProductCard product={product} loading={false} />
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        No products found in this category.
                    </div>
                )}

                <div className="mt-12 text-center">
                    <a href="/products" className="inline-block bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 hover:text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-sm transition-colors">
                        View All Products
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HomeCategoryProducts;
