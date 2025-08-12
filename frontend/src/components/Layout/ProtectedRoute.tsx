import { Navigate } from "react-router";
import { useAppSelector } from "../../redux/store";


const ProtectedRoute = ({ children, role }) => {
    const { user } = useAppSelector(state => state.auth);

    if (!user || (role && user.role !== role)) {
        return <Navigate to="/login" replace />;

    }
    return children;
};

export default ProtectedRoute;