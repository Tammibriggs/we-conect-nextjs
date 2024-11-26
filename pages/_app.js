import { Providers } from "@/redux/provide";
import { MantineProvider } from "@mantine/core";
import { StyledEngineProvider } from "@mui/material";
import { useState } from "react";
import "@mantine/core/styles.css";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import MemoryUsage from "@/components/MemoryUsage";

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
            <MemoryUsage />

          </MantineProvider>
        </SessionProvider>
      </Providers>
    </StyledEngineProvider>
  );
}
