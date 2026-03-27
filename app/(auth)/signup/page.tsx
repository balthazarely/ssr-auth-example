"use client";

import { createAccountAction } from "@/app/actions/users";
import { startTransition } from "react";

export default function SignupPage() {
  const handleClickCreateAccountButton = (formData: FormData) => {
    console.log(formData);

    startTransition(async () => {
      const errorMessage = await createAccountAction(formData);
      console.log(errorMessage);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-bold">Create an account</h1>
        <form
          className="flex flex-col gap-4"
          action={handleClickCreateAccountButton}
        >
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
              autoComplete="new-password"
              className="rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-black py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Sign up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
