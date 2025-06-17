import { useState } from "react";
import Link from "next/link";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";

export default function SignupForm() {
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });

  const onSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.email || !user.username || !user.password) {
      console.error("All fields are required");
      return;
    }

    console.log("User signed up:", user);
  };

  return (
    <>
      <form className="space-y-4" onSubmit={onSignup}>
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={user.email}
          placeholder="you@example.com"
          required
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        <FormInput
          id="username"
          label="Username"
          type="text"
          value={user.username}
          placeholder="johndoe"
          required
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          value={user.password}
          placeholder="••••••••"
          required
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />

        <Button type="submit">Sign Up</Button>
      </form>{" "}
      <div className="text-center text-sm">
        <p className="text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}
