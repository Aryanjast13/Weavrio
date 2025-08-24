import { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import { Toaster } from "sonner";
import store from "./redux/store";

// Layouts
const UserLayout = lazy(() => import("./components/Layout/UserLayout"));
const AdminLayout = lazy(() => import("./components/Layout/AdminLayout"));
const ProtectedProfile = lazy(
  () => import("./components/Layout/ProtectedProfile")
);
const ProtectedRoute = lazy(() => import("./components/Layout/ProtectedRoute"));
const NotFound = lazy(() => import("./components/Layout/NotFound"));
const ErrorBoundary = lazy(() => import("./components/Layout/ErrorBoundary"));

// Products
const Checkout = lazy(() => import("./components/Product/Checkout"));
const ProductDetails = lazy(
  () => import("./components/Product/ProductDetails")
);

// Pages (User)
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const Profile = lazy(() => import("./pages/Profile"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));

// Pages (Admin)
const AdminHomePage = lazy(() => import("./pages/AdminHomePage"));
const UserManagment = lazy(() => import("./components/Admin/UserManagment"));
const ProductManagment = lazy(
  () => import("./components/Admin/ProductManagment")
);
const EditProduct = lazy(() => import("./components/Admin/EditProduct"));
const OrderManagment = lazy(() => import("./components/Admin/OrderManagment"));

// A simple reusable loader
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <span className="text-lg font-medium">Loading...</span>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />

        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* User layout */}
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                  path="collections/:collection"
                  element={<CollectionPage />}
                />
                <Route path="product/:id" element={<ProductDetails />} />

                {/* Protected Profile routes */}
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
              <Route path="/admin" element={<ProtectedRoute role="admin" />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminHomePage />} />
                  <Route path="users" element={<UserManagment />} />
                  <Route path="products" element={<ProductManagment />} />
                  <Route path="products/:id/edit" element={<EditProduct />} />
                  <Route path="orders" element={<OrderManagment />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </Provider>
  );
}

export default App;
