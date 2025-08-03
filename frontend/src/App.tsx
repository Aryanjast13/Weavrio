import { Route, BrowserRouter as Router, Routes } from "react-router";
import { Toaster } from "sonner";
import AdminLayout from "./components/Layout/AdminLayout";
import UserLayout from "./components/Layout/UserLayout";
import Checkout from "./components/Product/Checkout";
import ProductDetails from "./components/Product/ProductDetails";
import { CollectionPage } from "./pages/CollectionPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetailPage from "./pages/OrderDetailPage";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
          {/* User layout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="collections/:collection" element={<CollectionPage />} />
          <Route path="product/:product" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="order/:id" element={<OrderDetailPage />} />  
          <Route path= "my-orders" element={<MyOrdersPage/>}/>
        </Route>

        {/* Admin layout */}

        <Route path="/admin" element={<AdminLayout />}>
        
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
