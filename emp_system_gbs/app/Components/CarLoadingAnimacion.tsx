'use client';

import { useState, useEffect } from 'react';
import { Car, UserCircle, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Enhanced static car background with more cars matching the lobby style
function CarStaticBackground({ opacity = 1 }) {
  // Pre-define more static car positions for a denser pattern
  const staticCars = [
    // Original cars
    { size: 28, top: 15, left: 10, opacity: 0.08, rotation: 15 },
    { size: 22, top: 25, left: 85, opacity: 0.06, rotation: 190 },
    { size: 20, top: 65, left: 20, opacity: 0.05, rotation: 45 },
    { size: 24, top: 75, left: 75, opacity: 0.07, rotation: 320 },
    { size: 18, top: 40, left: 50, opacity: 0.04, rotation: 90 },
    { size: 26, top: 85, left: 40, opacity: 0.08, rotation: 250 },
    { size: 16, top: 5, left: 60, opacity: 0.05, rotation: 135 },
    { size: 20, top: 55, left: 5, opacity: 0.06, rotation: 0 },
    { size: 30, top: 30, left: 30, opacity: 0.09, rotation: 275 },
    { size: 14, top: 60, left: 90, opacity: 0.04, rotation: 60 },
    { size: 22, top: 10, left: 75, opacity: 0.07, rotation: 180 },
    { size: 18, top: 90, left: 15, opacity: 0.05, rotation: 225 },
    { size: 24, top: 45, left: 70, opacity: 0.08, rotation: 30 },
    { size: 20, top: 80, left: 60, opacity: 0.06, rotation: 300 },
    { size: 16, top: 35, left: 15, opacity: 0.05, rotation: 165 },
    // Additional cars for denser pattern
    { size: 22, top: 12, left: 42, opacity: 0.07, rotation: 110 },
    { size: 18, top: 28, left: 6, opacity: 0.05, rotation: 240 },
    { size: 26, top: 50, left: 88, opacity: 0.08, rotation: 35 },
    { size: 14, top: 82, left: 25, opacity: 0.04, rotation: 185 },
    { size: 20, top: 6, left: 28, opacity: 0.06, rotation: 290 },
    { size: 24, top: 70, left: 50, opacity: 0.07, rotation: 155 },
    { size: 16, top: 48, left: 35, opacity: 0.05, rotation: 75 },
    { size: 28, top: 95, left: 80, opacity: 0.08, rotation: 210 },
    { size: 18, top: 18, left: 95, opacity: 0.05, rotation: 120 },
    { size: 22, top: 38, left: 65, opacity: 0.07, rotation: 345 },
    { size: 20, top: 58, left: 22, opacity: 0.06, rotation: 80 },
    { size: 24, top: 88, left: 45, opacity: 0.07, rotation: 225 },
    { size: 16, top: 78, left: 12, opacity: 0.05, rotation: 310 },
    { size: 26, top: 8, left: 48, opacity: 0.08, rotation: 140 },
    { size: 18, top: 32, left: 78, opacity: 0.05, rotation: 265 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className="absolute inset-0">
        {/* Static positioned car silhouettes */}
        {staticCars.map((car, i) => (
          <Car 
            key={i}
            size={car.size}
            className="text-white absolute" 
            style={{
              top: `${car.top}%`,
              left: `${car.left}%`,
              opacity: car.opacity * opacity,
              transform: `rotate(${car.rotation}deg)`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function CarLoadingAnimation() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [blurAmount, setBlurAmount] = useState(10); // Initial blur amount
  const [showLobby, setShowLobby] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState(0);
  const [hoveredOption, setHoveredOption] = useState<'clientes' | 'vehiculos' | 'alquileres' | null>(null);
  const [skipAnimation, setSkipAnimation] = useState(false);

  useEffect(() => {
    // Check if animation has already been shown in this browser session
    const hasSeenAnimation = localStorage.getItem('hasSeenTheCarsAnimation');
    
    if (hasSeenAnimation === 'true') {
      // Skip animation and go straight to lobby
      setSkipAnimation(true);
      setBlurAmount(0);
      setIsLoaded(true);
      setShowLobby(true);
      setTransitionPhase(3);
    } else {
      // Start animation and set localStorage flag
      startLoadingAnimation();

      // Set the flag indicating animation has been shown
      localStorage.setItem('hasSeenTheCarsAnimation', 'true');
      
      // Setup event listener to clear localStorage when window/tab is closed
      const handleBeforeUnload = () => {
        localStorage.removeItem('hasSeenTheCarsAnimation');
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, []);

  const startLoadingAnimation = () => {
    // Start blur animation immediately
    const blurTimer = setInterval(() => {
      setBlurAmount(prevBlur => {
        // Gradually reduce blur from 10px to 0px
        if (prevBlur <= 0) {
          clearInterval(blurTimer);
          
          // When blur effect finishes, consider content loaded
          setTimeout(() => {
            setIsLoaded(true);
            
            // Start transition to lobby
            setTimeout(() => {
              startTransition();
            }, 800);
          }, 500);
          
          return 0;
        }
        return prevBlur - 0.2; // Reduce blur gradually
      });
    }, 50);
    
    return () => clearInterval(blurTimer);
  };

  // Function to handle the transition animation to the lobby
  const startTransition = () => {
    // Phase 1: Fade out the title
    setTransitionPhase(1);
    
    // Phase 2: After some time, start showing the lobby with a fade in
    setTimeout(() => {
      setTransitionPhase(2);
      setShowLobby(true);
      
      // Phase 3: Complete transition
      setTimeout(() => {
        setTransitionPhase(3);
      }, 800);
      
    }, 1000);
  };

  // Handle navigation to different sections
  const handleNavigation = (route: string) => {
    // Add a small delay for a better user experience (allowing the button animation to complete)
    setTimeout(() => {
      router.push(route);
    }, 300);
  };

  return (
    <div className="relative overflow-hidden h-screen w-screen" style={{ 
      backgroundColor: '#333',
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* Loading Screen - Only shown when animation is not skipped */}
      {!skipAnimation && (
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
            transitionPhase >= 1 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <CarStaticBackground opacity={transitionPhase === 0 ? 1 : 0} />
          
          <div className="w-full max-w-md z-10 relative p-4 flex flex-col items-center justify-center">
            {/* River Cars Logo/Title with blur effect */}
            <div 
              className="mb-6 text-center text-white transition-all duration-1000 ease-in-out"
              style={{ 
                filter: `blur(${blurAmount}px)`,
                transform: `scale(${1 + blurAmount/20})`,
                opacity: 1 - (blurAmount / 20)
              }}
            >
              {/* Logo/Icon */}
              <div className="flex justify-center mb-4">
                <Car size={64} className="text-white" />
              </div>
              
              {/* Title Text */}
              <h1 className="text-5xl font-bold tracking-wider font-[Poppins]">
                THE CARS
              </h1>
              <p className="text-lg font-light mt-2">
                Desarrolado por el tomasin
              </p>
              
              {/* Tagline that appears as blur reduces */}
              <p 
                className="mt-4 text-xl transition-all duration-1000"
                style={{ 
                  opacity: 1 - (blurAmount / 5) > 0 ? 1 - (blurAmount / 5) : 0 
                }}
              >
                Sistema de Gestión de Alquiler
              </p>
            </div>
            
            {/* Ready Message - appears after blur is complete */}
            <div 
              className="text-center text-white text-lg font-medium font-[Poppins] mt-8 transition-opacity duration-700"
              style={{ opacity: isLoaded ? 1 : 0 }}
            >
              {isLoaded ? "¡Bienvenido!" : ""}
            </div>
          </div>
        </div>
      )}

      {/* Transition Element - Simple fade effect - Only shown when animation is not skipped */}
      {!skipAnimation && (
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${
            transitionPhase === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col items-center">
            <Car 
              size={96} 
              className="text-white opacity-70"
              style={{
                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))"
              }}
            />
          </div>
        </div>
      )}

      {/* Lobby View (shown during transition or immediately if skipping animation) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          showLobby ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="h-screen w-screen flex flex-col lg:flex-row font-[Poppins]">
          {/* Clientes Section - Dark background (#333) */}
          <div 
            className={`relative w-full lg:w-1/3 h-1/3 lg:h-full flex items-center justify-center transition-all duration-500 ease-in-out bg-[#333] ${
              hoveredOption === 'clientes' ? 'lg:w-2/5' : 'lg:w-1/3'
            }`}
            onMouseEnter={() => setHoveredOption('clientes')}
            onMouseLeave={() => setHoveredOption(null)}
          >
            {/* Content */}
            <div className="relative z-10 p-8 text-center text-white max-w-md">
              <div className="flex justify-center mb-6">
                <UserCircle size={80} className="text-white" />
              </div>
              
              <h2 className="text-4xl font-light uppercase tracking-wide mb-6 font-[Poppins]">Clientes</h2>
              
              <div className={`overflow-hidden transition-all duration-500 ${hoveredOption === 'clientes' ? 'max-h-96 opacity-100' : 'max-h-0 lg:opacity-0'}`}>
                <p className="mb-8 text-gray-300 font-[Poppins]">
                  Gestione la información de sus clientes y mantenga un registro detallado de cada uno.
                </p>
                
                <ul className="space-y-3 mb-8 text-left font-[Poppins]">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-white mr-3"></div>
                    <span>Registro de clientes</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-white mr-3"></div>
                    <span>Historial de alquileres</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-white mr-3"></div>
                    <span>Información de contacto</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-white mr-3"></div>
                    <span>Documentación personal</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={() => handleNavigation('/clientes')}
                className="mt-4 px-8 py-3 bg-white hover:bg-gray-200 text-[#333] rounded-full transition-all duration-300 uppercase tracking-wider text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-[Poppins]"
              >
                Gestionar Clientes
              </button>
            </div>
          </div>
          
          {/* Vehículos Section - White background */}
          <div 
            className={`relative w-full lg:w-1/3 h-1/3 lg:h-full flex items-center justify-center transition-all duration-500 ease-in-out bg-white ${
              hoveredOption === 'vehiculos' ? 'lg:w-2/5' : 'lg:w-1/3'
            }`}
            onMouseEnter={() => setHoveredOption('vehiculos')}
            onMouseLeave={() => setHoveredOption(null)}
          >
            {/* Content */}
            <div className="relative z-10 p-8 text-center text-[#333] max-w-md">
              <div className="flex justify-center mb-6">
                <Car size={80} className="text-[#333]" />
              </div>
              
              <h2 className="text-4xl font-light uppercase tracking-wide mb-6 font-[Poppins]">Vehículos</h2>
              
              <div className={`overflow-hidden transition-all duration-500 ${hoveredOption === 'vehiculos' ? 'max-h-96 opacity-100' : 'max-h-0 lg:opacity-0'}`}>
                <p className="mb-8 text-gray-700 font-[Poppins]">
                  Administre su flota de vehículos, controle el mantenimiento y gestione la disponibilidad.
                </p>
                
                <ul className="space-y-3 mb-8 text-left font-[Poppins]">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#333] mr-3"></div>
                    <span>Inventario de vehículos</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#333] mr-3"></div>
                    <span>Control de mantenimiento</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#333] mr-3"></div>
                    <span>Historial de cada vehículo</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#333] mr-3"></div>
                    <span>Estado y disponibilidad</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={() => handleNavigation('/vehiculos')}
                className="mt-4 px-8 py-3 bg-[#333] hover:bg-gray-700 text-white rounded-full transition-all duration-300 uppercase tracking-wider text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-[Poppins]"
              >
                Gestionar Vehículos
              </button>
            </div>
          </div>
          
          {/* Alquileres Section - Dark background (#333) */}
          <div 
            className={`relative w-full lg:w-1/3 h-1/3 lg:h-full flex items-center justify-center transition-all duration-500 ease-in-out bg-[#333] ${
              hoveredOption === 'alquileres' ? 'lg:w-2/5' : 'lg:w-1/3'
            }`}
            onMouseEnter={() => setHoveredOption('alquileres')}
            onMouseLeave={() => setHoveredOption(null)}
          >
            {/* Content */}
            <div className="relative z-10 p-8 text-center text-white max-w-md">
              <div className="flex justify-center mb-6">
                <Calendar size={80} className="text-white" />
              </div>
              
              <h2 className="text-4xl font-light uppercase tracking-wide mb-6 font-[Poppins]">Alquileres</h2>
              
              <div className={`overflow-hidden transition-all duration-500 ${hoveredOption === 'alquileres' ? 'max-h-96 opacity-100' : 'max-h-0 lg:opacity-0'}`}>
                <p className="mb-8 text-gray-300 font-[Poppins]">
                  Gestione las reservas y alquileres de vehículos de manera eficiente y organizada.
                </p>
                
                <ul className="space-y-3 mb-8 text-left font-[Poppins]">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-white mr-3"></div>
                    <span>Reservas y calendario</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-white mr-3"></div>
                    <span>Contratos de alquiler</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-white mr-3"></div>
                    <span>Facturación y pagos</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-white mr-3"></div>
                    <span>Entrega y devolución</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={() => handleNavigation('/rental')}
                className="mt-4 px-8 py-3 bg-white hover:bg-gray-200 text-[#333] rounded-full transition-all duration-300 uppercase tracking-wider text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-[Poppins]"
              >
                Gestionar Alquileres
              </button>
            </div>
          </div>
          
          {/* Dividers for desktop */}
          <div className="hidden lg:block absolute left-1/3 top-0 h-full z-20">
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-px h-full bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
            </div>
          </div>
          
          <div className="hidden lg:block absolute left-2/3 top-0 h-full z-20">
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-px h-full bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes blurReveal {
          0% { filter: blur(10px); }
          100% { filter: blur(0px); }
        }
      `}</style>
    </div>
  );
}