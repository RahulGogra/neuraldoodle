"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Navbar from "@/utils/navbar";
import { FaEye, FaEyeSlash, FaGithub, FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Check for callback errors or redirects
    useEffect(() => {
        const callbackError = searchParams?.get("error");
        const callbackUrl = searchParams?.get("callbackUrl");

        if (callbackError) {
            setError(
                callbackError === "OAuthAccountNotLinked"
                    ? "Email already in use with different provider"
                    : "Authentication error"
            );
        }

        // Auto-redirect if there's a callbackUrl
        if (callbackUrl) {
            localStorage.setItem("redirectUrl", callbackUrl);
        }
    }, [searchParams]);

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError("");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const apiUrl = process.env.NEXT_PUBLIC_URL;

        try {
            if (isSignUp) {
                const res = await fetch(`${apiUrl}/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, role, password }),
                });

                const data = await res.json();
                console.log("Signup response:", data);
                if (res.ok) {
                    toast.success("Account created successfully!");
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    const redirectUrl =
                        localStorage.getItem("redirectUrl") || "/";
                    localStorage.removeItem("redirectUrl");
                    router.push(redirectUrl);
                } else {
                    setError(data.error || "Sign up failed");
                    toast.error(data.error || "Sign up failed");
                }
            } else {
                const res = await fetch(`${apiUrl}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // for cookies (optional)
                    body: JSON.stringify({ email, password }),
                });
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Login failed");
                    toast.error(data.error || "Login failed");
                } else {
                    toast.success("Signed in successfully!");
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    const redirectUrl =
                        localStorage.getItem("redirectUrl") || "/";
                    localStorage.removeItem("redirectUrl");
                    router.push(redirectUrl);
                }
            }
        } catch (err) {
            setError("Server error occurred" + err);
            toast.error("Server error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider: string) => {
        setIsLoading(true);
        try {
            await signIn(provider, { callbackUrl: "/" });
        } catch (error) {
            setError(`Error signing in with ${provider}` + error);
            toast.error(`Error signing in with ${provider}`);
            setIsLoading(false);
        }
    };

    return (
        <> <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7] px-4">
                <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg">
                    <h2 className="text-2xl font-bold text-center text-[#006A71]">
                        {isSignUp ? "Create an Account" : "Welcome Back"}
                    </h2>
                    <form
                        onSubmit={handleAuth}
                        className="mt-6 flex flex-col gap-4"
                    >
                        {isSignUp && (
                            <div>
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium text-gray-700 mb-1 block"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Your full name"
                                    value={name}
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9ACBD0]"
                                />
                                <label
                                    htmlFor="role"
                                    className="text-sm font-medium text-gray-700 mb-1 block"
                                >
                                    Role
                                </label>
                                <input
                                    id="role"
                                    type="text"
                                    placeholder="Your role"
                                    value={role}
                                    required
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9ACBD0]"
                                />
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-700 mb-1 block"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9ACBD0]"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700 mb-1 block"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    required
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9ACBD0]"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash size={16} />
                                    ) : (
                                        <FaEye size={16} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {!isSignUp && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/forgot-password")
                                    }
                                    className="text-sm text-[#48A6A7] hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-[#48A6A7] to-[#006A71] text-white py-2 rounded hover:shadow-md transition disabled:opacity-50"
                        >
                            {isLoading
                                ? "Please wait..."
                                : isSignUp
                                ? "Sign Up"
                                : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleOAuthSignIn("google")}
                                disabled={isLoading}
                                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                            >
                                <FaGoogle className="h-4 w-4 mr-2" />
                                Google
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOAuthSignIn("github")}
                                disabled={isLoading}
                                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                            >
                                <FaGithub className="h-4 w-4 mr-2" />
                                GitHub
                            </button>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-sm text-[#006A71]">
                        {isSignUp
                            ? "Already have an account?"
                            : "Don't have an account?"}{" "}
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="underline text-[#48A6A7] font-medium"
                        >
                            {isSignUp ? "Sign in" : "Sign up"}
                        </button>
                    </p>
                </div>
            </div></Suspense>
        </>
    );
}
