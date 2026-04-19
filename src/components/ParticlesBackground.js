import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        fpsLimit: 60,
        particles: {
          number: { value: 30, density: { enable: true, area: 800 } },
          color: { value: '#ffc107' },
          shape: { type: 'polygon', polygon: { nb_sides: 6 } },
          opacity: { value: 0.3, random: true },
          size: { value: 3, random: true },
          move: { enable: true, speed: 0.5, direction: 'none', random: true, outModes: 'out' },
          links: { enable: true, color: '#ffc107', opacity: 0.1, distance: 150 }
        },
        interactivity: {
          events: { onHover: { enable: true, mode: 'grab' } },
          modes: { grab: { distance: 200, links: { opacity: 0.3 } } }
        },
        background: { color: '#050505' },
        detectRetina: true
      }}
    />
  );
}

export default ParticlesBackground;
