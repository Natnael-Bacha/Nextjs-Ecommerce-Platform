"use client";
import Link from "next/link";

export default function Home() {
  const handleRoleSelect = (role: "user" | "admin") => {
    if (role === "user") {
      window.location.href = "/sign-up";
    } else if (role === "admin") {
      window.location.href = "/adminSignIn";
    }
  };

  const handleAddToCart = () => {
    // redirect to sign in
    window.location.href = "/sign-in";
  };

  // Example product data with images
  const products = [
    {
      id: 1,
      name: "Ruler",
      category: "Stationary Product",
      price: 10.0,
      imageUrl:
        "https://images.pexels.com/photos/29279398/pexels-photo-29279398.jpeg?_gl=1*1vpkz9t*_ga*MzAwMzU5NjQ2LjE3NjY2Njg4ODA.*_ga_8JE65Q40S6*czE3NzAzNjEwMzgkbzIwJGcxJHQxNzcwMzYxMDQyJGo1NiRsMCRoMA..",
    },
    {
      id: 2,
      name: "USB Drive",
      category: "Tech Gadget",
      price: 15,
      imageUrl:
        "https://images.pexels.com/photos/18641665/pexels-photo-18641665.png?_gl=1*bpkqdo*_ga*MzAwMzU5NjQ2LjE3NjY2Njg4ODA.*_ga_8JE65Q40S6*czE3NzAzNjI5MzEkbzIxJGcxJHQxNzcwMzYyOTMyJGo1OSRsMCRoMA..",
    },
    {
      id: 3,
      name: "Charger",
      category: "Electronics",
      price: 20.0,
      imageUrl:
        "https://images.pexels.com/photos/36012993/pexels-photo-36012993.jpeg?_gl=1*1nhan8c*_ga*MzAwMzU5NjQ2LjE3NjY2Njg4ODA.*_ga_8JE65Q40S6*czE3NzAzNjI5MzEkbzIxJGcxJHQxNzcwMzYzMDA5JGo2MCRsMCRoMA..",
    },
    {
      id: 4,
      name: "Wallet",
      category: "Fashion",
      price: 25.0,
      imageUrl:
        "https://images.pexels.com/photos/13225343/pexels-photo-13225343.jpeg?_gl=1*1ylvjeo*_ga*MzAwMzU5NjQ2LjE3NjY2Njg4ODA.*_ga_8JE65Q40S6*czE3NzAzNjI5MzEkbzIxJGcxJHQxNzcwMzYzMDc5JGo2MCRsMCRoMA..",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-200">
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="text-xl font-bold tracking-tighter">ESSENTIALS.</div>
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link
            href="/sign-in"
            className="hover:text-zinc-500 transition-colors"
          >
            Shop All
          </Link>
          <Link
            href="/sign-in"
            className="hover:text-zinc-500 transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/sign-in"
            className="hover:text-zinc-500 transition-colors"
          >
            New Arrivals
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative h-[90vh] w-full flex flex-col items-center justify-center bg-zinc-100 overflow-hidden pt-20 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-semibold">
          New Collection 2025
        </span>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-950 mt-2">
          Design for the <br /> modern era.
        </h1>
        <p className="max-w-md mx-auto text-zinc-600 text-lg mt-4">
          Carefully curated objects that blend form and function perfectly.
        </p>

        {/* Role Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => handleRoleSelect("user")}
            className="bg-zinc-900 text-white px-8 py-4 rounded-full font-medium hover:bg-zinc-800 transition-all"
          >
            I am a User
          </button>
          <button
            onClick={() => handleRoleSelect("admin")}
            className="bg-zinc-400 text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-all"
          >
            I am an Admin
          </button>
        </div>

        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-400 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* --- Featured Products --- */}
      <main className="max-w-7xl mx-auto py-24 px-8">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Products
            </h2>
            <p className="text-zinc-500">
              Our most sought-after pieces this week.
            </p>
          </div>
          <Link
            href="/sign-in"
            className="text-sm font-semibold underline underline-offset-4"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-100 mb-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500"
                />
                <button
                  onClick={handleAddToCart}
                  className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur py-3 rounded-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 font-medium text-sm"
                >
                  Add to Cart
                </button>
              </div>
              <h3 className="font-semibold text-zinc-900">{product.name}</h3>
              <p className="text-zinc-500 text-sm italic mb-1">
                {product.category}
              </p>
              <p className="font-medium text-zinc-950">
                ${product.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-zinc-100 py-16 px-8 bg-zinc-50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="text-xl font-bold tracking-tighter mb-4">
              ESSENTIALS.
            </div>
            <p className="text-zinc-500 max-w-xs mb-6">
              Elevating your daily routine through intentional design and
              quality craftsmanship.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest">
              Support
            </h4>
            <ul className="text-zinc-500 text-sm space-y-2">
              <li>Shipping</li>
              <li>Returns</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest">
              Legal
            </h4>
            <ul className="text-zinc-500 text-sm space-y-2">
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
