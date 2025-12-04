export default function Footer() {
  return (
    <footer className="bg-black text-[#3eb7a0] min-h-screen flex flex-col justify-end py-16 px-8 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* 主要内容区域 */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20 mb-14">
          {/* 左侧 Logo 区域 */}
          <div className="lg:w-1/4">
            <div className="mb-8">
              <h3 
                className="text-xl lg:text-7xl mb-3 leading-none tracking-tight" 
                style={{ fontFamily: 'impact, serif', fontWeight: '800', writingMode: 'horizontal-tb',letterSpacing: '5px' }}
              >
                MEMORY
              </h3>
            </div>
          </div>

          {/* 右侧导航和信息区域 */}
          <div className="flex-1 flex flex-col md:flex-row justify-between gap-12">
            {/* 导航链接 */}
            <nav className="flex-1">
              <h4 
                className="text-3xl mb-6 text-gray-0 uppercase tracking-wider" 
                style={{ fontFamily: 'impact, sans-serif', fontWeight: '600',letterSpacing: '2px'}}
              >
                Navigation
              </h4>
              <ul className="space-y-4 text-base">
                <li>
                  <a 
                    href="#hero" 
                    className="text-xl text-white hover:text-gray-300 transition-colors flex items-center gap-2 group" 
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  >
                    <span>Weaving Traces</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#memory-cards" 
                    className="text-xl text-white hover:text-gray-300 transition-colors flex items-center gap-2 group" 
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  >
                    <span>Threads Apart</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#remnant" 
                    className="text-xl text-white hover:text-gray-300 transition-colors flex items-center gap-2 group" 
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  >
                    <span>Remnant Traces</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#contact" 
                    className="text-xl text-white hover:text-gray-300 transition-colors flex items-center gap-2 group" 
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  >
                    <span>Share Story</span>
                  </a>
                </li>
              </ul>
            </nav>

            {/* 联系信息 */}
            <div className="flex-1">
              <h4 
                className="text-3xl mb-7 text-gray-0 uppercase tracking-wider" 
                style={{ fontFamily: 'impact, sans-serif', fontWeight: '600',letterSpacing: '2px' }}
              >
                CIONTACT
              </h4>
              <ul className="space-y-4 text-base">
                <li className="text-xl text-white" style={{ fontFamily: 'Arial, sans-serif' }}>
                  2324807@students<br className="hidden lg:block" />.ucreative.ac.uk
                </li>
                <li className="text-xl text-white" style={{ fontFamily: 'Arial, sans-serif' }}>
                  +86 180 460 65476
                </li>
              </ul>

              {/* 社交媒体图标 */}
              <div className="flex items-center gap-4 mt-8">
                <a 
                  href="#" 
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-gray-900 text-white transition-all duration-300"
                >
                  <i className="ri-twitter-x-fill text-lg"></i>
                </a>
                <a 
                  href="#" 
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-gray-900 text-white transition-all duration-300"
                >
                  <i className="ri-youtube-fill text-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 大标题区域 */}
        <div className="mb-10 lg:mb-16">
          <h2 
  className="text-5xl md:text-6xl lg:text-7xl text-white leading-none tracking-tight text-center lg:text-right" 
  style={{
    fontFamily: 'impact, serif',
    fontWeight: '500',
    letterSpacing: '0.04em',
    // 添加 line-height 来精确控制行间距
    lineHeight: '1.3' // 使用一个略大于 1 的无单位值，通常效果最好
    // 或者使用百分比：lineHeight: '110%'
  }}
>
  TAKE THE <span className=" font-normal">LEAP</span>
  <br />
  WITH US!
</h2>
        </div>

        {/* 分隔线 */}
        <hr className="border-gray-0 mb-8" />

        {/* 底部版权信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p 
            className="text-m text-gray-0" 
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            Made by JIANG YITING
          </p>
          <a 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-m text-gray-0 hover:text-white transition-colors"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            © 2025 WEB EMBEER. All rights reserved.
          </a>
        </div>
      </div>
    </footer>
  );
}
