import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function withOutAuth(WrappedComponent) {
  return (props) => {
    const [isAuth, setIsAuth] = useState(true);

    const router = useRouter();
    const token = useSelector((state) => state.auth.token);
    // const storageToken = hasWindow() ? localStorage.getItem("token") : "";
    const dispatch = useDispatch();

    useEffect(() => {
      if (token) {
        router.replace(`${router.query?.from ? router.query.from : "/"}`);
      } else {
        setIsAuth(false);
      }
    }, [dispatch, token]);

    if (!isAuth) {
      return <WrappedComponent {...props} />;
    }
    return null;
  };
}
