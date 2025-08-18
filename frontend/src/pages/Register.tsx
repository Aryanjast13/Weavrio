import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"; // Fixed import
import register from "../assets/register.webp";
import { registerUser } from "../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

// Types for better type safety
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  const { user, loading, error } = useAppSelector(
    (state) => state.auth
  );
  

   useEffect(()=>{
          if (user) {
            navigate("/");
          
          }
          
          
        },[user])

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!name || !email || !password) {
      return; // Could add validation toast here
    }

    setIsLoading(true);

    try {
      const registerData: RegisterFormData = { name, email, password };
      await dispatch(registerUser(registerData)).unwrap(); // unwrap to handle rejections
      console.log("User registered successfully", { name, email });

      // Navigation will be handled by useEffect when user state updates
    } catch (error) {
      console.error("Registration failed:", error);
      // Error is handled by Redux state
    } finally {
      setIsLoading(false);
    }
  };
  

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
          <p className="text-center mb-6">Create your account to get started</p>

          {/* Display error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-black"
              placeholder="Enter your full name"
              required
              disabled={isLoading || loading}
            />
          </div>

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
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || loading || !name || !email || !password}
            className={`w-full p-2 rounded-lg font-semibold transition ${
              isLoading || loading || !name || !email || !password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {isLoading || loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              to={`/login`}
              className="text-blue-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            draggable="false"
            src={register}
            alt="Create Account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
