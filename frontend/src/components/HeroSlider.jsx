import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    tag: 'Cây Cảnh Trong Nhà',
    title: 'Xanh Hóa Không Gian Sống',
    desc: 'Hàng trăm loại cây cảnh trong nhà: Monstera, Pothos, Lan, Bonsai... Giao hàng toàn quốc, đóng gói an toàn.',
    bg: 'from-primary-900 via-primary-800 to-teal-700',
    img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=900&h=500&fit=crop&auto=format',
    link: '/san-pham?category=cay-canh-trong-nha',
    cta: 'Khám Phá Ngay',
  },
  {
    id: 2,
    tag: 'Hoa Lan & Cây Ra Hoa',
    title: 'Sắc Màu Cho Mọi Không Gian',
    desc: 'Lan hồ điệp, hoa hồng mini, cẩm tú cầu, lavender... Quà tặng cao cấp cho mọi dịp đặc biệt.',
    bg: 'from-pink-900 via-rose-800 to-purple-700',
    img: 'https://images.unsplash.com/photo-1566138163-be36ebe8c1f9?w=900&h=500&fit=crop&auto=format',
    link: '/san-pham?category=cay-hoa-ra-hoa',
    cta: 'Xem Hoa Lan',
  },
  {
    id: 3,
    tag: 'Bonsai & Tiểu Cảnh',
    title: 'Nghệ Thuật Trong Tầm Tay',
    desc: 'Bonsai nghệ thuật, terrarium thủy tinh, tiểu cảnh đá... Trang trí nội thất sang trọng và độc đáo.',
    bg: 'from-emerald-900 via-green-800 to-lime-700',
    img: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=900&h=500&fit=crop&auto=format',
    link: '/san-pham?category=cay-bonsai-tieu-canh',
    cta: 'Xem Bonsai',
  },
  {
    id: 4,
    tag: 'Rau Sạch Tại Nhà',
    title: 'Vườn Rau Sạch Trên Ban Công',
    desc: 'Rau thơm, thảo mộc, lô hội, sả... Tự trồng rau sạch hữu cơ ngay tại nhà, đảm bảo an toàn cho gia đình.',
    bg: 'from-lime-900 via-green-800 to-teal-700',
    img: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=900&h=500&fit=crop&auto=format',
    link: '/san-pham?category=cay-thao-moc-rau-sach',
    cta: 'Trồng Rau Sạch',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

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
