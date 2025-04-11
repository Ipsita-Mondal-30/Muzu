// app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Play, Music, Heart, MessageCircle, Disc } from 'lucide-react';
import Appbar from '../app/components/Appbar';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoverCard, setHoverCard] = useState(-1);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-900 opacity-20 blur-3xl transition-all duration-1000 transform ${isLoaded ? 'translate-y-0' : 'translate-y-full'}`} 
          style={{ transform: `translate(${scrollPosition * 0.05}px, ${scrollPosition * -0.03}px)` }}></div>
        <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full bg-indigo-800 opacity-20 blur-3xl transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0' : '-translate-y-full'}`}
          style={{ transform: `translate(${scrollPosition * -0.05}px, ${scrollPosition * 0.02}px)` }}></div>
        <div className={`absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-600 opacity-10 blur-3xl transition-all duration-1000 delay-500`}
          style={{ transform: `translate(${scrollPosition * 0.03}px, ${scrollPosition * 0.04}px)` }}></div>
      </div>

      {/* Navigation with integrated Appbar */}
      <nav className={`py-6 px-8 flex items-center justify-between z-10 sticky top-0 backdrop-blur-md bg-black bg-opacity-30 transition-all duration-700 ${scrollPosition > 50 ? 'shadow-md shadow-purple-900/20' : ''}`}>
        <div className="flex items-center space-x-2">
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}>
            <Disc size={32} className="text-purple-400" />
          </div>
          <h1 className={`text-2xl font-bold transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            Muzu
          </h1>
        </div>
        <div className="hidden md:flex space-x-8">
          {['Features', 'How It Works', 'For Creators'].map((item, index) => (
            <a 
              key={index}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
              className={`hover:text-purple-400 transition-all duration-500 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{ transitionDelay: `${index * 100 + 300}ms` }}
            >
              {item}
            </a>
          ))}
        </div>
        {/* Integration of Appbar authentication buttons */}
        <div className={`transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Appbar />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center px-8 md:px-16 py-20 gap-12">
        <div className="md:w-1/2 flex flex-col items-start space-y-6">
          <h2 className={`text-4xl md:text-5xl font-bold leading-tight transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            Let Your <span className="text-purple-400">Fans</span> Choose <br />The <span className="text-purple-400">Music</span> You Stream
          </h2>
          <p className={`text-lg text-gray-300 max-w-lg transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            Connect with your audience by letting them control your stream's soundtrack. Create deeper engagement with interactive music experiences.
          </p>
          <div className={`flex space-x-4 pt-4 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-500 transition-all duration-300 flex items-center hover:shadow-lg hover:shadow-purple-600/50 transform hover:-translate-y-1">
              <Play size={20} className="mr-2" />
              Get Started
            </button>
            <button className="border-2 border-purple-500 px-8 py-3 rounded-full font-bold hover:bg-purple-900 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1">
              Learn More
            </button>
          </div>
        </div>
        
        <div className={`md:w-1/2 flex justify-center transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-12 rotate-6'}`}>
          <div className="relative w-64 h-96 bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-purple-900/50 hover:border-purple-600/70 transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute top-0 w-full p-4 bg-gradient-to-b from-black to-transparent z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center animate-pulse">
                    <Music size={16} />
                  </div>
                  <span className="ml-2 font-medium">DJ_Creator</span>
                </div>
                <Heart size={20} className="text-purple-400 cursor-pointer hover:text-purple-300 transition-colors duration-300 transform hover:scale-110" />
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 z-0"></div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500 to-transparent animate-pulse z-0"></div>
            
            {/* Animated equalizer bars */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-center items-end h-16 px-8 space-x-1 z-0">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-purple-500 opacity-70 rounded-t animate-[equalizer_1s_ease-in-out_infinite_alternate]"
                  style={{
                    height: `${Math.random() * 30 + 10}%`,
                    animationDuration: `${(Math.random() * 1 + 0.5).toFixed(2)}s`,
                  }}
                ></div>
              ))}
            </div>
            
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black to-transparent z-10">
              <p className="text-sm mb-2 text-gray-300">Now Playing:</p>
              <p className="font-medium">Summer Vibes - Selected by Fans</p>
              <div className="w-full bg-gray-700 h-1 rounded-full mt-2">
                <div className="bg-purple-500 h-1 rounded-full w-1/3 relative">
                  <div className="absolute -right-1 -top-1 w-3 h-3 bg-white rounded-full shadow-md shadow-purple-500"></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <MessageCircle size={20} className="hover:text-purple-400 cursor-pointer transition-colors duration-300 transform hover:scale-110" />
                <div className="text-center">
                  <p className="text-xs">Chosen by fans</p>
                  <p className="text-purple-400 text-xs animate-pulse">Vote for next track →</p>
                </div>
                <div className="w-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="relative z-10 bg-gray-900 bg-opacity-50 backdrop-blur-sm py-16 px-8 border-t border-b border-purple-900/30">
        <div className="max-w-6xl mx-auto">
          <h3 className={`text-2xl font-bold mb-12 text-center transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Why Creators <span className="text-purple-400">Love</span> Muzu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Fan Engagement",
                desc: "Create interactive experiences that keep your audience engaged and coming back for more."
              },
              {
                title: "Easy Integration",
                desc: "Works with your favorite streaming platforms and tools with just a few clicks."
              },
              {
                title: "Community Building",
                desc: "Turn passive viewers into active participants in your creative journey."
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className={`bg-gray-800 border border-gray-700 p-6 rounded-lg transition-all duration-700 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transform cursor-pointer ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${idx * 200 + 200}ms` }}
                onMouseEnter={() => setHoverCard(idx)}
                onMouseLeave={() => setHoverCard(-1)}
              >
                <div className={`w-12 h-12 rounded-lg bg-purple-900/50 flex items-center justify-center mb-4 transition-all duration-500 ${hoverCard === idx ? 'bg-purple-600 scale-110' : ''}`}>
                  {idx === 0 && <Heart size={24} className="text-purple-300" />}
                  {idx === 1 && <Play size={24} className="text-purple-300" />}
                  {idx === 2 && <MessageCircle size={24} className="text-purple-300" />}
                </div>
                <h4 className={`font-bold text-xl mb-2 transition-all duration-300 ${hoverCard === idx ? 'text-purple-400' : 'text-white'}`}>
                  {feature.title}
                </h4>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black py-12 px-8 border-t border-purple-900/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Disc size={24} className="text-purple-400" />
            <h2 className="text-xl font-bold">Muzu</h2>
          </div>
          <div className="text-center md:text-right">
            <h3 className="font-medium mb-3 text-purple-400">Contact Us</h3>
            <p className="text-gray-400 text-sm hover:text-gray-300 transition-colors duration-300 cursor-pointer">
              support@muzu.app
            </p>
            <p className="text-gray-400 text-sm mt-1">123 Beat Street, Music City</p>
            <div className="flex space-x-6 mt-4 justify-center md:justify-end">
              {['Twitter', 'Instagram', 'Discord'].map((social, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 transform hover:-translate-y-1"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-12 text-gray-500 text-sm">
          © 2025 Muzu. All rights reserved.
        </div>
      </footer>

      <style jsx global>{`
        @keyframes equalizer {
          0% { height: 10%; }
          100% { height: 70%; }
        }
      `}</style>
    </div>
  );
}