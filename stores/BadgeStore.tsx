import { create } from "zustand";

enum GridPosition {
  TOP_LEFT = "TOP_LEFT",
  TOP_CENTER = "TOP_CENTER",
  TOP_RIGHT = "TOP_RIGHT",
  MIDDLE_LEFT = "MIDDLE_LEFT",
  MIDDLE_CENTER = "MIDDLE_CENTER",
  MIDDLE_RIGHT = "MIDDLE_RIGHT",
  BOTTOM_LEFT = "BOTTOM_LEFT",
  BOTTOM_CENTER = "BOTTOM_CENTER",
  BOTTOM_RIGHT = "BOTTOM_RIGHT",
}

export type BadgeContent = {
  text: string;
  font: string;
  icon?: string;
  iconUploaded?: boolean;
  callToAction?: string;
  subheading?: string;
};

export type BadgeDesign = {
  template: string;
  background: string;
  color: string;
  isGradient: boolean;
  gradientAngle: number;
  gradient1: string;
  gradient2: string;
  cornerRadius: number;
  borderSize: number;
  borderColor: string;
  spacing: {
    insideTop: string;
    insideBottom: string;
    outsideTop: string;
    outsideBottom: string;
  };
};

export type BadgePlacement = {
  position: GridPosition | null;
};

export type BadgeDisplay = {
  iconSize: string;
  iconColor: string;
  useOriginal: boolean;
  bgColor: string;
  desktopRow: string;
  mobileRow: string;
};

export type Badge = {
  content: BadgeContent;
  design: BadgeDesign;
  placement: BadgePlacement;
  display: BadgeDisplay;
};

export type BadgeStore = {
  badge: Badge;
  updateContent: <K extends keyof BadgeContent>(
    key: K,
    value: BadgeContent[K]
  ) => void;
  updateDesign: <K extends keyof BadgeDesign>(
    key: K,
    value: BadgeDesign[K]
  ) => void;
  updatePlacement: <K extends keyof BadgePlacement>(
    key: K,
    value: BadgePlacement[K]
  ) => void;
  updateDisplay: <K extends keyof BadgeDisplay>(
    key: K,
    value: BadgeDisplay[K]
  ) => void;
  updateSpacing: (key: keyof BadgeDesign["spacing"], value: string) => void;
  clearBadge: () => void;
};

const useBadgeStore = create<BadgeStore>()((set) => ({
  badge: {
    content: {
      text: "FEATURED",
      font: "own_theme",
      icon: "",
      iconUploaded: false,
      callToAction: "noCta",
      subheading: "",
    },
    design: {
      template: "Black and Yellow",
      background: "gradient",
      color: "#7700ffff",
      isGradient: false,
      gradientAngle: 0,
      gradient1: "#DDDDDD",
      gradient2: "#FFFFFF",
      cornerRadius: 8,
      borderSize: 0,
      borderColor: "#c5c8d1",
      spacing: {
        insideTop: "16",
        insideBottom: "16",
        outsideTop: "20",
        outsideBottom: "20",
      },
    },
    placement: {
      position: GridPosition.TOP_RIGHT,
    },
    display: {
      iconSize: "32",
      iconColor: "#ffffff",
      useOriginal: false,
      bgColor: "#000000",
      desktopRow: "auto",
      mobileRow: "auto",
    },
  },

  updateContent: (key, value) => {
    console.log({ section: "content", key, value });
    set((state) => ({
      badge: {
        ...state.badge,
        content: { ...state.badge.content, [key]: value },
      },
    }));
  },

  updateDesign: (key, value) => {
    console.log({ section: "design", key, value });
    set((state) => ({
      badge: {
        ...state.badge,
        design: { ...state.badge.design, [key]: value },
      },
    }));
  },

  updatePlacement: (key, value) => {
    console.log({ section: "placement", key, value });
    set((state) => ({
      badge: {
        ...state.badge,
        placement: { ...state.badge.placement, [key]: value },
      },
    }));
  },

  updateDisplay: (key, value) => {
    console.log({ section: "display", key, value });
    set((state) => ({
      badge: {
        ...state.badge,
        display: { ...state.badge.display, [key]: value },
      },
    }));
  },

  updateSpacing: (key, value) => {
    set((state) => ({
      badge: {
        ...state.badge,
        design: {
          ...state.badge.design,
          spacing: { ...state.badge.design.spacing, [key]: value },
        },
      },
    }));
  },

  clearBadge: () =>
    set(() => ({
      badge: {
        content: {
          text: "FEATURED",
          font: "own_theme",
          icon: "",
          iconUploaded: false,
          callToAction: "noCta",
          subheading: "",
        },
        design: {
          template: "Black and Yellow",
          background: "gradient",
          color: "#7700ffff",
          isGradient: false,
          gradientAngle: 0,
          gradient1: "#DDDDDD",
          gradient2: "#FFFFFF",
          cornerRadius: 8,
          borderSize: 0,
          borderColor: "#c5c8d1",
          spacing: {
            insideTop: "16",
            insideBottom: "16",
            outsideTop: "20",
            outsideBottom: "20",
          },
        },
        placement: {
          position: GridPosition.TOP_RIGHT,
        },
        display: {
          iconSize: "32",
          iconColor: "#ffffff",
          useOriginal: false,
          bgColor: "#000000",
          desktopRow: "auto",
          mobileRow: "auto",
        },
      },
    })),
}));

export { useBadgeStore, GridPosition };
