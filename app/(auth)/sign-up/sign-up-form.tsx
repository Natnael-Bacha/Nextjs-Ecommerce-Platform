"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpInput } from "@/lib/signUpSchema";

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      middleName: "",
      lastName: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    setLoading(true);
    setServerError(null);

    const { error: authError } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: `${data.firstName} ${data.middleName} ${data.lastName}`
        .replace(/\s+/g, " ")
        .trim(),
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,

      callbackURL: "/userProducts",
    });

    if (authError) {
      setServerError(authError.message || "Failed to create account");
      setLoading(false);
    } else {
      toast.success("Welcome aboard!");
      router.push("/userProducts");
    }
  };

  async function handleGoogleSignIn() {
    setLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/userProducts",
    });
    if (error) {
      setLoading(false);
      setServerError(error.message || "Google sign-in failed");
    }
  }

  const inputClass = (fieldName: keyof SignUpInput) =>
    `w-full px-3 py-1.5 text-sm border rounded-md outline-none transition-all ${
      errors[fieldName]
        ? "border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-zinc-200 focus:ring-2 focus:ring-zinc-900"
    }`;

  return (
    <div className="w-full max-w-lg p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
      <div className="mb-5 space-y-1 text-center sm:text-left">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Create an account
        </h1>
        <p className="text-xs text-zinc-500">
          Join ESSENTIALS to start your journey.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">
              First Name
            </label>
            <input
              {...register("firstName")}
              className={inputClass("firstName")}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-[10px] text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">
              Last Name
            </label>
            <input
              {...register("lastName")}
              className={inputClass("lastName")}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-[10px] text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">
              Middle Name
            </label>
            <input
              {...register("middleName")}
              className={inputClass("middleName")}
            />
            {errors.middleName && (
              <p className="text-[10px] text-red-500">
                {errors.middleName.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Phone</label>
            <input
              {...register("phoneNumber")}
              type="tel"
              className={inputClass("phoneNumber")}
              placeholder="+1..."
            />
            {errors.phoneNumber && (
              <p className="text-[10px] text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">Email</label>
          <input
            {...register("email")}
            type="email"
            className={inputClass("email")}
            placeholder="name@example.com"
          />
          {errors.email && (
            <p className="text-[10px] text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className={inputClass("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-500 leading-tight">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Confirm</label>
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                className={inputClass("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {serverError && (
          <div className="p-2 text-[10px] font-medium text-red-600 bg-red-50 rounded-md border border-red-100">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-zinc-800 transition-all disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-white px-2 text-zinc-400">Or continue with</span>
        </div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        type="button"
        className="w-full flex items-center justify-center gap-2 py-2 border border-zinc-200 rounded-md text-sm font-medium hover:bg-zinc-50 transition-all"
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </button>

      <p className="mt-4 text-center text-xs text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-zinc-900 underline underline-offset-4"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
