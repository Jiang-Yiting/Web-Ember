import { useEffect, useState, useRef } from 'react';
import HeroSection from './components/HeroSection';
import MemoryCards from './components/MemoryCards';
import RemnantSection from './components/RemnantSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LoadingScreen from '../../components/LoadingScreen';
import MouseFollower from '../../components/MouseFollower';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isScrollingRef = useRef(false);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // 计算当前在哪个section
      const sections = sectionsRef.current;
      let current = 0;
      sections.forEach((section, index) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = index;
          }
        }
      });
      setCurrentSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionIndex: number) => {
    if (isScrollingRef.current) return;
    
    isScrollingRef.current = true;
    setCurrentSection(sectionIndex);

    const section = sectionsRef.current[sectionIndex];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className="relative bg-white">
      <MouseFollower />
      
      {/* 滚动进度条 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-[100]">
        <div 
          className="h-full bg-gray-900 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div ref={(el) => el && (sectionsRef.current[0] = el)}>
        <HeroSection />
      </div>
      <div ref={(el) => el && (sectionsRef.current[1] = el)}>
        <MemoryCards />
      </div>
      <div ref={(el) => el && (sectionsRef.current[2] = el)}>
        <RemnantSection />
      </div>
      <div ref={(el) => el && (sectionsRef.current[3] = el)}>
        <ContactSection />
      </div>
      <div ref={(el) => el && (sectionsRef.current[4] = el)}>
        <Footer />
      </div>

      {/* 导航点 - 改为圆角方形 */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-sm transition-all duration-300 cursor-pointer ${
              currentSection === index 
                ? 'bg-gray-900 scale-125' 
                : 'bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>
    </main>
  );
}
