'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Product Type
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

// Initial Product Data
const PRODUCTS: Product[] = [
  // Hamburguesas
  { id: 1, name: 'Hamburguesa Clásica', price: 8.99, image: '/hamburguesa-clasica.jpg', category: 'Hamburguesas' },
  { id: 2, name: 'Hamburguesa Especial', price: 10.99, image: '/hamburguesa-especial.jpg', category: 'Hamburguesas' },
  
  // Sándwiches
  { id: 3, name: 'Sándwich de Pollo', price: 7.50, image: '/sandwich-pollo.jpg', category: 'Sándwiches' },
  
  // Burritos
  { id: 4, name: 'Burrito de Carne', price: 9.99, image: '/burrito-carne.jpg', category: 'Burritos' },
  
  // Gorditas
  { id: 5, name: 'Gordita de Queso', price: 5.99, image: '/gordita-queso.jpg', category: 'Gorditas' },
  
  // Papas
  { id: 6, name: 'Papas Fritas', price: 3.50, image: '/papas-fritas.jpg', category: 'Papas' },
  { id: 7, name: 'Papas con Queso', price: 4.99, image: '/papas-queso.jpg', category: 'Papas' },
  
  // Postres
  { id: 8, name: 'Cheesecake', price: 5.50, image: '/cheesecake.jpg', category: 'Postres' },
  { id: 9, name: 'Choco Flan', price: 4.99, image: '/choco-flan.jpg', category: 'Postres' },
  
  // Bebidas
  { id: 10, name: 'Refresco', price: 2.50, image: '/refresco.jpg', category: 'Bebidas' }
];

export default function RestaurantPage() {
  // State Management
  const [cart, setCart] = useState<Product[]>([]);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Resolve categories with Array.from
  const categories = Array.from(new Set(PRODUCTS.map(p => p.category)));

  // Cart Functions
  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Category Filtering
  const filteredProducts = activeCategory 
    ? PRODUCTS.filter(p => p.category === activeCategory)
    : PRODUCTS;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Restaurant Logo" 
            width={50} 
            height={50} 
          />
          <h1 className="ml-4 text-2xl font-bold">Delicious Eats</h1>
        </div>

        {/* Language Selector */}
        <div className="flex items-center">
          <button 
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="mr-4 bg-white text-red-600 px-2 py-1 rounded"
          >
            {language === 'es' ? '🇺🇸 EN' : '🇲🇽 ES'}
          </button>

          {/* Cart & Account Icons */}
          <div className="flex">
            <button className="mr-4">
              🛒 Cart ({cart.length})
            </button>
            <button>👤</button>
          </div>
        </div>
      </header>

      {/* Category Filters */}
      <div className="bg-white p-4 flex overflow-x-auto">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`mr-2 px-4 py-2 rounded ${!activeCategory ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
        >
          Todos
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`mr-2 px-4 py-2 rounded ${activeCategory === category ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md p-4 text-center"
          >
            <Image 
              src={product.image} 
              alt={product.name} 
              width={200} 
              height={200} 
              className="mx-auto mb-4 rounded"
            />
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-green-600 font-semibold">${product.price.toFixed(2)}</p>
            <button 
              onClick={() => addToCart(product)}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>

      {/* Cart Sidebar (Simple Version) */}
      {cart.length > 0 && (
        <div className="fixed right-0 top-0 w-64 bg-white h-full shadow-lg p-4">
          <h2 className="text-xl font-bold mb-4">Carrito</h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.name}</span>
              <div>
                <span>${item.price.toFixed(2)}</span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="ml-2 text-red-600"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 font-bold">
            Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
          </div>
          <button className="w-full bg-green-600 text-white py-2 rounded mt-4">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}