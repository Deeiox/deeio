import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

interface ImageData {
  src: string;
  alt: string;
}

interface VerticalCarouselProps {
  imageCount: number;
  basePath?: string;
  scrollSpeed?: number; // px per step
  interval?: number; // ms per step
}

const VerticalCarousel: React.FC<VerticalCarouselProps> = ({
  imageCount,
  scrollSpeed = 3,
  interval = 50,
}) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const lastTsRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const prevX = useRef<number>(0);
  const prevY = useRef<number>(0);
  const touchVelocity = useRef<number>(0);
  const touchTime = useRef<number>(0);
  const touchPositions = useRef<{x: number, time: number}[]>([]);

  useEffect(() => {
    // Detecta si es mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Genera URLs determinísticas desde /public/assets (servido como /assets/*)
    const MAX_AVAILABLE = 6; // número de archivos cityN.webp disponibles en public/assets
    const count = Math.min(Math.max(0, imageCount), MAX_AVAILABLE);
    const prepared: ImageData[] = Array.from({ length: count }, (_, i) => {
      const index = i + 1;
      return {
        src: `/assets/city${index}.webp`,
        alt: `City artwork ${index}`,
      };
    });

    setImages(prepared);
  }, [imageCount]);

  useEffect(() => {
    // reinicia posición al cambiar imágenes o velocidad
    y.set(0);
    x.set(0);
    lastTsRef.current = null;
    prevX.current = 0;
    prevY.current = 0;
  }, [images, scrollSpeed, interval, y, x]);

  useAnimationFrame((t, delta) => {
    const container = carouselRef.current;
    const content = contentRef.current;
    if (!container || !content || images.length === 0 || isDragging) return;

    const pixelsPerSecond = (scrollSpeed * 1000) / Math.max(1, interval);
    const distance = (pixelsPerSecond * delta) / 1000; // px por frame

    if (isMobile) {
      // Scroll horizontal en mobile
      const maxScroll = Math.max(
        0,
        content.scrollWidth - container.clientWidth
      );
      if (maxScroll <= 0) return;

      let nextX = x.get() - distance; // desplazamiento hacia la izquierda
      if (Math.abs(nextX) >= maxScroll - 1) {
        nextX = 0; // reinicio de bucle
      }
      x.set(nextX);
      prevX.current = nextX;
    } else {
      // Scroll vertical en desktop
      const maxScroll = Math.max(
        0,
        content.scrollHeight - container.clientHeight
      );
      if (maxScroll <= 0) return;

      let nextY = y.get() - distance; // desplazamiento hacia arriba
      if (Math.abs(nextY) >= maxScroll - 1) {
        nextY = 0; // reinicio de bucle
      }
      y.set(nextY);
      prevY.current = nextY;
    }
  });

  // Manejo de eventos táctiles para el carrusel horizontal en mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setIsDragging(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    prevX.current = x.get();
    prevY.current = y.get();
    touchVelocity.current = 0;
    touchPositions.current = [];
    touchTime.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !isDragging) return;
    e.preventDefault(); // Evitar desplazamiento de página
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;
    const currentTime = Date.now();
    
    // Solo permitir desplazamiento horizontal si el movimiento es mayor que el vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
      const nextX = prevX.current + diffX;
      x.set(nextX);
      
      // Registrar posición y tiempo para calcular velocidad
      touchPositions.current.push({ x: currentX, time: currentTime });
      
      // Mantener solo las últimas 5 posiciones para cálculo preciso
      if (touchPositions.current.length > 5) {
        touchPositions.current.shift();
      }
      
      // Calcular velocidad
      if (touchPositions.current.length > 1) {
        const firstPos = touchPositions.current[0];
        const lastPos = touchPositions.current[touchPositions.current.length - 1];
        const timeDiff = lastPos.time - firstPos.time;
        const distanceDiff = lastPos.x - firstPos.x;
        
        if (timeDiff > 0) {
          touchVelocity.current = distanceDiff / timeDiff; // px por ms
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile || !isDragging) return;
    setIsDragging(false);
    
    const container = carouselRef.current;
    const content = contentRef.current;
    if (!container || !content) return;
    
    const maxScroll = Math.max(0, content.scrollWidth - container.clientWidth);
    let currentX = x.get();
    
    // Aplicar efecto de inercia
    if (Math.abs(touchVelocity.current) > 0.1) {
      const inertiaStrength = 300; // Fuerza de inercia
      const decayFactor = 0.98; // Factor de desaceleración
      const duration = 1000; // Duración máxima de inercia (ms)
      const steps = 60; // Pasos de animación
      const stepDuration = duration / steps;
      
      let currentVelocity = touchVelocity.current * inertiaStrength;
      let step = 0;
      
      const applyInertia = () => {
        if (step >= steps || Math.abs(currentVelocity) < 1) return;
        
        currentX += currentVelocity;
        currentVelocity *= decayFactor;
        
        // Ajustar posición final para mantener el carrusel en límites
        if (currentX > 0) {
          currentX = 0;
        } else if (Math.abs(currentX) > maxScroll) {
          currentX = -maxScroll;
        }
        
        x.set(currentX);
        step++;
        
        setTimeout(() => {
          applyInertia();
        }, stepDuration);
      };
      
      applyInertia();
    } else {
      // Sin inercia, solo ajustar límites
      if (currentX > 0) {
        x.set(0);
      } else if (Math.abs(currentX) > maxScroll) {
        x.set(-maxScroll);
      }
    }
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100 gap-2">
        {["#d991c2", "#9869b8", "#6756cc"].map((color, index) => (
          <div
            key={index}
            className={`w-5 h-5 rounded-full animate-bounce`}
            style={{
              backgroundColor: color,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`w-full overflow-hidden relative ${isMobile ? 'h-[calc(100vh-12rem)]' : 'h-screen'}`} 
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => setIsDragging(false)}
    >
      <motion.div
        ref={contentRef}
        style={{ 
          y: isMobile ? 0 : y, 
          x: isMobile ? x : 0, 
          willChange: "transform" 
        }}
        className={`h-full flex gap-10 ${isMobile ? 'flex-row items-center' : 'flex-col'}`}
      >
        {images.map(({ src, alt }, index) => (
          <div key={index} className={`flex flex-grow justify-center items-center ${isMobile ? 'h-full min-w-[100vw]' : 'w-full'}`}>
            <img
              src={src}
              alt={alt}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              fetchPriority={index === 0 ? "high" : "auto"}
              className={`object-contain ${isMobile ? 'max-h-[90vh] max-w-full' : 'max-w-full max-h-[80vh]'}`}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default VerticalCarousel;
