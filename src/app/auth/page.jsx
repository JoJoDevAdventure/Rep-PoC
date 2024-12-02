"use client";

import Button from "@/Components/Button";
import CustomInput from "@/Components/CustomInput";
import Loading from "@/Components/Loading";
import { appState } from "@/appState"; // Import app state
import { users } from "@/data"; // Import user data
import { useRouter } from "next/navigation"; // Use the Next.js navigation API
import { useState } from "react";

const Auth = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate backend call and authentication check
    const user = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      console.log(user)
      // Simulate a delay (e.g., for loading screen)
      setTimeout(() => {
        appState.username = user.username;
        appState.isAuth = true;
        console.log(appState.username)
        setLoading(false);
        router.push("/"); // Redirect to the home page
      }, 2000);
    } else {
      setLoading(false);
      alert("User not found. Please check your credentials.");
    }
  };

  return (
    <section className="min-h-screen min-w-screen bg-black-100">
      {loading && (
        <Loading/>
      )}
      <div className="container">
        {/* Top Navigation */}
        <div className="fixed top-0 left-0 z-50 w-full py-4 transition-all duration-500 bg-black-100 bg-opacity-20 backdrop-blur-[12px] flex justify-center">
          <img className="w-48" src="/logo-white.png" alt="" />
        </div>

        {/* Login Form */}
        <div className="relative flex justify-center items-center min-h-screen z-10">
          <div className="bg-black bg-opacity-20 backdrop-blur-md rounded-2xl border border-s3 p-8 w-full max-w-md shadow-lg">
            <h1 className="text-2xl font-bold text-white text-center mb-4">
              Welcome Back
            </h1>
            <p className="text-gray-300 text-center mb-6">
              Please log in to access your dashboard.
            </p>
            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-4">
                <CustomInput
                  placeholder="Email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <CustomInput
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  markerFill="none"
                  containerClassName="w-full text-center flex justify-center justify-center"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Log In"}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="absolute -top-0 right-0 w-[100vw] h-[100vh] pointer-events-none opacity-100">
          <img src="/hero.gif" alt="Background GIF" className="max-lg:h-auto"/>
        </div>
      </div>
    </section>
  );
};

export default Auth;
{
  /* Background GIF */
}
