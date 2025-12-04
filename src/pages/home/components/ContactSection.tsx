import { useState, useEffect } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    story: ''
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('contact');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for sharing your story');
    setFormData({ name: '', email: '', story: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section 
      id="contact"
      className="min-h-screen py-24 px-8 bg-white flex flex-col justify-center"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* 大标题区域 */}
        <div 
          className="text-center mb-20 lg:mb-28 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 60}px)`
          }}
        >
          <h2 
            className="text-6xl md:text-7xl lg:text-8xl mb-0 text-gray-900 leading-none tracking-tight" 
            style={{ 
              fontFamily: 'impact, serif', 
              fontWeight: '500',
              letterSpacing: '0.04em'
            }}
          >
            SHARE YOUR <span className="font-normal">STORY</span>
          </h2>
        </div>

        {/* 卡片网格布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* 卡片1 - 联系表单 */}
          <div 
            className="relative block w-full rounded-2xl border-2 border-[#3eb7a0] p-8 transition-all duration-300 hover:shadow-[0_0_0_2px_#3eb7a0]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateY(${isVisible ? 0 : 60}px)`,
              transitionDelay: '100ms'
            }}
          >
            <span className="text-lg text-gray-600 mb-3 block" style={{ fontFamily: 'Arial, sans-serif' }}>
              Contact
            </span>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2 " style={{ fontFamily: 'impact, serif', letterSpacing: '1px'}}>
              GET IN TOUCH
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
              Share your emotional story and let time witness your experiences. Everyone has memories worth cherishing.
            </p>
            <div className="absolute right-4 top-4">
              <div className="relative w-11 h-11 rounded-full bg-[#3eb7a0] flex items-center justify-center">
                <i className="ri-mail-line text-white text-xl"></i>
              </div>
            </div>
          </div>

          {/* 卡片2 - 邮箱 */}
          <div 
            className="relative block w-full rounded-2xl border-2 border-[#3eb7a0] p-8 transition-all duration-300 hover:shadow-[0_0_0_2px_#3eb7a0]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateY(${isVisible ? 0 : 60}px)`,
              transitionDelay: '200ms'
            }}
          >
            <span className="text-lg text-gray-600 mb-3 block" style={{ fontFamily: 'Arial, sans-serif' }}>
              Email
            </span>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2 letterSpacing: '5px'" style={{ fontFamily: 'impact, serif', letterSpacing: '1px' }}>
              SEND MESSAGE
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed break-all" style={{ fontFamily: 'Arial, sans-serif' }}>
              2324807@students.ucreative.ac.uk
            </p>
            <div className="absolute right-4 top-4">
              <div className="relative w-11 h-11 rounded-full bg-[#3eb7a0] flex items-center justify-center">
                <i className="ri-send-plane-fill text-white text-xl"></i>
              </div>
            </div>
          </div>

          {/* 卡片3 - 社交媒体 */}
          <div 
            className="relative block w-full rounded-2xl border-2 border-[#3eb7a0] p-8 transition-all duration-300 hover:shadow-[0_0_0_2px_#3eb7a0]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateY(${isVisible ? 0 : 60}px)`,
              transitionDelay: '300ms'
            }}
          >
            <span className="text-lg text-gray-600 mb-3 block" style={{ fontFamily: 'Arial, sans-serif' }}>
              Follow Us
            </span>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2 " style={{ fontFamily: 'impact, serif', letterSpacing: '1px'}}>
              SOCIAL MEDIA
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
              Connect with us on social platforms and stay updated with our latest stories.
            </p>
            <div className="absolute right-4 top-4">
              <div className="relative w-11 h-11 rounded-full bg-[#3eb7a0] flex items-center justify-center">
                <i className="ri-share-line text-white text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* 表单区域 */}
        <form 
          onSubmit={handleSubmit} 
          className="mt-12 lg:mt-16 bg-[#3eb7a0] rounded-2xl p-8 lg:p-12 transition-all duration-1000 border border-gray-200"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 60}px)`,
            transitionDelay: '400ms'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-xl mb-2 text-black" 
                style={{ fontFamily: 'impact, sans-serif', fontWeight: '600',letterSpacing: '0.05em' }}
              >
                NAME
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-gray-900 text-base transition-all duration-300 bg-white"
                style={{ fontFamily: 'Arial, sans-serif' }}
                placeholder="Please enter your name"
              />
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="block text-xl mb-2 text-black" 
                style={{ fontFamily: 'impact, sans-serif', fontWeight: '600',letterSpacing: '0.05em' }}
              >
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-gray-900 text-base transition-all duration-300 bg-white"
                style={{ fontFamily: 'Arial, sans-serif' }}
                placeholder="Please enter your email"
              />
            </div>
          </div>

          <div className="mb-6">
            <label 
              htmlFor="story" 
              className="block text-xl mb-2 text-black" 
              style={{ fontFamily: 'impact, sans-serif', fontWeight: '600',letterSpacing: '0.05em' }}
            >
              YOUR STORY
            </label>
            <textarea
              id="story"
              name="story"
              value={formData.story}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-gray-900 resize-none text-base transition-all duration-300 bg-white"
              style={{ fontFamily: 'Arial, sans-serif' }}
              placeholder="Share your emotional story, those memories worth cherishing..."
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-12 py-4 bg-black text-white text-xl rounded-lg hover:bg- transition-all duration-300 text-base cursor-pointer whitespace-nowrap hover:scale-[1.02]"
            style={{ fontFamily: 'impact, sans-serif', fontWeight: '700',letterSpacing: '1px'}}
          >
            SUBMIT STORY
          </button>
        </form>
      </div>
    </section>
  );
}
