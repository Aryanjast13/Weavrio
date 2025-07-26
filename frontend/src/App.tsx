import { Route, BrowserRouter as Router, Routes } from "react-router";
import UserLayout from "./components/Layout/UserLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          {" "}
          {/* User layout */}
        </Route>

        {/* Admin layout */}
      </Routes>
    </Router>
  );
}

export default App;
