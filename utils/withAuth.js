import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function withAuth(WrappedComponent) {
  return (props) => {
    const [isAuth, setIsAuth] = useState(false);

    const router = useRouter();
    // const storageToken = hasWindow() ? localStorage.getItem("token") : "";
    const token = useSelector((state) => state.auth.token);
    // console.log(token);
    useEffect(() => {
      if (!token) {
        router.replace(`/login?from=${router.asPath}`);
      } else {
        setIsAuth(true);
      }
    }, [token]);

    if (isAuth) {
      return <WrappedComponent {...props} />;
    }
    return null;
  };
}
