import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Button.module.css";

export type ButtonVariant =
  /** Solid teal – the main action. */
  | "primary"
  /** White with a grey border. */
  | "secondary"
  /** Solid clay – urgent / social calls to action. */
  | "accent"
  /** White fill on dark cards. */
  | "inverse"
  /** Teal outline on white, e.g. "Send a nudge". */
  | "outline"
  /** Teal tint with teal border, e.g. "Save trip to wishlist". */
  | "tint"
  /** Small grey-bordered pill, e.g. like / reply. */
  | "pill";

/** Heights: sm 40, md 44, lg 48, xl 56. */
export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the container width. */
  block?: boolean;
  /** Leading icon. */
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

function classes({ variant = "primary", size = "md", block, className }: CommonProps) {
  return cx(styles.button, styles[variant], styles[size], block && styles.block, className);
}

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant, size, block, icon, children, className, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={classes({ variant, size, block, className })} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export type ButtonLinkProps = CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">;

export function ButtonLink({ variant, size, block, icon, children, className, ...rest }: ButtonLinkProps) {
  return (
    <Link className={classes({ variant, size, block, className })} {...rest}>
      {icon}
      {children}
    </Link>
  );
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required accessible name. */
  "aria-label": string;
  shape?: "square" | "circle";
  /** Square side in px (default 44). */
  dimension?: number;
  /** Translucent white fill for use over media. */
  overlay?: boolean;
}

export function IconButton({ shape = "square", dimension = 44, overlay, className, style, type = "button", ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.iconButton, shape === "circle" && styles.circle, overlay && styles.overlay, className)}
      style={{ width: dimension, height: dimension, ...style }}
      {...rest}
    />
  );
}
