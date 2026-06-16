import React from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <p>Please login first.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-[#b6532a] text-white px-5 py-2 rounded-full"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-2xl p-8">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-[#b6532a] text-white flex items-center justify-center mb-4">
          <User size={36} />
        </div>

        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-sm mt-2 capitalize">Role: {user.role}</p>

        <button
          onClick={logout}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-full inline-flex items-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}