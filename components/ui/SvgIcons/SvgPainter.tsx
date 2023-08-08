import { type FC } from "react";

export const SvgPainter: FC = () => {
  return (
    <svg className="pointer-events-none absolute h-0 w-0">
      <linearGradient id="myGradient" gradientTransform="rotate(75)">
        <stop stopColor="rgb(var(--primary-light))" offset="0%" />
        <stop stopColor="rgb(var(--secondary-light))" offset="100%" />
      </linearGradient>
      <linearGradient id="myGradientDark" gradientTransform="rotate(75)">
        <stop stopColor="rgb(var(--secondary-default))" offset="0%" />
        <stop stopColor="rgb(var(--primary-default))" offset="100%" />
      </linearGradient>
    </svg>
  );
};
