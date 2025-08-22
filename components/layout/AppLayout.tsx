import NavBar from "@/components/NavBar";
import NotifyBanner from "../NotifyBanner";
import { Page, Layout } from "@shopify/polaris";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>{children}</Layout.Section>
      </Layout>
    </Page>
  );
}
