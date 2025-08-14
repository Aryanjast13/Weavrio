import { Navigate } from "react-router";
import { useAppSelector } from "../../redux/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute:React.FC<ProtectedRouteProps> = ({ children, role }) => {
    const { user } = useAppSelector(state => state.auth);

    if (!user || (role && user.role !== role)) {
        return <Navigate to="/login" replace />;

    }
    return children;
};

export default ProtectedRoute;