import React from 'react';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-all duration-300">
      

      <DotLottieReact
        src="https://lottie.host/9f133909-f84b-4318-8a2e-848ca7651cac/149hwE5G3g.lottie"
        loop
        autoplay
      />
      
      <p className="mt-6 text-gray-500 text-sm font-medium tracking-widest uppercase animate-pulse">
        Cargando ...
      </p>
    </div>
  );
};

export default LoadingScreen;