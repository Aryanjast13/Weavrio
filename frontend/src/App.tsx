import { Route, BrowserRouter as Router, Routes } from "react-router";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
          {/* User layout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home/>}/>
        </Route>

        {/* Admin layout */}
      </Routes>
    </Router>
  );
}

export default App;
