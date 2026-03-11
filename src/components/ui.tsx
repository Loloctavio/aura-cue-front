import type React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type PProps = React.HTMLAttributes<HTMLParagraphElement>;
type H2Props = React.HTMLAttributes<HTMLHeadingElement>;
type H1Props = React.HTMLAttributes<HTMLHeadingElement>;
type SpanProps = React.HTMLAttributes<HTMLSpanElement>;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Page({ children, style, ...props }: DivProps) {
  return (
    <div
      {...props}
      style={{
        width: "min(1200px, 100%)",
        margin: "clamp(16px, 3vw, 28px) auto clamp(30px, 5vw, 48px)",
        padding: "0 clamp(14px, 4vw, 24px)",
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
        gap: 14,
        flexWrap: "wrap",
        alignItems: "center",
        ...(style ?? {}),
      }}
    >
      {children}
    </div>
  );
}

export function Card({ children, style, ...props }: DivProps) {
  return (
    <div
      {...props}
      style={{
        background: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "clamp(16px, 3vw, 24px)",
        boxShadow: "var(--shadow)",
        backdropFilter: "blur(18px)",
        ...(style ?? {}),
      }}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, style, ...props }: H2Props) {
  return (
    <h2 {...props} style={{ margin: 0, fontSize: 20, lineHeight: 1.15, ...(style ?? {}) }}>
      {children}
    </h2>
  );
}

export function H1({ children, style, ...props }: H1Props) {
  return (
    <h1
      {...props}
      style={{
        margin: 0,
        fontSize: "clamp(2.3rem, 8vw, 4.4rem)",
        lineHeight: 0.96,
        fontWeight: 800,
        ...(style ?? {}),
      }}
    >
      {children}
    </h1>
  );
}

export function Muted({ children, style, ...props }: PProps) {
  return (
    <p {...props} style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 15, ...(style ?? {}) }}>
      {children}
    </p>
  );
}

export function Divider({ style, ...props }: DivProps) {
  return (
    <div
      {...props}
      style={{ height: 1, background: "var(--border)", margin: "16px 0", ...(style ?? {}) }}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { style, onFocus, onBlur, ...rest } = props;

  return (
    <input
      {...rest}
      style={{
        width: "100%",
        minHeight: 50,
        padding: "0 16px",
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "var(--input-bg)",
        color: "var(--text)",
        outline: "none",
        fontSize: 15,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
        transition: "box-shadow 160ms ease, border-color 160ms ease, transform 160ms ease",
        ...(style ?? {}),
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--primary)";
        e.currentTarget.style.boxShadow = "0 0 0 4px var(--ring)";
        onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
        onBlur?.(e);
      }}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { style, onFocus, onBlur, ...rest } = props;

  return (
    <textarea
      {...rest}
      style={{
        width: "100%",
        padding: "14px 16px",
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "var(--input-bg)",
        color: "var(--text)",
        outline: "none",
        resize: "vertical",
        fontSize: 15,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
        transition: "box-shadow 160ms ease, border-color 160ms ease, transform 160ms ease",
        ...(style ?? {}),
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--primary)";
        e.currentTarget.style.boxShadow = "0 0 0 4px var(--ring)";
        onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
        onBlur?.(e);
      }}
    />
  );
}

export function Button({ children, style, ...props }: ButtonProps) {
  const disabled = props.disabled;
  return (
    <button
      {...props}
      style={{
        minHeight: 46,
        padding: "0 18px",
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: disabled ? "rgba(0,0,0,0.05)" : "color-mix(in srgb, var(--panel-strong) 88%, transparent)",
        color: "var(--text)",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 15,
        fontWeight: 600,
        boxShadow: disabled ? "none" : "0 10px 24px rgba(20, 26, 42, 0.06)",
        transition: "transform 120ms ease, border-color 140ms ease, box-shadow 140ms ease",
        ...(style ?? {}),
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(1px)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ children, style, ...props }: ButtonProps) {
  const disabled = props.disabled;
  return (
    <button
      {...props}
      style={{
        minHeight: 46,
        padding: "0 20px",
        borderRadius: 16,
        border: "1px solid transparent",
        background: disabled ? "rgba(0,0,0,0.05)" : "linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%)",
        color: disabled ? "var(--muted)" : "var(--primary-contrast)",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 15,
        fontWeight: 700,
        boxShadow: disabled ? "none" : "0 16px 28px rgba(236, 111, 69, 0.25)",
        transition: "filter 140ms ease, transform 120ms ease, box-shadow 140ms ease",
        ...(style ?? {}),
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(1px)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, style, ...props }: ButtonProps) {
  const disabled = props.disabled;
  return (
    <button
      {...props}
      style={{
        minHeight: 46,
        padding: "0 18px",
        borderRadius: 16,
        border: "1px solid rgba(255, 0, 0, 0.2)",
        background: disabled ? "rgba(255,0,0,0.05)" : "rgba(255,0,0,0.08)",
        color: "var(--danger)",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 15,
        fontWeight: 700,
        boxShadow: disabled ? "none" : "0 10px 22px rgba(203, 70, 61, 0.1)",
        ...(style ?? {}),
      }}
    >
      {children}
    </button>
  );
}

export function Pill({ children, style, ...props }: SpanProps) {
  return (
    <span
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        minHeight: 34,
        padding: "0 12px",
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: "color-mix(in srgb, var(--panel-strong) 78%, transparent)",
        color: "var(--muted)",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.01em",
        ...(style ?? {}),
      }}
    >
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
