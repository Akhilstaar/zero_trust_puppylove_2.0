import type { AppProps } from "next/app";
import "../app/globals.css";

import { AuthProvider } from "@saas-ui/auth";
import { SaasProvider } from "@saas-ui/react";
import { Layout } from "../app/(landing)/components/layout";

import theme from "../app/(landing)/theme";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const { announcement, header, footer } = pageProps;

  return (
    <SaasProvider theme={theme}>
      <AuthProvider>
        <Layout
          announcementProps={announcement}
          headerProps={header}
          footerProps={footer}
        >
          <Head>
            <title>Puppy Love</title>
            <link rel="shortcut icon" href="/pclub-logo.png" />
            {/* <script src="https://www.google.com/recaptcha/api.js" async defer></script> */}
          </Head>
          <Component {...pageProps} />
        </Layout>

      </AuthProvider>
    </SaasProvider>
  );
}

export default MyApp;
