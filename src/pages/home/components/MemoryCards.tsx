import { useState, useEffect } from 'react';

interface Card {
  id: number;
  title: string;
  description: string;
  image: string;
}

const cards: Card[] = [
  {
    id: 1,
    title: 'Boundless',
    description: 'Memories stretch beyond the horizon, infinite and eternal, weaving through time and space.',
    image: 'image/1.jpg'
  },
  {
    id: 2,
    title: 'Infinite',
    description: 'Each fragment holds a universe of emotions, endless stories waiting to be discovered.',
    image: 'image/2.jpg'
  },
  {
    id: 3,
    title: 'Endless',
    description: 'Time flows like water, carrying whispers of the past into the endless future.',
    image: 'image/3.jpg'
  },
  {
    id: 4,
    title: 'Eternal',
    description: 'In the silence between moments, eternal truths echo through the corridors of memory.',
    image: 'image/4.jpg'
  },
  {
    id: 5,
    title: 'Timeless',
    description: 'Beyond the constraints of time, memories exist in a realm where past and future merge.',
    image: 'image/5.jpg'
  },
  {
    id: 6,
    title: 'Perpetual',
    description: 'Cycles repeat endlessly, each iteration a new chapter in an ancient story.',
    image: 'image/6.jpg'
  },
  {
    id: 7,
    title: 'Immutable',
    description: 'Some truths remain unchanged, standing firm against the tides of time.',
    image: 'image/7.jpg'
  },
  {
    id: 8,
    title: 'Everlasting',
    description: 'Love and memories intertwine, creating bonds that transcend mortality.',
    image: 'image/8.jpg'
  },
  {
    id: 9,
    title: 'Unending',
    description: 'The journey continues without destination, each step a moment of discovery.',
    image: 'image/9.jpg'
  }
];

export default function MemoryCards() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('memory-cards');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('memory-cards');
      if (section) {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        // 计算section在视口中的进度
        const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCardClick = (cardId: number) => {
    setSelectedCard(cardId);
  };

  const handleBackdropClick = () => {
    setSelectedCard(null);
  };

  return (
    <section 
      id="memory-cards" 
      className="relative min-h-screen flex flex-col items-center justify-center bg-white py-32 overflow-hidden"
    >
      {/* 标题区域 - 带渐显动画 */}
      <div 
        className="w-full max-w-7xl mx-auto px-16 mb-20 transition-all duration-1000"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? 0 : 60}px)`
        }}
      >
        <h2 
          className="text-7xl text-gray-900 mb-6"
          style={{ 
            fontFamily: 'impact, serif',
            fontWeight: 'bold',
            letterSpacing: '0.02em'
          }}
        >
          THREADS APART
        </h2>
        <p 
          className="text-xl text-gray-600 max-w-2xl"
          style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.8' }}
        >
          Those intricate connections keep surfacing in my mind.
        </p>
      </div>

      {/* 卡片展示区域 */}
      <div className="relative w-full max-w-7xl mx-auto px-16 flex items-center justify-center">
        <div className="relative flex items-center justify-center" style={{ width: '700px', height: '300px' }}>
          {cards.map((card, index) => {
            const isSelected = selectedCard === card.id;
            const isHovered = hoveredCard === card.id;
            const totalCards = cards.length;
            const centerIndex = Math.floor(totalCards / 2);
            
            const offsetX = (index - centerIndex) * 90;
            const rotation = (index - centerIndex) * 2;
            const zIndex = isSelected ? 100 : totalCards - Math.abs(index - centerIndex);

            // 添加滚动进度动画
            const cardProgress = Math.max(0, Math.min(1, (scrollProgress - index * 0.05) * 2));

            return (
              <div
                key={card.id}
                className={`absolute transition-all duration-700 ease-out ${
                  isSelected ? 'cursor-default' : 'cursor-pointer'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: isSelected
                    ? 'translate(-50%, -50%) scale(1.8) rotate(0deg)'
                    : isVisible
                    ? `translate(calc(-50% + ${offsetX}px), -50%) scale(${isHovered ? 1.05 : 1}) rotate(${isHovered ? 0 : rotation}deg) translateY(${isHovered ? -20 : 0}px)`
                    : 'translate(-50%, -50%) scale(0.8) rotate(0deg) translateY(100px)',
                  opacity: isSelected ? 1 : selectedCard ? 0 : isVisible ? cardProgress : 0,
                  zIndex: zIndex,
                  pointerEvents: selectedCard && !isSelected ? 'none' : 'auto',
                  filter: selectedCard && !isSelected ? 'blur(8px)' : 'none',
                  transition: `all ${isVisible ? '0.7s' : '1s'} cubic-bezier(0.4, 0, 0.2, 1)`,
                  transitionDelay: isVisible ? `${index * 80}ms` : '0ms',
                }}
                onClick={() => !isSelected && handleCardClick(card.id)}
                onMouseEnter={() => !selectedCard && setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className="relative bg-black rounded-2xl overflow-hidden"
                  style={{
                    width: isSelected ? '600px' : '500px',
                    height: isSelected ? '400px' : '333px',
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isHovered && !isSelected
                      ? '0 40px 80px -20px rgba(0, 0, 0, 0.5), 0 20px 40px -20px rgba(0, 0, 0, 0.4)'
                      : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 12px 24px -12px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    
                    <div className={`absolute ${isSelected ? 'bottom-20 left-10 right-10' : 'bottom-8 left-10 right-10'} text-[#3eb7a0] transition-all duration-700`}>
                      <h3 
                        className={`mb-2 transition-all duration-700 ${isSelected ? 'text-5xl' : 'text-3xl'}`}
                        style={{ 
                          fontFamily: 'impact, serif',
                          fontWeight: 'bold',
                          letterSpacing: '0.04em' 
                        }}
                      >
                        {card.title}
                      </h3>
                      <p 
                        className={`leading-relaxed transition-all duration-700 ${isSelected ? 'text-sm opacity-100' : 'text-sm opacity-0'}`}
                        style={{ 
                          fontFamily: 'Arial, sans-serif',
                          maxHeight: isSelected ? '200px' : '0',
                          overflow: 'hidden'
                        }}
                      >
                        {card.description}
                      </p>
                    </div>

                    {isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBackdropClick();
                        }}
                        className="absolute top-2 right-2 w-14 h-14 flex items-center justify-center : rounded-xl transition-all duration-300 cursor-pointer"
                        aria-label="Close"
                      >
                        <i className="ri-close-line text-xl text-gray-900"></i>
                      </button>
                    )}

                    {!isSelected && (
                      <div 
                        className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-xl text-black text-base"
                        style={{ fontFamily: 'impact, serif', fontWeight: 'bold' }}
                      >
                        {index + 1}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] transition-opacity duration-700"
          onClick={handleBackdropClick}
        />
      )}

      {!selectedCard && isVisible && (
        <div 
          className="w-full max-w-7xl mx-auto px-16 mt-20 text-center transition-all duration-1000"
          style={{ 
            opacity: isVisible ? 1 : 0,
            transitionDelay: '1200ms'
          }}
        >
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Arial, sans-serif' }}>
            Tap any card to explore more
          </p>
        </div>
      )}
    </section>
  );
}
