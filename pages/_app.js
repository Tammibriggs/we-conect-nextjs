import Container from "@/components/Container";
import { Providers } from "@/redux/provide";
import { MantineProvider } from "@mantine/core";
import { StyledEngineProvider } from "@mui/material";
import { useState } from "react";
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <StyledEngineProvider injectFirst>
      <Providers>
        <Container>
          <MantineProvider>
            <Component
              {...pageProps}
              setModalOpened={setModalOpened}
              modalOpened={modalOpened}
            />
          </MantineProvider>
        </Container>
      </Providers>
    </StyledEngineProvider>
  );
}
