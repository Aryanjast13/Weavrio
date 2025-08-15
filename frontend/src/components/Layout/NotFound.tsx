import { Navigate } from "react-router";

const NotFound = () => {
  return (
    <div className="text-center p-20" >
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Navigate to="/" replace />
    </div>
  );
}

export default NotFound