// @ts-nocheck
import AppBridgeProvider from "@/components/providers/AppBridgeProvider";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import Link from "next/link";
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import type { AppProps } from "next/app";
import { useEffect } from "react";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <PolarisProvider i18n={translations}>
        <AppBridgeProvider>
          <ui-nav-menu>
            <Link href="/badges">Badges</Link>
            <Link href="/settings">Settings</Link>
          </ui-nav-menu>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </AppBridgeProvider>
      </PolarisProvider>
    </>
  );
};

export default App;
