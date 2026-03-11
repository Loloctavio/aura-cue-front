import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register as registerApi } from "../features/auth/auth.api";
import { setToken } from "../lib/auth";
import { Card, H1, Muted, Page, PrimaryButton, Input, ErrorText, Stack, Row, Pill } from "../components/ui";

const schema = z.object({
  username: z.string().min(2, "Username too short"),
  gmail: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 chars"),
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
                "linear-gradient(135deg, color-mix(in srgb, var(--panel-strong) 86%, rgba(236, 111, 69, 0.12)) 0%, color-mix(in srgb, var(--panel-strong) 86%, rgba(245, 188, 114, 0.1)) 100%)",
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
            <Pill style={{ width: "fit-content", marginBottom: 14 }}>Ready to build</Pill>
            <H1>Create your workspace</H1>
            <Muted style={{ fontSize: "clamp(16px, 4vw, 20px)", lineHeight: 1.7 }}>
              Register to generate playlists, save drafts, inspect agent metadata, and export finished playlists to
              Spotify.
            </Muted>
            <Card style={{ marginTop: 22, padding: 18 }}>
              <Stack style={{ gap: 10 }}>
                <div>
                  <b>Personal library</b>
                  <Muted>All saved playlists stay attached to your account.</Muted>
                </div>
                <div>
                  <b>Agent transparency</b>
                  <Muted>You can inspect which specialist proposed each track.</Muted>
                </div>
                <div>
                  <b>Spotify export</b>
                  <Muted>Connect later from profile settings when you want direct playlist creation.</Muted>
                </div>
              </Stack>
            </Card>
          </Card>

          <Card style={{ padding: "clamp(22px, 4vw, 34px)" }}>
            <Row style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div>
                <H1 style={{ fontSize: "clamp(2rem, 6vw, 3.3rem)" }}>Register</H1>
                <Muted style={{ lineHeight: 1.65 }}>Create an account to generate and save playlists.</Muted>
              </div>

              <Pill>New account</Pill>
            </Row>

            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 22 }}>
              <Stack style={{ gap: 14 }}>
                <div>
                  <Input placeholder="Username" autoComplete="username" {...register("username")} />
                  {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
                </div>

                <div>
                  <Input placeholder="Email" autoComplete="email" {...register("gmail")} />
                  {errors.gmail && <ErrorText>{errors.gmail.message}</ErrorText>}
                </div>

                <div>
                  <Input placeholder="Password" type="password" autoComplete="new-password" {...register("password")} />
                  {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
                </div>

                {"root" in errors && <ErrorText>{(errors as any).root?.message}</ErrorText>}

                <Row style={{ marginTop: 6 }}>
                  <PrimaryButton disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Creating..." : "Create"}
                  </PrimaryButton>

                  <Muted style={{ margin: 0 }}>
                    Already? <Link to="/login">Login</Link>
                  </Muted>
                </Row>
              </Stack>
            </form>
          </Card>
        </div>
      </div>
    </Page>
  );
}
