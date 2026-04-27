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
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminArticles from './pages/admin/AdminArticles';
import AdminOrders from './pages/admin/AdminOrders';
import AdminContacts from './pages/admin/AdminContacts';
import AdminBanner from './pages/admin/AdminBanner';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Admin routes — no Navbar/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="banners" element={<AdminBanner />} />
          </Route>

          {/* Public site */}
          <Route path="/*" element={
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
          } />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
