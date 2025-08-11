import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { addUser, deleteUser, fetchUsers, updateUser } from "../../redux/adminSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";


const users = [
  {
    _id:1234,
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
  },
];


const UserManagment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector(state => state.auth);
  const { users, loading, error } = useAppSelector(state => state.admin);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate])
  
  useEffect(() => {
    if (user && user.role == "admin") {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);
 
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role:"customer",
    })

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value,
         })
    }
    const handleChangeSelect = (e:ChangeEvent<HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }
      
    
    const handleSubmit = (e:FormEvent) => {
        e.preventDefault();
        
       dispatch(addUser(formData))  
      
      //Reset the form after submission
        setFormData({
            name: "",
            email: "",
            password: "",
            role:"customer",
        })
    }
  const handleRoleChange = (userId:number,newRole:string) => {
    dispatch(updateUser({ id: userId, role: newRole }));
  }
  
  const handleDeleteUser = (userId:number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Managment</h2>
      {/* Add a user Form */}
      {loading && <p>Loading...</p>}
      {error && <p>Error : {error}</p>}
      {/* Add New User Form */}
      <div className="p-6 rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-4 ">Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-500">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChangeSelect}
              className="w-full p-2 rounded border border-gray-200 "
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add User
          </button>
        </form>
      </div>

      {/* User list Managment */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                  {user.name}
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="customer">Customer</option>
                     <option value="admin">Admin </option>
                  </select>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagment;