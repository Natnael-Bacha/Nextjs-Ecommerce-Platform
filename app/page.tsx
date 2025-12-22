import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-200">
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="text-xl font-bold tracking-tighter">ESSENTIALS.</div>
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/shop" className="hover:text-zinc-500 transition-colors">
            Shop All
          </Link>
          <Link
            href="/categories"
            className="hover:text-zinc-500 transition-colors"
          >
            Categories
          </Link>
          <Link href="/new" className="hover:text-zinc-500 transition-colors">
            New Arrivals
          </Link>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <Link
            href="/sign-up"
            className="hover:text-zinc-500 transition-colors"
          >
            Account
          </Link>
          <button className="relative">Cart (0)</button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative h-[90vh] w-full flex items-center justify-center bg-zinc-100 overflow-hidden pt-20">
        <div className="z-10 text-center space-y-6 px-4">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-semibold">
            New Collection 2025
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-950">
            Design for the <br /> modern era.
          </h1>
          <p className="max-w-md mx-auto text-zinc-600 text-lg">
            Carefully curated objects that blend form and function perfectly.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/shop"
              className="bg-zinc-900 text-white px-8 py-4 rounded-full font-medium hover:bg-zinc-800 transition-all"
            >
              Shop the Collection
            </Link>
          </div>
        </div>
        {/* Placeholder for a hero image */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-400 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* --- Featured Products Grid --- */}
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
            href="/shop"
            className="text-sm font-semibold underline underline-offset-4"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-100 mb-4">
                {/* Product Image Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-zinc-300 font-bold italic text-4xl group-hover:scale-110 transition-transform duration-500">
                  IMAGE
                </div>
                <button className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur py-3 rounded-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 font-medium text-sm">
                  Add to Cart
                </button>
              </div>
              <h3 className="font-semibold text-zinc-900">
                Premium Object {item}
              </h3>
              <p className="text-zinc-500 text-sm italic mb-1">Living Room</p>
              <p className="font-medium text-zinc-950">$120.00</p>
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
