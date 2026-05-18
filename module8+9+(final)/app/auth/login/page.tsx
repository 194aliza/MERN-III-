/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/schemas/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values: any) => {
    setServerError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ SAVE TOKEN + USER
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      // ✅ REDIRECT
      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/home");
      }

    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {serverError && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {serverError}
          </p>
        )}

        <div>
          <label>Email</label>
          <input {...register("email")} className="w-full p-2 border rounded-md text-black" />
          {errors.email && <p className="text-red-500">{errors.email.message as string}</p>}
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register("password")} className="w-full p-2 border rounded-md text-black" />
          {errors.password && <p className="text-red-500">{errors.password.message as string}</p>}
        </div>

        <button className="w-full bg-black text-white py-2 rounded-lg">
          {isSubmitting ? "Wait..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Dont have an account?{" "}
          <Link href="/auth/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}