import { Banner, BannerTone } from "@shopify/polaris";
import React from "react";

const NotifyBanner = ({
  title,
  tone,
  description,
  onDismiss,
}: {
  title: string;
  tone: BannerTone;
  description: string;
  onDismiss: () => void;
}) => {
  return (
    <Banner
      title={title}
      tone={tone}
      action={{ content: "Edit variant weights", url: "" }}
      secondaryAction={{ content: "Learn more", url: "" }}
      onDismiss={onDismiss}
    >
      <p>{description}</p>
    </Banner>
  );
};

export default NotifyBanner;
