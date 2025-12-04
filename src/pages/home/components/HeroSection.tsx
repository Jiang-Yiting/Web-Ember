import { useEffect, useState, useRef } from 'react';

export default function HeroSection() {
  const [showContent, setShowContent] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showWechatQR, setShowWechatQR] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';
    script.async = true;
    script.onload = () => {
      initP5Sketch();
    };
    document.body.appendChild(script);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initP5Sketch = () => {
    if (!window.p5 || !canvasContainerRef.current) return;

    const sketch = (p: any) => {
      let blocks: any[] = [];
      let introPhase = 0; // 0: 全黑, 1: 掉落中, 2: 完成
      let introTimer = 0;
      const INTRO_DURATION = {
        BLACK_SCREEN: 60, // 2秒全黑
        COMPLETE: 660 // 11秒完成（2秒黑屏 + 9秒掉落）
      };

      class Block {
        x: number;
        y: number;
        width: number;
        height: number;
        targetY: number;
        speed: number;
        rotation: number;
        rotationSpeed: number;
        opacity: number;
        isBottomBlock: boolean;
        cutAngle: number; // 切割角度

        constructor(x: number, y: number, width: number, height: number, isBottomBlock: boolean = false) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.targetY = p.height + 200;
          this.speed = 0;
          this.rotation = 0;
          this.rotationSpeed = p.random(-0.02, 0.02);
          this.opacity = 255;
          this.isBottomBlock = isBottomBlock;
          this.cutAngle = p.random(10, 5); // 随机斜切角度
          
          if (isBottomBlock) {
            // 底部方块停在屏幕边缘被切一半
            this.targetY = p.height + height / 3;
          }
        }

        updateFall() {
          if (this.isBottomBlock) {
            // 底部方块缓慢下落到被切的位置
            const distance = this.targetY - this.y;
            if (Math.abs(distance) > 1) {
              this.y += distance * 0.06;
            } else {
              this.y = this.targetY;
            }
          } else {
            // 其他方块加速掉落
            this.speed += 0.4;
            this.y += this.speed;
            this.rotation += this.rotationSpeed;
            
            // 掉出屏幕后淡出
            if (this.y > p.height + 100) {
              this.opacity -= 8;
            }
          }
        }

        display() {
          p.push();
          p.translate(this.x, this.y);
          p.rotate(this.rotation);
          p.noStroke();
          p.fill(62,183,160, this.opacity);
          p.rectMode(p.CENTER);
          
          if (this.isBottomBlock && this.y > p.height - this.height / 2) {
            // 绘制被斜切的方块
            p.push();
            
            // 计算斜切后的可见区域
            const cutY = p.height - this.y + this.height / 2;
            const angleRad = p.radians(this.cutAngle);
            
            // 使用 beginShape 绘制斜切的多边形
            p.beginShape();
            
            // 计算四个顶点，考虑斜切角度
            const leftOffset = Math.tan(angleRad) * cutY;
            const rightOffset = Math.tan(angleRad) * cutY;
            
            // 上边两个顶点
            p.vertex(-this.width / 2, -this.height / 2);
            p.vertex(this.width / 2, -this.height / 2);
            
            // 下边两个顶点（斜切）
            p.vertex(this.width / 2, -this.height / 2 + cutY + rightOffset);
            p.vertex(-this.width / 2, -this.height / 2 + cutY + leftOffset);
            
            p.endShape(p.CLOSE);
            p.pop();
          } else {
            p.rect(0, 0, this.width, this.height, 4);
          }
          
          p.pop();
        }

        isDead() {
          return this.opacity <= 0;
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(canvasContainerRef.current);
        p.frameRate(60);
        
        // 创建初始不规则方块网格
        createInitialBlocks();
      };

      const createInitialBlocks = () => {
        blocks = [];
        const minBlockSize = 500;
        const maxBlockSize = 700;
        
        let currentY = 0;
        let allBlocks: any[] = [];
        
        // 随机生成不规则长方块填满屏幕（长>宽）
        while (currentY < p.height) {
          let currentX = 0;
          const rowHeight = p.random(minBlockSize, maxBlockSize);
          
          while (currentX < p.width) {
            // 确保长>宽，高度是宽度的1.2-2倍
            const blockWidth = p.random(minBlockSize * 0.5, maxBlockSize * 0.7);
            const blockHeight = blockWidth * p.random(1.2, 2);
            
            const x = currentX + blockWidth / 2;
            const y = currentY + blockHeight / 2;
            
            const block = new Block(x, y, blockWidth, blockHeight, false);
            blocks.push(block);
            allBlocks.push(block);
            
            currentX += blockWidth;
          }
          
          currentY += rowHeight;
        }
        
        // 随机选择3-4块作为最终留下的方块（被斜切一半）
        if (allBlocks.length >= 3) {
          const numBottomBlocks = Math.floor(p.random(3, 5));
          const shuffled = allBlocks.sort(() => Math.random() - 0.5);
          for (let i = 0; i < numBottomBlocks && i < shuffled.length; i++) {
            shuffled[i].isBottomBlock = true;
            shuffled[i].cutAngle = p.random(25, 45) * (Math.random() > 0.5 ? 1 : -1); // 随机25°到45°，正负随机
          }
        }
      };

      p.draw = () => {
        p.clear(); // 使用 clear() 替代 background() 来保持透明
        
        introTimer++;

        // 阶段0: 全黑屏幕
        if (introTimer < INTRO_DURATION.BLACK_SCREEN) {
          p.background(62,183,160);
          introPhase = 0;
        }
        // 阶段1: 掉落
        else if (introTimer < INTRO_DURATION.COMPLETE) {
          blocks.forEach(block => {
            block.updateFall();
            block.display();
          });
          
          // 移除已消失的方块
          blocks = blocks.filter(block => !block.isDead());
          
          introPhase = 1;
        }
        // 阶段2: 完成
        else {
          // 只显示底部被切的方块
          blocks.forEach(block => {
            if (block.isBottomBlock) {
              block.display();
            }
          });
          
          if (introPhase !== 2) {
            introPhase = 2;
            setIntroComplete(true);
            setHasInteracted(true);
            setShowContent(true);
          }
        }
      };

      p.mousePressed = () => {
        // 开场动画完成后才能交互
        if (introPhase === 2) {
          // 在鼠标位置生成小方块爆炸效果
          for (let i = 0; i < 12; i++) {
            const angle = p.random(p.TWO_PI);
            const force = p.random(3, 8);
            const size = p.random(15, 30);
            
            const newBlock = new Block(p.mouseX, p.mouseY, size, size);
            newBlock.speed = p.sin(angle) * force - 5;
            newBlock.x += p.cos(angle) * force;
            
            blocks.push(newBlock);
          }
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        if (introPhase === 0) {
          createInitialBlocks();
        }
      };
    };

    p5InstanceRef.current = new (window as any).p5(sketch);
  };

  const opacity = Math.max(0, 1 - scrollY / 800);
  const scale = Math.max(0.95, 1 - scrollY / 2000);
  const isHeroVisible = scrollY < 300;

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openReadyAgent = () => {
    const widgetButton = document.querySelector('#vapi-widget-floating-button') as HTMLElement;
    if (widgetButton) {
      widgetButton.click();
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
      <audio
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"
      />

      {/* P5.js Canvas Container - 在最上层 */}
      <div 
        ref={canvasContainerRef} 
        className="absolute inset-0 z-30 transition-all duration-300"
        style={{ 
          opacity: introComplete ? opacity : 1,
          transform: introComplete ? `scale(${scale})` : 'scale(1)',
          pointerEvents: introComplete ? 'none' : 'auto'
        }}
      />

      {/* 顶部导航栏 - 在动画下面 */}
      <div 
        className={`fixed top-0 left-0 right-0 z-20 transition-all duration-500 ${
          scrollY > 50 ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          {/* 左侧 Logo - 绿色 */}
          <button
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    /* 颜色修改：
     * 1. 默认颜色：text-[#3EB7A0] (对应 RGB 62, 183, 160)
     * 2. 悬停颜色：hover:text-[#329682] (稍微深一点的颜色，提供视觉反馈)
     * 原本的 text-black 和 hover:text-gray-700 已被替换
     */
    className="text-2xl text-[#3EB7A0] hover:text-[#329682] transition-colors cursor-pointer whitespace-nowrap"
    style={{ fontFamily: 'impact, serif', fontWeight: 'bold', letterSpacing: '0.05em' }}
>
            WEB EMBER
          </button>
          {/* 中间导航菜单 - 黑色 */}
          <nav className="flex items-center gap-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm text-black hover:text-[#3eb7a0] transition-colors cursor-pointer whitespace-nowrap"
              style={{ fontFamily: 'Arial, sans-serif', fontWeight: '500' }}
            >
              Weaving Traces
            </button>
            <button
              onClick={() => hasInteracted && scrollToSection('memory-cards')}
              className={`text-sm transition-colors cursor-pointer whitespace-nowrap ${
                hasInteracted ? 'text-black hover:text-[#3eb7a0]' : 'text-gray-400 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Arial, sans-serif', fontWeight: '500' }}
              disabled={!hasInteracted}
            >
              Threads Apart
            </button>
            <button
              onClick={() => hasInteracted && scrollToSection('remnant')}
              className={`text-sm transition-colors cursor-pointer whitespace-nowrap ${
                hasInteracted ? 'text-black hover:text-[#3eb7a0]' : 'text-gray-400 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Arial, sans-serif', fontWeight: '500' }}
              disabled={!hasInteracted}
            >
              Remnant Traces
            </button>
            <button
              onClick={() => hasInteracted && scrollToSection('contact')}
              className={`text-sm transition-colors cursor-pointer whitespace-nowrap ${
                hasInteracted ? 'text-black hover:text-[#3eb7a0]' : 'text-gray-400 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Arial, sans-serif', fontWeight: '500' }}
              disabled={!hasInteracted}
            >
              Share Your Story
            </button>
            
          </nav>

          {/* 右侧社交媒体和音乐控制 - 黑色图标 */}
          <div className="flex items-center gap-5">
            <button
              onClick={toggleMusic}
              className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer"
              aria-label="Music Control"
            >
              {isPlaying ? (
                <i className="ri-pause-circle-line text-3xl text-black"></i>
              ) : (
                <i className="ri-play-circle-line text-3xl text-black"></i>
              )}
            </button>
            <button
              onClick={() => window.open('https://xhslink.com/m/AWTvdHPGoOB', '_blank')}
              className="w-12 h-12 flex items-center justify-center rounded-lg overflow-hidden hover:scale-110 transition-all duration-300 cursor-pointer bg-black"
              aria-label="小红书"
            >
              <img
                src="image/Rednote.jpg"
                alt="小红书"
                className="w-11 h-8"
              />
            </button>
            
            <button
              onClick={() => setShowWechatQR(true)}
              className="w-12 h-12 flex items-center justify-center rounded-lg overflow-hidden hover:scale-110 transition-all duration-300 cursor-pointer bg-black"
              aria-label="微信"
            >
              <img
                src="image/Wechat.jpg"
                alt="微信"
                className="w-10 h-8 object-cover"
              />
            </button>

            <button
              onClick={openReadyAgent}
              className="w-12 h-12 flex items-center justify-center bg-black hover:bg-gray-800 text-white rounded-lg transition-all duration-300 cursor-pointer bg-black"
              aria-label="AI助手"
            >
              <i className="ri-message-3-line text-3xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 底部大标题和描述 - 在动画下面 */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-20 pb-16 px-8 transition-all duration-500"
        style={{ 
          opacity: isHeroVisible ? 1 : 0,
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      >
        {/* 描述文字 - 黑色 */}
        <div className="max-w-4xl mx-auto space-y-3 text-black text-center mb-4">
          <p className="text-base leading-relaxed" style={{ fontFamily: 'Arial, sans-serif' }}>
            有些离开,是一张网的缓慢崩解。那些层层交织的关联, 拉拉扯扯, 不情愿地渐远。时间不可逆, 记忆终成蛛丝般的残痕。
          </p>
          <p className="text-sm leading-relaxed text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
            Some departures are the slow unraveling of a web. Those intricately woven connections drift apart, reluctant, tangled in hesitation.
          </p>
        </div>

        {/* 大标题 - 黑色 */}
        <h1 
          className="text-[19vw] leading-none text-black text-center whitespace-nowrap mt-4" 
          style={{ 
            fontFamily: 'impact, bold', 
            fontWeight: '1800',
            letterSpacing: '0.02em'
          }}
        >
          WEB EMBER
        </h1>

        {/* 滚动提示 - 黑色 */}
        <div className="text-center mt-6 animate-bounce">
          <p className="text-2xl text-[#3EB7A0] hover:text-[#329682] transition-colors mb-0" style={{ fontFamily: 'Arial, sans-serif' }}>
            GO
          </p>
          <i className="ri-arrow-down-line text-2xl text-[#3EB7A0] hover:text-[#329682] transition-colors"></i>
        </div>
      </div>

      {/* 微信二维码弹窗 */}
      {showWechatQR && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowWechatQR(false)}
        >
          <div
            className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWechatQR(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 cursor-pointer"
              aria-label="关闭"
            >
              <i className="ri-close-line text-xl text-gray-700"></i>
            </button>

            <div className="text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-black rounded-lg mx-auto mb-4">
                <i className="ri-wechat-line text-2xl text-white"></i>
              </div>
              
              <h3 className="text-2xl mb-2 text-gray-900" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                添加微信
              </h3>
              
              <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
                扫描二维码添加我的微信
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <img
                  src="https://static.readdy.ai/image/bc643c8b59bbabdae08d70c4ecbda03c/af9b3688c51a424ccdd8a3d136e16736.jpeg"
                  alt="微信二维码"
                  className="w-full h-auto rounded-lg"
                />
              </div>

              <p className="text-xs text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>
                使用微信扫一扫功能扫描二维码
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
