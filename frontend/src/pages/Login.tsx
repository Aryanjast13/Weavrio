import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"; // Actually fixed the import
import login from "../assets/login.webp";
import { loginUser } from "../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

// Types for better type safety
interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!email || !password) {
      return; // Could add validation toast here
    }

    setIsLoading(true);

    try {
      const loginData: LoginFormData = { email, password };
      await dispatch(loginUser(loginData)).unwrap(); // unwrap to handle rejections
      console.log("User logged in successfully", { email });

      // Navigation is handled automatically by useEffect when user state updates
    } catch (error) {
      console.error("Login failed:", error);
      // Error is handled by Redux state
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <p>Error comes</p>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Weavrio</h2>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">Hey there!</h2>
          <p className="text-center mb-6">
            Enter your email and password to login
          </p>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-black"
              placeholder="Enter your email address"
              required
              disabled={isLoading || loading}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-black"
              placeholder="Enter your password"
              required
              disabled={isLoading || loading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || loading || !email || !password}
            className={`w-full p-2 rounded-lg font-semibold transition ${
              isLoading || loading || !email || !password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {isLoading || loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link to={`/register`} className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            draggable="false"
            src={login}
            alt="Login to Account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
