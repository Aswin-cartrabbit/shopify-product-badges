import { useBadgeStore } from "@/stores/BadgeStore";

const positionMap = {
  TOP_LEFT: "badge-top-left",
  TOP_CENTER: "badge-top-center",
  TOP_RIGHT: "badge-top-right",
  MIDDLE_LEFT: "badge-middle-left",
  MIDDLE_CENTER: "badge-middle-center",
  MIDDLE_RIGHT: "badge-middle-right",
  BOTTOM_LEFT: "badge-bottom-left",
  BOTTOM_CENTER: "badge-bottom-center",
  BOTTOM_RIGHT: "badge-bottom-right",
};

export default function getHtmlPreviewCode() {
  const { badge } = useBadgeStore();
  const { content, design, placement, display } = badge;

  // Generate background CSS based on design settings
  const getBackgroundCSS = () => {
    if (design.background === "gradient" && design.isGradient) {
      return `linear-gradient(${design.gradientAngle}deg, ${design.gradient1}, ${design.gradient2})`;
    }
    return design.color;
  };

  // Generate badge inline styles
  const badgeStyles = `
    position: absolute;
    z-index: 10;
    padding: ${design.spacing.insideTop}px ${design.spacing.insideBottom}px;
    background: ${getBackgroundCSS()};
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: ${design.cornerRadius}px;
    white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: ${design.borderSize}px solid ${design.borderColor};
    font-family: ${content.font === "own_theme" ? "inherit" : content.font.replace("_", " ")};
    margin-top: ${design.spacing.outsideTop}px;
    margin-bottom: ${design.spacing.outsideBottom}px;
  `
    .replace(/\s+/g, " ")
    .trim();

  const positionClass = placement.position
    ? positionMap[placement.position]
    : "badge-top-right";
  console.log(badgeStyles);
  return `<div
  style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start">
  <div>
      <div class="product-image-container" style="margin-bottom: 2rem; max-width: 300px;">

    <div
      style="background-color:#f8f9fa;aspect-ratio:1;border-radius:0.5rem;margin-bottom:1rem;display:flex;align-items:center;justify-content:center;font-size:1.125rem;color:#6b7280">
    </div>
    <div class="product-badge ${positionClass}" style="${badgeStyles}">${content.text}</div>
    </div>
    <div style="display:flex;gap:0.5rem">
      <div
        style="background-color:#f8f9fa;aspect-ratio:1;border-radius:0.375rem;flex:1;display:flex;align-items:center;justify-content:center;font-size:0.875rem;color:#9ca3af;cursor:pointer">
        1
      </div>
      <div
        style="background-color:#f8f9fa;aspect-ratio:1;border-radius:0.375rem;flex:1;display:flex;align-items:center;justify-content:center;font-size:0.875rem;color:#9ca3af;cursor:pointer">
        2
      </div>
      <div
        style="background-color:#f8f9fa;aspect-ratio:1;border-radius:0.375rem;flex:1;display:flex;align-items:center;justify-content:center;font-size:0.875rem;color:#9ca3af;cursor:pointer">
        3
      </div>
      <div
        style="background-color:#f8f9fa;aspect-ratio:1;border-radius:0.375rem;flex:1;display:flex;align-items:center;justify-content:center;font-size:0.875rem;color:#9ca3af;cursor:pointer">
        4
      </div>
    </div>
  </div>
  <div>
    <div
      style="margin-bottom:0.5rem;font-size:0.875rem;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em">
      Category Name
    </div>
    <h1
      style="font-size:2.25rem;font-weight:bold;margin-bottom:1rem;line-height:1.2">
      Premium Product Name
    </h1>
    <div
      style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1.5rem">
      <div style="display:flex;color:#fbbf24">★★★★★</div>
      <span style="color:#6b7280;font-size:0.875rem">(128 reviews)</span>
    </div>
    <div style="margin-bottom:2rem">
      <div
        style="font-size:2rem;font-weight:bold;color:#2563eb;margin-bottom:0.5rem">
        $299.99
      </div>
      <div style="font-size:0.875rem;color:#6b7280">
        <span style="text-decoration:line-through">$399.99</span
        ><span style="color:#dc2626;margin-left:0.5rem;font-weight:500"
          >25% off</span
        >
      </div>
    </div>
    <p style="color:#4b5563;margin-bottom:2rem;line-height:1.6">
      This is a detailed product description that highlights the key features
      and benefits of the product. It provides customers with essential
      information to make an informed purchasing decision.
    </p>
    <div style="margin-bottom:2rem">
      <div style="margin-bottom:1rem">
        <label
          style="display:block;font-size:0.875rem;font-weight:500;margin-bottom:0.5rem"
          >Size</label
        >
        <div style="display:flex;gap:0.5rem">
          <button
            style="border:1px solid #d1d5db;padding:0.5rem 1rem;border-radius:0.375rem;background-color:transparent;color:#374151;cursor:pointer">
            S</button
          ><button
            style="border:1px solid #d1d5db;padding:0.5rem 1rem;border-radius:0.375rem;background-color:#2563eb;color:white;cursor:pointer">
            M</button
          ><button
            style="border:1px solid #d1d5db;padding:0.5rem 1rem;border-radius:0.375rem;background-color:transparent;color:#374151;cursor:pointer">
            L</button
          ><button
            style="border:1px solid #d1d5db;padding:0.5rem 1rem;border-radius:0.375rem;background-color:transparent;color:#374151;cursor:pointer">
            XL
          </button>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:1rem;margin-bottom:2rem">
      <button
        style="background-color:#2563eb;color:white;border:none;padding:0.75rem 2rem;border-radius:0.375rem;font-size:1rem;font-weight:500;cursor:pointer;flex:1">
        Add to Cart</button
      ><button
        style="background-color:transparent;color:#2563eb;border:1px solid #2563eb;padding:0.75rem 1rem;border-radius:0.375rem;cursor:pointer">
        ♡
      </button>
    </div>
  </div>
</div>
    <style>
      .product-image-container {
        position: relative;
        display: inline-block;
        width: 100%;
      }

      /* Top row positions */
      .badge-top-left {
        top: 0.5rem;
        left: 0.5rem;
      }

      .badge-top-center {
        top: 0.5rem;
        left: 50%;
        transform: translateX(-50%);
      }

      .badge-top-right {
        top: 0.5rem;
        right: 0.5rem;
      }

      /* Middle row positions */
      .badge-middle-left {
        top: 50%;
        left: 0.5rem;
        transform: translateY(-50%);
      }

      .badge-middle-center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .badge-middle-right {
        top: 50%;
        right: 0.5rem;
        transform: translateY(-50%);
      }

      /* Bottom row positions */
      .badge-bottom-left {
        bottom: 0.5rem;
        left: 0.5rem;
      }

      .badge-bottom-center {
        bottom: 0.5rem;
        left: 50%;
        transform: translateX(-50%);
      }

      .badge-bottom-right {
        bottom: 0.5rem;
        right: 0.5rem;
      }
    </style>

`;
}
