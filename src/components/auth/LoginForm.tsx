import { useState } from "react";
import Link from "next/link";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";

export default function LoginForm() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const onLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.username || !user.password) {
      console.error("All fields are required");
      return;
    }

    console.log("User login attempt:", user);
  };

  return (
    <>
      <form className="space-y-4" onSubmit={onLogin}>
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

        <Button type="submit">Log In</Button>
      </form>{" "}
      <div className="text-center text-sm">
        <p className="text-gray-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
