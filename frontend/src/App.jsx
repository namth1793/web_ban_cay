import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ChamSoc from './pages/ChamSoc';
import ThongTin from './pages/ThongTin';
import ArticleDetail from './pages/ArticleDetail';
import LienHe from './pages/LienHe';
import Cart from './pages/Cart';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/san-pham" element={<Products />} />
              <Route path="/san-pham/:slug" element={<ProductDetail />} />
              <Route path="/cham-soc" element={<ChamSoc />} />
              <Route path="/thong-tin" element={<ThongTin />} />
              <Route path="/bai-viet/:slug" element={<ArticleDetail />} />
              <Route path="/lien-he" element={<LienHe />} />
              <Route path="/gio-hang" element={<Cart />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
