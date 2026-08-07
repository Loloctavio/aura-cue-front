import { useNavigate, Link } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../features/auth/auth.api";
import { setToken } from "../lib/auth";
import { ErrorText, Eyebrow, FieldLabel, Input, Muted, PrimaryButton, Spinner, Stack } from "../components/ui";

const schema = z.object({
  gmail: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const res = await login(values);
      setToken(res.access_token);
      nav("/dashboard");
    } catch (e: any) {
      setError("root", { message: e?.response?.data?.detail ?? "Login failed" });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
      }}
    >
      {/* ---- Brand panel ---- */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 40,
          padding: "clamp(24px, 4vw, 48px)",
          background:
            "linear-gradient(150deg, color-mix(in srgb, var(--panel-strong) 82%, var(--primary)) 0%, color-mix(in srgb, var(--panel-strong) 88%, var(--accent)) 100%)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: "var(--text)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: "-0.03em",
          }}
        >
          <img src="/icon.png" alt="" style={{ width: 28, height: 28, borderRadius: 8, objectFit: "cover" }} />
          AuraCue
        </Link>

        <div className="rise">
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            className="float-slow"
            style={{ width: "clamp(110px, 14vw, 160px)", height: "auto", marginBottom: 26 }}
          />
          <h1 className="display" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", maxWidth: 480 }}>
            Your queue
            <br />
            <span className="grad-text">missed you.</span>
          </h1>
          <Muted style={{ fontSize: 17, lineHeight: 1.7, maxWidth: 420, marginTop: 16 }}>
            Open saved playlists, generate a new draft, or export directly to Spotify from the same
            workspace.
          </Muted>
        </div>

        <div className="mono rise" style={{ color: "var(--muted)", display: "grid", gap: 8, ["--d" as string]: "140ms" }}>
          <span>01 · generate playlists from a single prompt</span>
          <span>02 · inspect which agents suggested each track</span>
          <span>03 · save and export to Spotify when ready</span>
        </div>
      </div>

      {/* ---- Form panel ---- */}
      <div style={{ display: "grid", placeItems: "center", padding: "clamp(24px, 4vw, 48px)" }}>
        <div className="rise" style={{ width: "min(400px, 100%)", ["--d" as string]: "100ms" }}>
          <Eyebrow>Welcome back</Eyebrow>
          <h1 className="display" style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)", marginTop: 14 }}>
            Log in
          </h1>
          <Muted style={{ lineHeight: 1.65 }}>Use the same credentials you registered with.</Muted>

          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 28 }}>
            <Stack style={{ gap: 18 }}>
              <div>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" placeholder="you@example.com" autoComplete="email" {...register("gmail")} />
                {errors.gmail && <ErrorText>{errors.gmail.message}</ErrorText>}
              </div>

              <div>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" placeholder="••••••••" type="password" autoComplete="current-password" {...register("password")} />
                {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
              </div>

              {"root" in errors && <ErrorText>{(errors as any).root?.message}</ErrorText>}

              <PrimaryButton disabled={isSubmitting} type="submit" style={{ width: "100%" }}>
                {isSubmitting && <Spinner />}
                {isSubmitting ? "Entering..." : "Log in →"}
              </PrimaryButton>

              <Muted style={{ margin: 0, textAlign: "center", fontSize: 14 }}>
                No account yet? <Link to="/register" style={{ fontWeight: 700 }}>Create one</Link>
              </Muted>
            </Stack>
          </form>
        </div>
      </div>
    </div>
  );
}
