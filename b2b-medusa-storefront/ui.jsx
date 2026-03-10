import React, { useState } from 'react';
import { 
  Recycle, Search, Factory, ShieldCheck, MapPin, 
  Scale, ArrowRight, ChevronDown, Filter, LayoutGrid, 
  List, Leaf, BarChart3, Package, Truck
} from 'lucide-react';

// --- MOCK DATA ---
const CATEGORIES = [
  { name: 'Metal Scrap', icon: <Package className="w-6 h-6" />, count: '1,240' },
  { name: 'Plastic Waste', icon: <Recycle className="w-6 h-6" />, count: '890' },
  { name: 'Paper & Cardboard', icon: <Package className="w-6 h-6" />, count: '2,100' },
  { name: 'E-Waste', icon: <Factory className="w-6 h-6" />, count: '450' },
  { name: 'Construction Debris', icon: <Truck className="w-6 h-6" />, count: '320' },
  { name: 'Industrial Byproducts', icon: <BarChart3 className="w-6 h-6" />, count: '150' },
];

const MATERIALS = [
  { id: 1, title: 'Shredded HDPE Plastic', qty: '20 Tons', price: '$450/ton', loc: 'Mumbai, MH', verified: true, type: 'Plastic', img: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400' },
  { id: 2, title: 'Baled Corrugated Cardboard (OCC)', qty: '50 Tons', price: '$120/ton', loc: 'Delhi, DL', verified: true, type: 'Paper', img: 'https://images.unsplash.com/photo-1603525265436-1e96f1311bda?auto=format&fit=crop&q=80&w=400' },
  { id: 3, title: 'Copper Wire Scrap (Millberry)', qty: '5 Tons', price: '$8,200/ton', loc: 'Chennai, TN', verified: false, type: 'Metal', img: 'https://images.unsplash.com/photo-1558611100-7db0a95de1e5?auto=format&fit=crop&q=80&w=400' },
  { id: 4, title: 'Clean PET Flakes (Hot Washed)', qty: '15 Tons', price: '$600/ton', loc: 'Pune, MH', verified: true, type: 'Plastic', img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400' },
  { id: 5, title: 'Aluminum Extrusion Scrap', qty: '12 Tons', price: '$1,800/ton', loc: 'Ahmedabad, GJ', verified: true, type: 'Metal', img: 'https://images.unsplash.com/photo-1563812169-42b47fc71db5?auto=format&fit=crop&q=80&w=400' },
  { id: 6, title: 'Mixed E-Waste Boards', qty: '2 Tons', price: '$4,500/ton', loc: 'Bangalore, KA', verified: true, type: 'E-Waste', img: 'https://images.unsplash.com/photo-1550005938-1a551322ab59?auto=format&fit=crop&q=80&w=400' },
];

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen bg-[#F3FDF6] font-sans text-slate-800 selection:bg-emerald-200">
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setCurrentView('home')}
            >
              <div className="w-10 h-10 bg-[#0B3D2E] rounded-xl flex items-center justify-center group-hover:bg-[#1FAF5A] transition-colors duration-300 shadow-sm">
                <Recycle className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-[#0B3D2E] tracking-tight">EcoMarket B2B</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setCurrentView('marketplace')}
                className={`font-medium transition-colors ${currentView === 'marketplace' ? 'text-[#1FAF5A]' : 'text-slate-600 hover:text-[#0B3D2E]'}`}
              >
                Marketplace
              </button>
              <button className="text-slate-600 font-medium hover:text-[#0B3D2E] transition-colors">Prices & Trends</button>
              <button className="text-slate-600 font-medium hover:text-[#0B3D2E] transition-colors">Logistics</button>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:block text-[#0B3D2E] font-medium hover:text-[#1FAF5A] transition-colors">
                Sign In
              </button>
              <button className="bg-[#1FAF5A] hover:bg-[#16944a] text-white px-5 py-2.5 rounded-lg font-medium shadow-sm shadow-emerald-200/50 transition-all active:scale-95 flex items-center gap-2">
                Post Material
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- VIEW ROUTING --- */}
      {currentView === 'home' ? <LandingPage onNavigate={setCurrentView} /> : <MarketplacePage />}

      {/* --- FOOTER --- */}
      <footer className="bg-[#0B3D2E] text-slate-300 py-16 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Recycle className="text-[#1FAF5A] w-6 h-6" />
              <span className="text-xl font-bold text-white tracking-tight">EcoMarket B2B</span>
            </div>
            <p className="text-sm leading-relaxed text-emerald-100/70">
              The premier circular economy platform connecting industrial waste generators with verified recyclers and bulk buyers.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Browse Materials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Live Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Verified Sellers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability Impact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>support@ecomarket.b2b</li>
              <li>1-800-RECYCLE</li>
              <li className="pt-2"><button className="text-[#1FAF5A] hover:text-white transition-colors font-medium">Help Center &rarr;</button></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// 1️⃣ LANDING PAGE COMPONENT
// ==========================================
function LandingPage({ onNavigate }) {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-emerald-100/50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[600px] h-[600px] bg-teal-50/50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-[#0B3D2E] text-sm font-semibold mb-6">
              <Leaf className="w-4 h-4 text-[#1FAF5A]" />
              B2B Circular Economy Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#0B3D2E] tracking-tight leading-[1.1] mb-6">
              Transform Waste into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1FAF5A] to-teal-600">Value.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Connect directly with verified recyclers, scrap dealers, and bulk material buyers across the globe. Secure, transparent, and built for scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#0B3D2E] hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 flex justify-center items-center gap-2">
                Sell Scrap
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onNavigate('marketplace')}
                className="bg-white border-2 border-slate-200 hover:border-[#1FAF5A] text-slate-700 hover:text-[#0B3D2E] px-8 py-4 rounded-xl font-semibold shadow-sm transition-all hover:-translate-y-0.5 flex justify-center items-center"
              >
                Buy Recyclables
              </button>
            </div>
          </div>
          
          {/* Hero Illustration / Dashboard Preview Mockup */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1FAF5A]/10 to-transparent rounded-3xl transform rotate-3 scale-105"></div>
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 relative z-10 transform -rotate-1 transition-transform hover:rotate-0 duration-500">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div className="font-semibold text-slate-800">Recent Marketplace Activity</div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-[#1FAF5A]">
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">20t Shredded HDPE</div>
                      <div className="text-sm text-slate-500">Verified Seller • Mumbai</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#0B3D2E]">$450/t</div>
                      <div className="text-xs text-[#1FAF5A] font-medium">Available</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="bg-[#0B3D2E] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-emerald-800">
            <div className="p-4">
              <div className="text-4xl font-extrabold text-white mb-2">25,000+</div>
              <div className="text-emerald-300 font-medium">Tons Recycled</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-extrabold text-white mb-2">12,000+</div>
              <div className="text-emerald-300 font-medium">Transactions Secured</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-extrabold text-white mb-2">18,000+</div>
              <div className="text-emerald-300 font-medium">Tons CO₂ Reduced</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B3D2E] mb-4">Browse by Material</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Find exact specifications of industrial scrap and recyclables across our vetted network.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <div 
                key={idx} 
                onClick={() => onNavigate('marketplace')}
                className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-[#1FAF5A]/30 hover:shadow-lg hover:shadow-emerald-100 transition-all cursor-pointer flex items-center gap-5"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-50 group-hover:bg-emerald-50 text-slate-500 group-hover:text-[#1FAF5A] flex items-center justify-center transition-colors">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-[#0B3D2E] transition-colors">{cat.name}</h3>
                  <p className="text-sm text-slate-500">{cat.count} active listings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


// ==========================================
// 2️⃣ MARKETPLACE LISTING COMPONENT
// ==========================================
function MarketplacePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0B3D2E]">Marketplace</h1>
          <p className="text-slate-500 mt-1">Showing 1,204 available materials</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search materials, grades, locations..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1FAF5A] focus:ring-1 focus:ring-[#1FAF5A] outline-none transition-shadow shadow-sm"
            />
          </div>
          <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            <button className="p-1.5 bg-slate-100 rounded-lg text-slate-700"><LayoutGrid className="w-5 h-5" /></button>
            <button className="p-1.5 text-slate-400 hover:text-slate-700"><List className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
          {/* Filter Block: Material Type */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
              Material Type <ChevronDown className="w-4 h-4 text-slate-400" />
            </h3>
            <div className="space-y-3">
              {['Plastic', 'Metal', 'Paper & Cardboard', 'E-Waste', 'Glass'].map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#1FAF5A] focus:ring-[#1FAF5A]" />
                  <span className="text-slate-600 group-hover:text-slate-900 text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Block: Verification */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
              Trust & Safety <ChevronDown className="w-4 h-4 text-slate-400" />
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#1FAF5A] focus:ring-[#1FAF5A]" />
                <span className="text-slate-600 group-hover:text-slate-900 text-sm flex items-center gap-1">
                  Verified Sellers Only <ShieldCheck className="w-4 h-4 text-[#1FAF5A]" />
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#1FAF5A] focus:ring-[#1FAF5A]" />
                <span className="text-slate-600 group-hover:text-slate-900 text-sm">ISO Certified</span>
              </label>
            </div>
          </div>

          {/* Filter Block: Price Range */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
              Price Range (per Ton) <ChevronDown className="w-4 h-4 text-slate-400" />
            </h3>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Min" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#1FAF5A] outline-none" />
              <span className="text-slate-400">-</span>
              <input type="number" placeholder="Max" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#1FAF5A] outline-none" />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Filter className="w-4 h-4" /> Active Filters: <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-medium text-slate-700">Verified</span>
            </div>
            <select className="text-sm border-none bg-transparent text-slate-600 font-medium cursor-pointer outline-none focus:ring-0">
              <option>Sort by: Latest</option>
              <option>Price: Low to High</option>
              <option>Quantity: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MATERIALS.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300 group">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-slate-700 rounded-lg shadow-sm">
                    {item.type}
                  </div>
                  {item.verified && (
                    <div className="absolute top-3 right-3 p-1.5 bg-[#1FAF5A] text-white rounded-lg shadow-sm tooltip" title="Verified Seller">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                {/* Card Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-900 mb-3 line-clamp-1 group-hover:text-[#1FAF5A] transition-colors">{item.title}</h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                      <Scale className="w-4 h-4 text-slate-400" /> {item.qty} Available
                    </div>
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" /> {item.loc}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Asking Price</div>
                      <div className="text-xl font-extrabold text-[#0B3D2E]">{item.price}</div>
                    </div>
                    <button className="px-4 py-2 bg-slate-50 hover:bg-[#1FAF5A] text-slate-700 hover:text-white rounded-xl text-sm font-semibold transition-colors duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination (Static) */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button className="px-3 py-1.5 text-sm text-slate-400 cursor-not-allowed">Prev</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1FAF5A] text-white text-sm font-medium">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 text-sm font-medium transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 text-sm font-medium transition-colors">3</button>
              <button className="px-3 py-1.5 text-sm text-slate-700 hover:text-[#0B3D2E] font-medium transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}