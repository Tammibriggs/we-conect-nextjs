import { Providers } from "@/redux/provide";
import { MantineProvider } from "@mantine/core";
import { StyledEngineProvider } from "@mui/material";
import { useState } from "react";
import "@mantine/core/styles.css";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import MemoryUsage from "@/components/MemoryUsage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ReactGA from "react-ga4";

const GA_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

if (process.env.NODE_ENV === 'production' && GA_ANALYTICS_ID) {
  ReactGA.initialize(GA_ANALYTICS_ID);
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <StyledEngineProvider injectFirst>
      <Providers>
        <SessionProvider session={session}>
          <MantineProvider>
            <Component
              {...pageProps}
              setModalOpened={setModalOpened}
              modalOpened={modalOpened}
            />
              <ToastContainer />
            {/* <MemoryUsage /> */}
          </MantineProvider>
        </SessionProvider>
      </Providers>
    </StyledEngineProvider>
  );
}
