import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-opacity duration-700 ${
        isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        {/* 时钟容器 */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* 时钟外圈 */}
          <div className="absolute inset-0 border-2 border-black rounded-full"></div>
          
          {/* 时钟中心点 */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 z-10"></div>
          
          {/* 时针 */}
          <div 
            className="absolute top-1/2 left-1/2 w-1 h-8 bg-black origin-bottom -translate-x-1/2"
            style={{
              animation: 'rotate-hour 4s linear infinite',
              transformOrigin: 'center bottom'
            }}
          ></div>
          
          {/* 分针 */}
          <div 
            className="absolute top-1/2 left-1/2 w-0.5 h-10 bg-black origin-bottom -translate-x-1/2"
            style={{
              animation: 'rotate-minute 2s linear infinite',
              transformOrigin: 'center bottom'
            }}
          ></div>
          
          {/* 跳动的小人图片 */}
          <div 
            className="absolute -top-16 left-1/2 -translate-x-1/2"
            style={{
              animation: 'jump 0.8s ease-in-out infinite'
            }}
          >
            <img 
              src="https://static.readdy.ai/image/bc643c8b59bbabdae08d70c4ecbda03c/ddc09f4c2b5573fd8641da5a8b03f0d5.png"
              alt="Loading character"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>

        {/* Loading 文字 */}
        <div 
          className="text-black text-2xl tracking-wider"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          Loading......
        </div>
      </div>
    </div>
  );
}
