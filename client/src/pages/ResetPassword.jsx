import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-black text-white flex items-center justify-center mb-4">
          <Lock />
        </div>

        <h1 className="text-3xl font-bold">Reset password</h1>

        <p className="text-gray-500 mt-3">
          Password reset will be added later. Please contact admin if you forget your password.
        </p>

        <Link to="/login">
          <button className="mt-6 bg-black text-white rounded-lg px-6 py-3">
            Back to Login
          </button>
        </Link>
      </div>
    </div>
  );
}