import { Route, BrowserRouter as Router, Routes } from "react-router";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
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
