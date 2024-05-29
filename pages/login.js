import style from "../styles/auth.module.css";
import { useLoginMutation } from "../redux/services/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [inputs, setInputs] = useState({ username: "", password: "" });
  const [login, result] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(inputs);
    if (response.data) {
      const { accessToken, ...others } = response.data.data;
      dispatch(setCredentials({ user: others, token: accessToken }));
      router.push(router.query?.from || "/");
    }
  };

  return (
    <div className={style["a-right"]}>
      <form
        className={`${style.infoForm} ${style.authForm}`}
        onSubmit={handleSubmit}
      >
        <h3>Log In</h3>
        <div>
          <input
            type="text"
            placeholder="Username"
            className={style.infoInput}
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            name="username"
          />
        </div>

        <div>
          <input
            type="password"
            className={style.infoInput}
            placeholder="Password"
            value={inputs.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            name="password"
          />
        </div>
        {result.error && (
          <p className="error">
            {result.error?.data
              ? result.error.data.message
              : "Something went wrong"}
          </p>
        )}
        <div>
          <span style={{ fontSize: "12px" }}>
            Don't have an account{" "}
            <Link href="/register" className={style.authForm__link}>
              Register
            </Link>
          </span>
          <button
            className={`button ${style.infoButton}`}
            disabled={result.isLoading}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
