import type React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type PProps = React.HTMLAttributes<HTMLParagraphElement>;
type H2Props = React.HTMLAttributes<HTMLHeadingElement>;
type H1Props = React.HTMLAttributes<HTMLHeadingElement>;
type SpanProps = React.HTMLAttributes<HTMLSpanElement>;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Page({ children, style, className, ...props }: DivProps) {
  return (
    <div
      {...props}
      className={cx("fade-in", className)}
      style={{
        width: "min(1160px, 100%)",
        margin: "0 auto",
        padding: "clamp(22px, 4vw, 44px) clamp(16px, 4vw, 32px) clamp(30px, 5vw, 48px)",
        ...(style ?? {}),
      }}
    >
      {children}
    </div>
  );
}

export function Stack({ children, style, ...props }: DivProps) {
  return (
    <div {...props} style={{ display: "grid", gap: 16, ...(style ?? {}) }}>
      {children}
    </div>
  );
}

export function Row({ children, style, ...props }: DivProps) {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
        ...(style ?? {}),
      }}
    >
      {children}
    </div>
  );
}

export function Card({
  children,
  className,
  hover,
  dashed,
  tinted,
  ...props
}: DivProps & { hover?: boolean; dashed?: boolean; tinted?: boolean }) {
  return (
    <div
      {...props}
      className={cx(
        "card",
        hover && "card--hover",
        dashed && "card--dashed",
        tinted && "card--tinted",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, style, ...props }: H2Props) {
  return (
    <h2
      {...props}
      style={{ margin: 0, fontSize: 19, fontWeight: 700, lineHeight: 1.2, ...(style ?? {}) }}
    >
      {children}
    </h2>
  );
}

export function H1({ children, className, style, ...props }: H1Props) {
  return (
    <h1
      {...props}
      className={cx("display", className)}
      style={{ fontSize: "clamp(2.1rem, 6vw, 3.6rem)", ...(style ?? {}) }}
    >
      {children}
    </h1>
  );
}

/** Small uppercase mono section label with a leading rule. */
export function Eyebrow({ children, className, ...props }: PProps) {
  return (
    <p {...props} className={cx("eyebrow", className)}>
      {children}
    </p>
  );
}

export function Muted({ children, style, ...props }: PProps) {
  return (
    <p {...props} style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 15, ...(style ?? {}) }}>
      {children}
    </p>
  );
}

export function Divider({ className, ...props }: DivProps) {
  return <div {...props} className={cx("hairline", className)} />;
}

/** Uppercase mono label rendered above a form field. */
export function FieldLabel({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label {...props} className={cx("field-label", className)}>
      {children}
    </label>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx("field", className)} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx("field", className)} />;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button {...props} className={cx("btn", className)}>
      {children}
    </button>
  );
}

export function PrimaryButton({ children, className, ...props }: ButtonProps) {
  return (
    <button {...props} className={cx("btn", "btn--primary", className)}>
      {children}
    </button>
  );
}

export function GhostButton({ children, className, ...props }: ButtonProps) {
  return (
    <button {...props} className={cx("btn", "btn--ghost", className)}>
      {children}
    </button>
  );
}

export function DangerButton({ children, className, ...props }: ButtonProps) {
  return (
    <button {...props} className={cx("btn", "btn--danger", className)}>
      {children}
    </button>
  );
}

/** Mono metadata chip. tone: "ok" (accent) | "warm" (primary) | default muted. */
export function Chip({
  children,
  className,
  tone,
  ...props
}: SpanProps & { tone?: "ok" | "warm" }) {
  return (
    <span
      {...props}
      className={cx("chip", tone === "ok" && "chip--ok", tone === "warm" && "chip--warm", className)}
    >
      {children}
    </span>
  );
}

/** Kept for legacy pages; renders as a Chip. */
export function Pill({ children, className, ...props }: SpanProps) {
  return (
    <span {...props} className={cx("chip", className)}>
      {children}
    </span>
  );
}

export function ErrorText({ children, style, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <small {...props} style={{ color: "var(--danger)", fontSize: 13, ...(style ?? {}) }}>
      {children}
    </small>
  );
}

/** Small circular loader, sized to the surrounding text. */
export function Spinner({ className, ...props }: SpanProps) {
  return <span {...props} role="status" aria-label="Loading" className={cx("spinner", className)} />;
}

/** Shimmering placeholder block. Size it with the style prop. */
export function Skeleton({ className, style, ...props }: DivProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx("skeleton", className)}
      style={{ height: 14, ...(style ?? {}) }}
    />
  );
}

/** Animated music equalizer bars — the app's signature loader. */
export function Equalizer({ small, className, ...props }: SpanProps & { small?: boolean }) {
  return (
    <span {...props} role="status" aria-label="Loading" className={cx("eq", small && "eq--sm", className)}>
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/** Card-shaped skeleton used while a page section loads. */
export function SkeletonCard({ lines = 3, style, ...props }: DivProps & { lines?: number }) {
  return (
    <Card {...props} style={style}>
      <Skeleton style={{ width: "38%", height: 20, marginBottom: 14 }} />
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} style={{ width: `${88 - i * 14}%`, height: 12, marginBottom: 10 }} />
      ))}
    </Card>
  );
}
