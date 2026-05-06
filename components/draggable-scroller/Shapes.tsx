// 3D-feeling sticker shapes used by the draggable scroller. Each shape
// is a single SVG that ships its own gradient, soft inner highlight,
// and outline tint. The wrapping wheel adds the drop shadow.

export type ShapeKind =
  | "diamond"
  | "star"
  | "circle"
  | "heart"
  | "flower"
  | "square"
  | "hexagon";

export const SHAPE_LABEL: Record<ShapeKind, string> = {
  diamond: "Clarity",
  star: "Craft",
  circle: "Curation",
  heart: "Momentum",
  flower: "Rhythm",
  square: "Restraint",
  hexagon: "Motion",
};

type Props = { kind: ShapeKind };

export function Shape({ kind }: Props) {
  switch (kind) {
    case "diamond":
      return <DiamondShape />;
    case "star":
      return <StarShape />;
    case "circle":
      return <CircleShape />;
    case "heart":
      return <HeartShape />;
    case "flower":
      return <FlowerShape />;
    case "square":
      return <SquareShape />;
    case "hexagon":
      return <HexagonShape />;
  }
}

const svgProps = {
  viewBox: "0 0 100 100",
  xmlns: "http://www.w3.org/2000/svg",
  width: "100%",
  height: "100%",
} as const;

function DiamondShape() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="diamond-grad" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ff86f4" />
          <stop offset="55%" stopColor="#ee4dde" />
          <stop offset="100%" stopColor="#c731b2" />
        </radialGradient>
      </defs>
      <polygon
        points="20,38 38,16 70,16 90,40 80,76 50,92 20,76 10,42"
        fill="url(#diamond-grad)"
      />
      <polygon
        points="42,22 60,22 70,32"
        fill="#ffffff"
        opacity="0.55"
      />
    </svg>
  );
}

function StarShape() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="star-grad" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#ffe177" />
          <stop offset="55%" stopColor="#ffc233" />
          <stop offset="100%" stopColor="#e58a00" />
        </radialGradient>
      </defs>
      <polygon
        points="50,8 62,38 94,40 68,60 78,92 50,72 22,92 32,60 6,40 38,38"
        fill="url(#star-grad)"
      />
      <ellipse
        cx="44"
        cy="32"
        rx="6"
        ry="9"
        fill="#ffffff"
        opacity="0.7"
        transform="rotate(-20 44 32)"
      />
    </svg>
  );
}

function CircleShape() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="circle-grad" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#85e0ff" />
          <stop offset="55%" stopColor="#26b7ff" />
          <stop offset="100%" stopColor="#0a7bc1" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill="url(#circle-grad)" />
      <ellipse cx="36" cy="32" rx="9" ry="6" fill="#ffffff" opacity="0.65" />
      <circle cx="58" cy="28" r="2.5" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}

function HeartShape() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="heart-grad" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ff8a90" />
          <stop offset="55%" stopColor="#f0444f" />
          <stop offset="100%" stopColor="#a91723" />
        </radialGradient>
      </defs>
      <path
        d="M50 86 L14 52 C4 42 4 26 14 16 C24 6 38 8 46 18 L50 24 L54 18 C62 8 76 6 86 16 C96 26 96 42 86 52 Z"
        fill="url(#heart-grad)"
      />
      <path
        d="M22 22 C 28 14 38 14 42 22"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.55"
        fill="none"
      />
    </svg>
  );
}

function FlowerShape() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="flower-grad" cx="40%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#ffb1d9" />
          <stop offset="55%" stopColor="#ff6db1" />
          <stop offset="100%" stopColor="#c93a85" />
        </radialGradient>
      </defs>
      <g fill="url(#flower-grad)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="50"
            cy="22"
            rx="17"
            ry="24"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="11" fill="#ffd5e8" opacity="0.95" />
      <ellipse cx="46" cy="46" rx="4" ry="3" fill="#ffffff" opacity="0.75" />
    </svg>
  );
}

function SquareShape() {
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="square-grad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#5af18a" />
          <stop offset="55%" stopColor="#15c95b" />
          <stop offset="100%" stopColor="#0a8a3d" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="84" height="84" rx="14" fill="url(#square-grad)" />
      <rect x="68" y="22" width="6" height="14" rx="2" fill="#ffffff" opacity="0.65" />
      <rect x="14" y="14" width="22" height="6" rx="3" fill="#ffffff" opacity="0.35" />
    </svg>
  );
}

function HexagonShape() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="hex-grad" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffc080" />
          <stop offset="55%" stopColor="#ff8b2e" />
          <stop offset="100%" stopColor="#bf5400" />
        </radialGradient>
      </defs>
      <polygon
        points="20,30 50,12 80,30 80,70 50,88 20,70"
        fill="url(#hex-grad)"
      />
      <polygon points="32,22 50,16 60,22" fill="#ffffff" opacity="0.45" />
    </svg>
  );
}
