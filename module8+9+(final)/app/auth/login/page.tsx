/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/schemas/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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
      const res = await fetch(`${API_URL}/auth/login`, {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/10 backdrop-blur-sm p-10 rounded-[2rem] w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white text-center">
          Login
        </h1>

        {serverError && (
          <p className="text-red-600 text-sm bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-200 dark:border-red-700">
            {serverError}
          </p>
        )}

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
          <input
            {...register("email")}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message as string}</p>}
        </div>

        <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99]">
          {isSubmitting ? "Wait..." : "Login"}
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Dont have an account?{' '}
          <Link href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}