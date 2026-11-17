import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Card.module.css";

export type CardTone =
  /** White with hairline border (default). */
  | "surface"
  /** Dark ink background, white text. */
  | "dark"
  /** Clay tint, for social prompts ("Meet travellers"). */
  | "accent"
  /** Teal tint. */
  | "primary"
  /** Inset panel inside another card. */
  | "muted";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** When rendering as a link (`as={Link}` or `as="a"`). */
  href?: string;
  tone?: CardTone;
  /** Inner padding: sm 14, md 18, lg 22, xl 24, 2xl 28. */
  padding?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  /** Corner radius: md 14, lg 18, xl 20, 2xl 24. */
  radius?: "md" | "lg" | "xl" | "2xl";
  /** Vertical gap between children (px). */
  gap?: number;
  /** Dashed border for empty states. */
  dashed?: boolean;
  children?: ReactNode;
}

export function Card({
  as: Tag = "div",
  tone = "surface",
  padding = "md",
  radius = "xl",
  gap,
  dashed,
  className,
  style,
  children,
  ...rest
}: CardProps) {
  const s: CSSProperties = gap !== undefined ? { gap, ...style } : style ?? {};
  return (
    <Tag
      className={cx(
        styles.card,
        styles[`tone_${tone}`],
        styles[`pad_${padding}`],
        styles[`radius_${radius}`],
        dashed && styles.dashed,
        className,
      )}
      style={s}
      {...rest}
    >
      {children}
    </Tag>
  );
}
