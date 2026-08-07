import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register as registerApi } from "../features/auth/auth.api";
import { setToken } from "../lib/auth";
import { ErrorText, Eyebrow, FieldLabel, Input, Muted, PrimaryButton, Spinner, Stack } from "../components/ui";

const schema = z.object({
  username: z.string().min(2, "Username too short"),
  gmail: z.string().email("Invalid email"),
  password: z.string().min(12, "Use at least 12 characters").max(256, "Password is too long"),
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const res = await registerApi(values);
      setToken(res.access_token);
      nav("/dashboard");
    } catch (e: any) {
      setError("root", { message: e?.response?.data?.detail ?? "Register failed" });
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
            "linear-gradient(150deg, color-mix(in srgb, var(--panel-strong) 80%, var(--primary)) 0%, color-mix(in srgb, var(--panel-strong) 86%, var(--primary-2)) 100%)",
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
            Build your
            <br />
            <span className="grad-text">sound studio.</span>
          </h1>
          <Muted style={{ fontSize: 17, lineHeight: 1.7, maxWidth: 420, marginTop: 16 }}>
            Register to generate playlists, save drafts, inspect agent metadata, and export finished
            playlists to Spotify.
          </Muted>
        </div>

        <div className="mono rise" style={{ color: "var(--muted)", display: "grid", gap: 8, ["--d" as string]: "140ms" }}>
          <span>· personal library tied to your account</span>
          <span>· full agent transparency on every track</span>
          <span>· Spotify export when you connect later</span>
        </div>
      </div>

      {/* ---- Form panel ---- */}
      <div style={{ display: "grid", placeItems: "center", padding: "clamp(24px, 4vw, 48px)" }}>
        <div className="rise" style={{ width: "min(400px, 100%)", ["--d" as string]: "100ms" }}>
          <Eyebrow>New account</Eyebrow>
          <h1 className="display" style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)", marginTop: 14 }}>
            Create account
          </h1>
          <Muted style={{ lineHeight: 1.65 }}>Start generating and saving playlists in minutes.</Muted>

          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 28 }}>
            <Stack style={{ gap: 18 }}>
              <div>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" placeholder="yourname" autoComplete="username" {...register("username")} />
                {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
              </div>

              <div>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" placeholder="you@example.com" autoComplete="email" {...register("gmail")} />
                {errors.gmail && <ErrorText>{errors.gmail.message}</ErrorText>}
              </div>

              <div>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" placeholder="At least 12 characters" type="password" autoComplete="new-password" {...register("password")} />
                {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
              </div>

              {"root" in errors && <ErrorText>{(errors as any).root?.message}</ErrorText>}

              <PrimaryButton disabled={isSubmitting} type="submit" style={{ width: "100%" }}>
                {isSubmitting && <Spinner />}
                {isSubmitting ? "Creating..." : "Create account →"}
              </PrimaryButton>

              <Muted style={{ margin: 0, textAlign: "center", fontSize: 14 }}>
                Already registered? <Link to="/login" style={{ fontWeight: 700 }}>Log in</Link>
              </Muted>
            </Stack>
          </form>
        </div>
      </div>
    </div>
  );
}
