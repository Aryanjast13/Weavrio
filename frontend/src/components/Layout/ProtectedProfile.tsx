import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../redux/store";



const ProtectedProfile = () => {
    const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  
  const userInfo = localStorage.getItem("userInfo");

  if (!user && userInfo){
      return <Navigate to="/login" state={{ from: location }} replace />;
  }
    
    
  return <Outlet/>;
};

export default ProtectedProfile;
