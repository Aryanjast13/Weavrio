import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAppSelector } from "../../redux/store";

const ProtectedProfile = ()=> {
  const { user, loading } = useAppSelector((state) => state.auth); // Add isLoading if available
  const location = useLocation();
  const navigate = useNavigate();

  const userInfo = localStorage.getItem("userInfo");

  useEffect(() => {

    if (!loading && !user && !userInfo) {
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [user, userInfo, loading, location, navigate]);

  // Show loading or prevent render while checking auth
  if (loading) return <div>Loading...</div>; // or your loading component

  // Prevent rendering if not authenticated
  if (!user && !userInfo) return null;

  return <Outlet />;
};

export default ProtectedProfile;