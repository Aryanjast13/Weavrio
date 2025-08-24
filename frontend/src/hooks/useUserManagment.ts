import { useEffect,useState ,type ChangeEvent,type FormEvent } from "react";
import { useNavigate } from "react-router";
import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../redux/adminSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

// Define form data interface
interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: "admin" | "customer";
}


export function useUserManagment() {
     const dispatch = useAppDispatch();
     const navigate = useNavigate();

     // Properly typed Redux selectors
     const { user } = useAppSelector((state) => state.auth);
     const { users, loading, error } = useAppSelector((state) => state.admin);

     // Redirect non-admin users
     useEffect(() => {
       if (user && user.role !== "admin") {
         navigate("/");
       }
     }, [user, navigate]);

     // Fetch users if admin
     useEffect(() => {
       if (user && user.role === "admin") {
         dispatch(fetchUsers());
       }
     }, [dispatch, user]);

     // Form state with proper typing
     const [formData, setFormData] = useState<UserFormData>({
       name: "",
       email: "",
       password: "",
       role: "customer",
     });

     // Handle input changes
     const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
       const { name, value } = e.target;
       setFormData({
         ...formData,
         [name]: value,
       });
     };

     // Handle select changes
     const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>): void => {
       const { name, value } = e.target;
       setFormData({
         ...formData,
         [name]: value as "admin" | "customer",
       });
     };

     // Handle form submission
     const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
       e.preventDefault();

       // Basic form validation
       if (!formData.name || !formData.email || !formData.password) {
         alert("Please fill in all fields");
         return;
       }

       dispatch(addUser(formData));

       // Reset the form after submission
       setFormData({
         name: "",
         email: "",
         password: "",
         role: "customer",
       });
     };

     // Handle role change
     const handleRoleChange = (userId: string, newRole: string): void => {
       dispatch(
         updateUser({
           id: userId,
           role: newRole as "admin" | "customer",
         })
       );
     };

     // Handle user deletion
     const handleDeleteUser = (userId: string): void => {
       if (window.confirm("Are you sure you want to delete this user?")) {
         dispatch(deleteUser(userId));
       }
     };

    
    return {
        users,loading,error,handleChange,handleChangeSelect,handleDeleteUser,handleRoleChange,handleSubmit,formData
    }
}