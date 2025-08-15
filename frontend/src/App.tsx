import { Route, BrowserRouter as Router, Routes } from "react-router";
import { Toaster } from "sonner";
import EditProduct from "./components/Admin/EditProduct";
import OrderManagment from "./components/Admin/OrderManagment";
import ProductManagment from "./components/Admin/ProductManagment";
import UserManagment from "./components/Admin/UserManagment";
import AdminLayout from "./components/Layout/AdminLayout";
import UserLayout from "./components/Layout/UserLayout";
import Checkout from "./components/Product/Checkout";
import ProductDetails from "./components/Product/ProductDetails";
import AdminHomePage from "./pages/AdminHomePage";
import { CollectionPage } from "./pages/CollectionPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetailPage from "./pages/OrderDetailPage";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

import { Provider } from "react-redux";
import ProtectedProfile from "./components/Layout/ProtectedProfile";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import store from "./redux/store";
import NotFound from "./components/Layout/NotFound";
import ErrorBoundary from "./components/Layout/ErrorBoundary";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* User layout */}
          
            <Route path="/" element={<UserLayout />} errorElement={<ErrorBoundary/>}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route
                path="collections/:collection"
                element={<CollectionPage />}
              />
              <Route path="product/:id" element={<ProductDetails />} />

              <Route element={<ProtectedProfile />}>
                <Route path="profile" element={<Profile />} />
                <Route path="checkout" element={<Checkout />} />
                <Route
                  path="order-confirmation"
                  element={<OrderConfirmation />}
                />
                <Route path="order/:id" element={<OrderDetailPage />} />
                <Route path="my-orders" element={<MyOrdersPage />} />
              </Route>
            </Route>

            {/* Admin layout */}
            <Route path="/admin" element={<ProtectedRoute role="admin" />} errorElement={<ErrorBoundary/>}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminHomePage />} />
                <Route path="users" element={<UserManagment />} />
                <Route path="products" element={<ProductManagment />} />
                <Route path="products/:id/edit" element={<EditProduct />} />
                <Route path="orders" element={<OrderManagment />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
