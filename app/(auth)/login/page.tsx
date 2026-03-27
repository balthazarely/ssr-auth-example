"use client";

import { loginAction, signInWithGoogleAction } from "@/app/actions/users";
import { startTransition } from "react";

export default function LoginPage() {
  const handleClickLoginButton = (formData: FormData) => {
    console.log(formData);

    startTransition(async () => {
      const errorMessage = await loginAction(formData);
      console.log(errorMessage);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-bold">Log in</h1>
        <form className="flex flex-col gap-4" action={handleClickLoginButton}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-black py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Log in
          </button>
        </form>
        <div className="relative my-4 flex items-center">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-3 text-xs text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>
        <button
          type="button"
          onClick={() => startTransition(() => signInWithGoogleAction())}
          className="w-full rounded border py-2 text-sm font-medium hover:bg-gray-50"
        >
          Continue with Google
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="font-medium underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
