import { useNavigate, Link } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../features/auth/auth.api";
import { setToken } from "../lib/auth";
import { Card, H1, Muted, Page, PrimaryButton, Input, ErrorText, Stack, Row } from "../components/ui";

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
      nav("/");
    } catch (e: any) {
      setError("root", { message: e?.response?.data?.detail ?? "Login failed" });
    }
  };

  return (
    <Page style={{ minHeight: "calc(100vh - 20px)", display: "grid", placeItems: "center" }}>
      <div style={{ width: "min(580px, 100%)" }}>
        <Card style={{ padding: 24 }}>
          <H1>Welcome back</H1>
          <Muted style={{ fontSize: "clamp(16px, 4.3vw, 20px)" }}>Build playlists generated from your prompt.</Muted>

          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
            <Stack style={{ gap: 12 }}>
              <div>
                <Input placeholder="Email" autoComplete="email" {...register("gmail")} />
                {errors.gmail && <ErrorText>{errors.gmail.message}</ErrorText>}
              </div>

              <div>
                <Input placeholder="Password" type="password" autoComplete="current-password" {...register("password")} />
                {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
              </div>

              {"root" in errors && <ErrorText>{(errors as any).root?.message}</ErrorText>}

              <Row style={{ marginTop: 4 }}>
                <PrimaryButton disabled={isSubmitting} type="submit">
                  {isSubmitting ? "Entering..." : "Login"}
                </PrimaryButton>
                <Link to="/register" style={{ alignSelf: "center", fontWeight: 600 }}>
                  Create account
                </Link>
              </Row>
            </Stack>
          </form>
        </Card>
      </div>
    </Page>
  );
}
