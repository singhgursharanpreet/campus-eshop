import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { Camera, Loader2, Check } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    avatar: "",
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      navigate("/login");
      return;
    }

    setUser(savedUser);
    setForm({
      name: savedUser.name || "",
      bio: savedUser.bio || "",
      avatar: savedUser.avatar || "",
    });
  }, [navigate]);

  const set = (key, value) => {
    setForm((old) => ({
      ...old,
      [key]: value,
    }));
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const reader = new FileReader();

    reader.onloadend = () => {
      set("avatar", reader.result);
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const save = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await API.put("/users/profile", form);

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setMessage("Profile saved!");
    } catch (error) {
      console.log(error);

      const updatedUser = {
        ...user,
        ...form,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage("Profile saved locally.");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <p className="text-center py-20 text-gray-500">Loading...</p>;
  }

  const initials = (form.name || user.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-8">My profile</h1>

      <div className="bg-white border rounded-2xl p-8 space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border shadow overflow-hidden bg-black text-white flex items-center justify-center text-2xl font-bold">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <label className="absolute bottom-0 right-0 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatar}
              />
            </label>
          </div>

          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <div>
          <label className="text-sm font-medium">Full name</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your name"
            className="border rounded-lg px-4 py-3 w-full mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            placeholder="Tell the community a little about yourself..."
            rows={3}
            className="border rounded-lg px-4 py-3 w-full mt-2"
          />
        </div>

        {message && (
          <p className="text-sm text-green-700 bg-green-100 p-3 rounded-lg">
            {message}
          </p>
        )}

        <button
          onClick={save}
          disabled={saving || uploading}
          className="w-full rounded-full h-11 bg-black text-white flex items-center justify-center"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          Save profile
        </button>

        <div className="border-t pt-4">
          <button
            className="w-full rounded-full h-11 border border-red-300 text-red-600"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}