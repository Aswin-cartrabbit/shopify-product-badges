// @ts-nocheck
import AppBridgeProvider from "@/components/providers/AppBridgeProvider";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import Link from "next/link";
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import type { AppProps } from "next/app";
import { useSessionStore } from "@/stores/sessionStore";
import { useEffect } from "react";

const App = ({ Component, pageProps }) => {
  const { storeId, setStoreId } = useSessionStore();
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch("/api/store"); // 🔹 your API route
        const data = await res.json();
        console.log(data);
        if (data?.store?.id) {
          setStoreId(data?.store?.id);
          console.log("✅ Store ID saved in Zustand:", data?.store?.id);
        }
      } catch (error) {
        console.error("❌ Failed to fetch store:", error);
      }
    };

    if (!storeId) {
      fetchStore();
    }
  }, [storeId, setStoreId]);
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
