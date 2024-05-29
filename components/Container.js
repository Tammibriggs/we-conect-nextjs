import { setCredentials } from "@/redux/authSlice";
import { useGetUserQuery } from "@/redux/services/user";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Container({ children }) {
  const token = useSelector((state) => state.auth.token);
  const [windowWidth, setWindowWidth] = useState(0);
  const [skip, setSkip] = useState(true);
  const dispatch = useDispatch();
  const { data } = useGetUserQuery(null, { skip });

  useEffect(() => {
    if (token) {
      setSkip(false);
    }
    if (data) {
      dispatch(setCredentials({ user: data.data, token }));
    }
  }, [data, token, dispatch]);

  const resize = () => {
    setWindowWidth(window.innerWidth);
  };

  // set the inner width of the window in state
  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <div className="app">{children}</div>;
}

export default Container;
