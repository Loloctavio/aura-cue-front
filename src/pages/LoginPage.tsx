import { useNavigate, Link } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../features/auth/auth.api";
import { setToken } from "../lib/auth";
import { Card, H1, Muted, Page, PrimaryButton, Input, ErrorText, Stack, Row, Pill } from "../components/ui";

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
    <Page style={{ minHeight: "calc(100vh - 20px)", display: "grid", placeItems: "center" }}>
      <Link
        to="/"
        aria-label="Back to home"
        style={{
          position: "fixed",
          top: 18,
          left: 18,
          width: 44,
          height: 44,
          borderRadius: 999,
          border: "1px solid var(--border)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 700,
          background: "var(--panel)",
          color: "var(--text)",
          boxShadow: "var(--shadow-strong)",
          zIndex: 30,
        }}
      >
        ←
      </Link>
      <div style={{ width: "min(980px, 100%)" }}>
        <div
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            alignItems: "stretch",
          }}
        >
          <Card
            style={{
              padding: "clamp(22px, 4vw, 34px)",
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--panel-strong) 86%, rgba(37, 87, 214, 0.1)) 0%, color-mix(in srgb, var(--panel-strong) 86%, rgba(236, 111, 69, 0.1)) 100%)",
            }}
          >
            <img
              src="/logo.png"
              alt="AuraCue logo"
              style={{
                width: "clamp(120px, 24vw, 190px)",
                height: "auto",
                display: "block",
                marginBottom: 12,
              }}
            />
            <Muted style={{ fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>Return to your queue</Muted>
            <H1 style={{ marginTop: 10 }}>Welcome back</H1>
            <Muted style={{ fontSize: "clamp(16px, 4.3vw, 20px)", lineHeight: 1.7 }}>
              Open your saved playlists, generate a new draft, or export directly to Spotify from the same workspace.
            </Muted>
            <Card style={{ marginTop: 22, padding: 18 }}>
              <Muted style={{ marginTop: 0 }}>Inside your account</Muted>
              <Stack style={{ gap: 10, marginTop: 12 }}>
                <Row>
                  <span style={{ fontSize: 22 }}>01</span>
                  <Muted style={{ margin: 0 }}>Generate playlists from a single prompt.</Muted>
                </Row>
                <Row>
                  <span style={{ fontSize: 22 }}>02</span>
                  <Muted style={{ margin: 0 }}>Inspect which agents suggested each track.</Muted>
                </Row>
                <Row>
                  <span style={{ fontSize: 22 }}>03</span>
                  <Muted style={{ margin: 0 }}>Save and export to Spotify when you are ready.</Muted>
                </Row>
              </Stack>
            </Card>
          </Card>

          <Card style={{ padding: "clamp(22px, 4vw, 34px)" }}>
            <Pill style={{ width: "fit-content", marginBottom: 16 }}>Log in</Pill>
            <H1 style={{ fontSize: "clamp(2rem, 6vw, 3.3rem)" }}>Account access</H1>
            <Muted style={{ fontSize: 17, lineHeight: 1.65 }}>Use the same credentials you registered with.</Muted>

            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 24 }}>
              <Stack style={{ gap: 14 }}>
                <div>
                  <Input placeholder="Email" autoComplete="email" {...register("gmail")} />
                  {errors.gmail && <ErrorText>{errors.gmail.message}</ErrorText>}
                </div>

                <div>
                  <Input placeholder="Password" type="password" autoComplete="current-password" {...register("password")} />
                  {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
                </div>

                {"root" in errors && <ErrorText>{(errors as any).root?.message}</ErrorText>}

                <Row style={{ marginTop: 6 }}>
                  <PrimaryButton disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Entering..." : "Login"}
                  </PrimaryButton>
                  <Link to="/register" style={{ alignSelf: "center", fontWeight: 700 }}>
                    Create account
                  </Link>
                </Row>
              </Stack>
            </form>
          </Card>
        </div>
      </div>
    </Page>
  );
}
