"use client";

import { appState } from "@/appState";
import { users } from "@/data";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Button = dynamic(() => import("@/Components/Button"), { ssr: false });
const CustomInput = dynamic(() => import("@/Components/CustomInput"), { ssr: false });
const Loading = dynamic(() => import("@/Components/Loading"), { ssr: false });

const Auth = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      setTimeout(() => {
        appState.user = user;
        appState.isAuth = true;
        setLoading(false);
        router.push("/");
      }, 2000);
    } else {
      setLoading(false);
      alert("User not found. Please check your credentials.");
    }
  };

  return (
    <section className="min-h-screen min-w-screen bg-black-100">
      {loading && <Loading />}
      <div className="container">
        <div className="fixed top-0 left-0 z-50 w-full py-4 bg-black-100 bg-opacity-20 backdrop-blur-[12px] flex justify-center">
          <img className="w-48" src="/logo-white.png" alt="" />
        </div>
        <div className="relative flex justify-center items-center min-h-screen z-10">
          <div className="bg-black bg-opacity-20 backdrop-blur-md rounded-2xl border border-s3 p-8 w-full max-w-md shadow-lg">
            <h1 className="text-2xl font-bold text-white text-center mb-4">
              Welcome Back
            </h1>
            <p className="text-gray-300 text-center mb-6">
              Please log in to access your dashboard.
            </p>
            <form onSubmit={handleSubmit}>
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
              <div className="text-center">
                <Button
                  type="submit"
                  markerFill="none"
                  containerClassName="w-full"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Log In"}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="absolute -top-0 right-0 w-[100vw] h-[100vh] pointer-events-none">
          <img src="/hero.gif" alt="Background GIF" className="max-lg:h-auto" />
        </div>
      </div>
    </section>
  );
};

export default Auth;