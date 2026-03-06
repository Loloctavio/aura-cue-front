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
      nav("/");
    } catch (e: any) {
      setError("root", { message: e?.response?.data?.detail ?? "Register failed" });
    }
  };

  return (
    <Page style={{ minHeight: "calc(100vh - 20px)", display: "grid", placeItems: "center" }}>
      <div style={{ width: "min(610px, 100%)" }}>
        <Card style={{ padding: 24 }}>
          <Row style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>
              <H1>Register</H1>
              <Muted>Create an account to generate and save playlists.</Muted>
            </div>

            <Pill>Ready to build</Pill>
          </Row>

          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 18 }}>
            <Stack style={{ gap: 12 }}>
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

              <Row style={{ marginTop: 4 }}>
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
    </Page>
  );
}
