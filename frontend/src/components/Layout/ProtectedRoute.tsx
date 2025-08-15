import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../redux/store";

interface ProtectedRouteProps {
  
  role?: string;
}

const ProtectedRoute:React.FC<ProtectedRouteProps> = ({  role }) => {
    const { user } = useAppSelector(state => state.auth);

    if (!user || (role && user.role !== role)) {
        return <Navigate to="/login" replace />;

    }
    return <Outlet/>;
};

export default ProtectedRoute;