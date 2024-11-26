import style from "../styles/auth.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SignInResponse, signIn } from "next-auth/react";
import { CircleNotch, GoogleLogo } from "@phosphor-icons/react";
import Head from "next/head";
import { Button } from "@mui/material";

export default function SignUp() {
  const router = useRouter();
  const prePageUrl = router.query.callbackUrl;

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    password1: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (inputs.password1.trim() !== inputs.password.trim()) {
      setError("Password does not match");
    }
  }, [inputs]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { password1, ...others } = inputs;
    setError("");
    setIsLoading(true);
    const signUpResponse: SignInResponse | undefined = await signIn(
      "credentials",
      {
        ...others,
        flow: "signUp",
        redirect: false,
      }
    );

    if (!signUpResponse?.ok) {
      setIsLoading(false);
      return setError("Username already exists");
    }

    const signInResponse: SignInResponse | undefined = await signIn(
      "credentials",
      {
        ...others,
        flow: "signIn",
        redirect: false,
      }
    );

    if (!signInResponse?.ok) {
      setIsLoading(false);
      return setError("Invalid username or password");
    }

    router.push((prePageUrl as string) || "/");
  };

  return (
    <div className={style.auth}>
      <Head>
        <title>Sign Up</title>
      </Head>
      <form className={style.authForm} onSubmit={handleSubmit}>
        <h3>Sign Up</h3>
        <Button
          component="div"
          className={style.authGoogle}
          onClick={() => signIn("google", { redirect: false })}
        >
          <GoogleLogo size={20} />
          <span>Sign Up with Google</span>
        </Button>
        <span className={style.authAlternative}>
          <span>OR</span>
          <hr />
        </span>
        <input
          type="text"
          value={inputs.username}
          onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
          className={style.authInput}
          name="username"
          placeholder="Usernames"
        />
        <input
          type="password"
          className={style.authInput}
          value={inputs.password}
          onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
          name="password"
          placeholder="Password"
          min={5}
        />
        <input
          type="password"
          className={style.authInput}
          value={inputs.password1}
          onChange={(e) => setInputs({ ...inputs, password1: e.target.value })}
          name="confirmpass"
          placeholder="Confirm Password"
          min={5}
        />
        {error && <p className="error">{error}</p>}
        <button
          className={`button ${style.authButton}`}
          disabled={isLoading}
          type="submit"
        >
          Signup
          {isLoading && <CircleNotch className="animate-spin" />}
        </button>
      </form>
      <div>
        <span style={{ fontSize: "12px" }}>
          Already have an account.{" "}
          <Link href="/login" className={style.authFormLink}>
            Login
          </Link>
        </span>
      </div>
    </div>
  );
}
