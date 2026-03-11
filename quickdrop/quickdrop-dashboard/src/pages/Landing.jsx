import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MoveRight, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/image.jpg';

const FadeIn = ({ children, delay = 0, direction = 'up', className = '' }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-10%" }}
    variants={{
      hidden: { 
        opacity: 0, 
        y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
        x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0
      },
      visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } }
    }}
  >
    {children}
  </motion.div>
);

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-500 selection:text-white pb-20">
      
      {/* ── Navigation ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center relative">
              <div className="w-[10px] h-[2px] bg-white absolute"></div>
              <div className="w-[2px] h-[10px] bg-white absolute"></div>
            </div>
            <span className={`text-xl font-black tracking-tighter ${scrolled ? 'text-slate-900' : 'text-white'}`}>LOGISTICS</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`text-sm font-semibold transition-colors hover:text-orange-500 ${scrolled ? 'text-slate-700' : 'text-white/90'}`}>Home</button>
            <a href="#services" className={`text-sm font-semibold transition-colors hover:text-orange-500 ${scrolled ? 'text-slate-700' : 'text-white/90'}`}>Services</a>
            <Link to="/signup" className={`text-sm font-semibold transition-colors hover:text-orange-500 ${scrolled ? 'text-slate-700' : 'text-white/90'}`}>Resources</Link>
            <Link to="/signup" className={`text-sm font-semibold transition-colors hover:text-orange-500 ${scrolled ? 'text-slate-700' : 'text-white/90'}`}>Industry Insight</Link>
            <a href="#about" className={`text-sm font-semibold transition-colors hover:text-orange-500 ${scrolled ? 'text-slate-700' : 'text-white/90'}`}>About Us</a>
          </div>

          <div>
            <Link to="/signup" className="px-6 py-2.5 bg-orange-600 text-white text-sm font-bold rounded-full hover:bg-orange-700 transition-colors flex items-center gap-2">
              Get Started <MoveRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section id="home" className="relative min-h-[90vh] flex items-center pt-32 pb-20 px-6 overflow-hidden rounded-b-[40px] md:rounded-b-[80px]">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Port Logistics" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40 mix-blend-multiply"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 pt-12 text-white">
            <FadeIn>
              <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-heading font-black font-extrabold uppercase tracking-tighter leading-[1.05] mb-8 max-w-[800px]">
                THE RELIABLE LOGISTICS PARTNER GROWING BRANDS CAN COUNT ON
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <p className="font-body text-base text-lg text-slate-300 font-medium max-w-md mb-10 leading-relaxed border-l-2 border-orange-500 pl-4">
                Shipping and logistics made simple with clear communication, transparent pricing, and a strategic partner guiding you every step of the way.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Link to="/signup" className="inline-flex px-8 py-3.5 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-colors items-center gap-2 group">
                Get In Touch <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </FadeIn>
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            <FadeIn delay={0.3} direction="down" className="relative group">
              <div className="bg-white rounded-3xl p-6 shadow-2xl relative translate-y-12 translate-x-12 z-20 max-w-[340px] transition-transform duration-500 group-hover:-translate-y-2">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-bold text-slate-400">01/03</span>
                  <div className="flex gap-2">
                    <Link to="/signup" className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/30"><ChevronLeft className="w-4 h-4 text-white" /></Link>
                    <Link to="/signup" className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/30"><MoveRight className="w-4 h-4 text-white" /></Link>
                  </div>
                </div>
                
                <h3 className="font-body text-base text-xl font-extrabold text-slate-800 mb-6 leading-snug">
                  Next-Level Freight Forwarding<br/>for eCommerce & Amazon Sellers
                </h3>
                
                <Link to="/signup?role=partner" className="block rounded-2xl overflow-hidden aspect-video">
                  <img src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Freight Airplane" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </Link>
              </div>
            </FadeIn>
          </div>

        </div>
      </section>

      {/* ── Services Section ── */}
      <section id="services" className="py-24 px-6 relative bg-slate-50">
        <div className="max-w-7xl mx-auto">
          
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">
              Why Choose Us
            </span>
            <h2 className="font-body text-base text-3xl md:text-5xl font-extrabold text-slate-900 max-w-3xl mx-auto leading-tight">
              Welcome To Logistics. Master Your Retail Supply Chain with Expert Logistics
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Service Card 1 */}
            <FadeIn delay={0.1}>
              <Link to="/signup" className="group block relative rounded-3xl overflow-hidden aspect-square cursor-pointer shadow-xl shadow-slate-200/50">
                <div className="absolute inset-0 bg-slate-900 z-10 opacity-30 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10 mix-blend-multiply opacity-90"></div>
                <img src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Service 1" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                
                <div className="absolute top-6 right-6 z-20">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-all duration-300">
                    <MoveRight className="text-white w-5 h-5" />
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <h3 className="font-body text-base text-white font-bold text-lg leading-tight">Services for eCommerce<br/>& Amazon Sellers</h3>
                </div>
              </Link>
            </FadeIn>

            {/* Service Card 2 */}
            <FadeIn delay={0.2} direction="down">
              <Link to="/signup?role=partner" className="group block relative rounded-3xl overflow-hidden aspect-square cursor-pointer shadow-xl shadow-slate-200/50 translate-y-0 md:translate-y-8">
                <div className="absolute inset-0 bg-slate-900 z-10 opacity-30 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10 mix-blend-multiply opacity-90"></div>
                <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Service 2" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                
                <div className="absolute top-6 right-6 z-20">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-all duration-300">
                    <MoveRight className="text-white w-5 h-5" />
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <h3 className="font-body text-base text-white font-bold text-lg leading-tight">Services for Brick<br/>& Mortar Businesses</h3>
                </div>
              </Link>
            </FadeIn>

            {/* Service Card 3 */}
            <FadeIn delay={0.3}>
              <Link to="/signup?role=partner" className="group block relative rounded-3xl overflow-hidden aspect-square cursor-pointer shadow-xl shadow-slate-200/50">
                <div className="absolute inset-0 bg-slate-900 z-10 opacity-30 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10 mix-blend-multiply opacity-90"></div>
                <img src="https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Service 3" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                
                <div className="absolute top-6 right-6 z-20">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-all duration-300">
                    <MoveRight className="text-white w-5 h-5" />
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <h3 className="font-body text-base text-white font-bold text-lg leading-tight">Services for Wholesale<br/>& Distribution</h3>
                </div>
              </Link>
            </FadeIn>

          </div>

          <div className="mt-20 flex justify-center items-center gap-4">
            <Link to="/signup" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"><ChevronLeft className="w-5 h-5 text-slate-400" /></Link>
            <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-8 h-full bg-orange-600"></div>
            </div>
            <Link to="/signup" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"><ChevronRight className="w-5 h-5 text-slate-600" /></Link>
          </div>

        </div>
      </section>

      {/* ── Dual CTA Section ── */}
      <section id="about" className="py-20 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 relative z-10">
          
          {/* For Businesses */}
          <FadeIn direction="right">
            <div className="bg-slate-900 rounded-[2rem] p-10 md:p-14 text-white relative overflow-hidden group h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-colors duration-700"></div>
              <h3 className="text-3xl md:text-4xl font-extrabold mb-4 relative z-10">For Businesses</h3>
              <p className="font-body text-base text-slate-400 mb-8 max-w-sm relative z-10 text-lg">
                Scale your logistics with our enterprise-grade delivery network. Real-time tracking, dedicated account management, and reliable fleet access.
              </p>
              <Link to="/signup?role=partner" className="relative z-10 inline-flex px-8 py-3.5 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-colors items-center gap-2 hover:gap-3">
                Partner With Us <MoveRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>

          {/* For Couriers */}
          <FadeIn direction="left" delay={0.2}>
            <div className="bg-orange-50 rounded-[2rem] p-10 md:p-14 text-slate-900 relative overflow-hidden group h-full">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-colors duration-700"></div>
              <h3 className="text-3xl md:text-4xl font-extrabold mb-4 relative z-10">For Couriers</h3>
              <p className="text-slate-600 mb-8 max-w-sm relative z-10 text-lg">
                Be your own boss. Drive with QuickDrop to earn money on your schedule, with guaranteed payouts and verified client requests.
              </p>
              <Link to="/signup?role=courier" className="relative z-10 inline-flex px-8 py-3.5 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors items-center gap-2 hover:gap-3">
                Start Driving <MoveRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ── Client Logos ── */}
      <section className="py-12 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h4 className="text-base font-bold text-slate-900 mb-8">Trusted By Clients</h4>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 border-4 border-slate-500 rounded-sm"></div>
                <span className="text-xl font-bold tracking-tighter text-slate-700">Logoipsum</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
