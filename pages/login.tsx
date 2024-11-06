import style from "../styles/auth.module.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { SignInResponse, signIn, useSession } from "next-auth/react";
import Head from "next/head";

export default function Login() {
  const router = useRouter();
  const prePageUrl = router.query.callbackUrl;
  const [inputs, setInputs] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const response: SignInResponse | undefined = await signIn("credentials", {
      ...inputs,
      flow: "signIn",
      redirect: false,
    });
    setIsLoading(false);

    if (!response?.ok) {
      return setError("Invalid username or password");
    }

    router.push((prePageUrl as string) || "/");
  };

  return (
    <div className={style.auth}>
      <Head>
        <title>Login</title>
      </Head>
      <form className={style.authForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className={style.authInput}
          value={inputs.username}
          onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
          name="username"
        />
        <input
          type="password"
          className={style.authInput}
          placeholder="Password"
          value={inputs.password}
          onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
          name="password"
        />
        {error && <p className="error">{error}</p>}
        <button className={`button ${style.authButton}`} disabled={isLoading}>
          Login
          {isLoading && <CircleNotch className="animate-spin" />}
        </button>
      </form>
      <span className={style.authFormAlt}>
        Don&apos;t have an account{" "}
        <Link href="/register" className={style.authFormLink}>
          Register
        </Link>
      </span>
    </div>
  );
}
