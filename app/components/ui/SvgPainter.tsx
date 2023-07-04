import type { FC } from "react";

import { type IconType } from "react-icons/lib";

interface SvgPainterWithIconProps {
  className?: string;
  textSize: string;
  Icon: IconType;
}

export const SvgPainterWithIcon: FC<SvgPainterWithIconProps> = ({
  className,
  textSize,
  Icon,
}) => {
  return (
    <svg className={textSize} width="1em" height="1em">
      <linearGradient id="myGradient" gradientTransform="rotate(75)">
        <stop stopColor="rgb(var(--primary-light))" offset="0%" />
        <stop stopColor="rgb(var(--secondary-light))" offset="100%" />
      </linearGradient>
      <linearGradient id="myGradientDark" gradientTransform="rotate(75)">
        <stop stopColor="rgb(var(--secondary-default))" offset="0%" />
        <stop stopColor="rgb(var(--primary-default))" offset="100%" />
      </linearGradient>
      <Icon
        className={
          textSize +
          " fill-[url(#myGradientDark)] dark:fill-[url(#myGradient)] " +
          (className ?? "")
        }
      />
    </svg>
  );
};

interface SvgPainterProps {
  children: React.ReactNode;
  className?: string;
}

export const SvgPainter: FC<SvgPainterProps> = ({ children, className }) => {
  return (
    <svg className={className}>
      <linearGradient id="myGradient" gradientTransform="rotate(75)">
        <stop stopColor="rgb(var(--primary-light))" offset="0%" />
        <stop stopColor="rgb(var(--secondary-light))" offset="100%" />
      </linearGradient>
      <linearGradient id="myGradientDark" gradientTransform="rotate(75)">
        <stop stopColor="rgb(var(--secondary-default))" offset="0%" />
        <stop stopColor="rgb(var(--primary-default))" offset="100%" />
      </linearGradient>
      {children}
    </svg>
  );
};
