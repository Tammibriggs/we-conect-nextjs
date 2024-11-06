import style from "../styles/auth.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SignInResponse, signIn } from "next-auth/react";

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
  }, [inputs.password1]);

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
      return setError("Invalid username or password");
    }

    setIsLoading(false);
    router.push((prePageUrl as string) || "/");
  };

  return (
    <div className={style["a-right"]}>
      <form
        className={`${style.infoForm} ${style.authForm}`}
        onSubmit={handleSubmit}
      >
        <h3>Sign up</h3>
        <div>
          <input
            type="text"
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            className={style.infoInput}
            name="username"
            placeholder="Usernames"
          />
        </div>
        <div>
          <input
            type="password"
            className={style.infoInput}
            value={inputs.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            name="password"
            placeholder="Password"
            min={5}
          />
          <input
            type="password"
            className={style.infoInput}
            value={inputs.password1}
            onChange={(e) =>
              setInputs({ ...inputs, password1: e.target.value })
            }
            name="confirmpass"
            placeholder="Confirm Password"
            min={5}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <div>
          <span style={{ fontSize: "12px" }}>
            Already have an account.{" "}
            <Link href="/login" className={style.authForm__link}>
              Login
            </Link>
          </span>
        </div>
        <button
          className={`button ${style.infoButton}`}
          disabled={isLoading}
          type="submit"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
