import React from "react";
import {
  Card,
  Text,
  InlineStack,
  Button,
  Popover,
  ActionList,
  Icon,
} from "@shopify/polaris";
import {
  ClockIcon,
  HeartIcon,
  MenuHorizontalIcon,
  StarIcon,
  XIcon,
} from "@shopify/polaris-icons";

export default function ReviewBanner() {
  const [active, setActive] = React.useState(false);
  const togglePopover = () => setActive((active) => !active);

  return (
    <Card>
      <InlineStack align="space-between" blockAlign="center">
        {/* Left side */}
        <InlineStack gap="200" blockAlign="center">
          {/* <Icon source={HeartIcon} tone="critical" /> */}
          <InlineStack gap="100" blockAlign="center">
            <svg
              width="18"
              height="16"
              viewBox="0 0 16 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M1.8959 1.76777C3.45568 0.077409 6.01149 0.077409 7.57127 1.76777L8 2.2324L8.42873 1.76777C9.98851 0.077409 12.5443 0.077409 14.1041 1.76777C15.632 3.42355 15.632 6.08504 14.1041 7.74082L8.91865 13.3604C8.42368 13.8968 7.57632 13.8968 7.08135 13.3604L1.8959 7.74082C0.368033 6.08504 0.368032 3.42355 1.8959 1.76777Z"
                fill="#FC5555"
              ></path>
            </svg>
            <Text as="span">
              <b>Hackathon Badges</b> - Badges are free forever! Your feedback
              means a lot to us and helps us improve. Review us 👉
            </Text>
          </InlineStack>

          {/* Stars */}
          <div style={{ cursor: "pointer" }}>
            <InlineStack gap="100">
              <Icon source={StarIcon} />
              <Icon source={StarIcon} />
              <Icon source={StarIcon} />
              <Icon source={StarIcon} />
              <Icon source={StarIcon} />
            </InlineStack>
          </div>
        </InlineStack>

        {/* Right side - 3 dot menu */}
        <Popover
          active={active}
          activator={
            <Button
              variant="plain"
              icon={MenuHorizontalIcon}
              onClick={togglePopover}
              accessibilityLabel="More actions"
            />
          }
          onClose={togglePopover}
        >
          <ActionList
            items={[
              { content: "Dismiss", icon: XIcon, onAction: () => {} },
              {
                content: "Remind me later",
                icon: ClockIcon,
                onAction: () => {},
              },
            ]}
          />
        </Popover>
      </InlineStack>
    </Card>
  );
}
