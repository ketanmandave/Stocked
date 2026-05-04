import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext.jsx";
import AllProducts from "./pages/AllProducts.jsx";
import ProductCategory from "./pages/ProductCategory.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import AddAddress from "./pages/AddAddress.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import SellerLogin from "./components/seller/SellerLogin.jsx";
import Contact from "./components/Contact.jsx";
import RefundPolicy from "./components/RefundPolicy.jsx";
import Terms from "./components/Terms.jsx";
import About from "./components/About.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import SellerLayout from "./pages/seller/SellerLayout.jsx";
import ProductList from "./pages/seller/ProductList.jsx";
import AddProduct from "./pages/seller/AddProduct.jsx";
import Orders from "./pages/seller/Orders.jsx";
import SellerAnalytics from "./pages/seller/SellerAnalytics.jsx";
import UpcomingDeliveries from "./pages/seller/UpcomingDeliveries.jsx";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  // to find user page or seller page
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
       <ScrollToTop />
      {/* navbar should see only users not seller */}
      {!isSellerPath && <Navbar />}
      {/* routes */}
      <Toaster/>
      {/* this padding not apply to seller dashboard  */}
      <div className={isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}>  
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/products/:category" element={<ProductCategory />} />
            <Route path="/products/:category/:id" element={<ProductDetails />} />
            <Route path="/add-address" element={<AddAddress />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/seller" element={ isSeller ? <SellerLayout /> : <SellerLogin />}>
              {/* seller path are here */}
              <Route index element={isSeller ? <AddProduct /> : null} />
              <Route path="product-list" element={<ProductList />} />
              <Route path="orders" element={<Orders />} />
              <Route path="analytics" element={<SellerAnalytics />} />
              <Route path="upcoming-deliveries" element={<UpcomingDeliveries />} />
            </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
