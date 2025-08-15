import { useNavigate, useRouteError } from "react-router";

const  ErrorBoundary = () =>{
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="text-center p-20">
      <h1>Something went wrong!</h1>
      <p>{error?.message || "An unexpected error occurred"}</p>
      <button onClick={() => navigate("/")}>Go Home</button>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

export default ErrorBoundary;
