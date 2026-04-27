import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_SLIDES = [
  { id: 1, tag: 'Xương Rồng Mini', title: 'Xương Rồng Mini Dễ Thương', desc: 'Sen đá, cầu vàng, haworthia, lithops... hàng trăm loại xương rồng mini xinh xắn cho bàn làm việc và nội thất.', bg: 'from-primary-900 via-primary-800 to-teal-700', img: 'https://images.unsplash.com/photo-1530530488516-02af946f86fb?w=900&h=500&fit=crop&auto=format', link: '/san-pham?category=xuong-rong-mini', cta: 'Xem Xương Rồng Mini' },
  { id: 2, tag: 'Xương Rồng Decor', title: 'Điểm Nhấn Trang Trí Không Gian', desc: 'Cereus, Euphorbia, Agave, Yucca... Xương rồng kích thước lớn tạo điểm nhấn độc đáo cho phòng khách và sân vườn.', bg: 'from-emerald-900 via-green-800 to-teal-700', img: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=900&h=500&fit=crop&auto=format', link: '/san-pham?category=xuong-rong-decor', cta: 'Xem Xương Rồng Decor' },
  { id: 3, tag: 'Các Loại Cây Khác', title: 'Xanh Hóa Không Gian Sống', desc: 'Monstera, lan hồ điệp, bonsai, rau thơm... Đa dạng cây cảnh cho mọi không gian và nhu cầu trang trí.', bg: 'from-lime-900 via-green-800 to-emerald-700', img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=900&h=500&fit=crop&auto=format', link: '/san-pham?category=cay-khac', cta: 'Khám Phá Ngay' },
  { id: 4, tag: 'Quà Tặng Cây Xanh', title: 'Quà Tặng Ý Nghĩa & Độc Đáo', desc: 'Combo cây mini đóng gói đẹp, kèm thiệp và hướng dẫn chăm sóc. Thích hợp tặng sinh nhật, khai trương, tốt nghiệp.', bg: 'from-teal-900 via-green-800 to-primary-700', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&h=500&fit=crop&auto=format', link: '/san-pham?category=cay-khac', cta: 'Xem Quà Tặng' },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/banners')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data.map(b => ({
            id: b.id,
            tag: b.tag,
            title: b.title,
            desc: b.description,
            bg: b.bg_gradient,
            img: b.image,
            link: b.link,
            cta: b.cta_text,
          })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const s = slides[current];

  return (
    <div className="relative overflow-hidden h-[400px] md:h-[480px]">
      {slides.map((slide, i) => (
        <div key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-80 z-10`} />
          <img src={slide.img} alt={slide.title} className="w-full h-full object-cover" />
        </div>
      ))}

      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-xl">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-white/30">
              🌿 {s.tag}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-md">{s.title}</h1>
            <p className="text-white/85 text-base mb-7 leading-relaxed">{s.desc}</p>
            <div className="flex flex-wrap gap-3">
              <Link to={s.link} className="bg-primary-500 hover:bg-primary-400 text-white font-bold px-7 py-3 rounded-full transition-colors shadow-lg">
                {s.cta}
              </Link>
              <Link to="/san-pham" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-7 py-3 rounded-full transition-colors border border-white/40 backdrop-blur-sm">
                Tất Cả Sản Phẩm
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-3 bg-white' : 'w-3 h-3 bg-white/40 hover:bg-white/60'}`} />
        ))}
      </div>

      {/* Arrows */}
      <button onClick={() => setCurrent(c => (c - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors">
        ‹
      </button>
      <button onClick={() => setCurrent(c => (c + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors">
        ›
      </button>
    </div>
  );
}
