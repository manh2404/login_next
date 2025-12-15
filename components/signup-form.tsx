"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type SignupFormProps = React.ComponentProps<"div"> & {
  onRegister: (name: string, email: string, password: string) => Promise<void> | void;
};

export function SignupForm({ className, onRegister, ...props }: SignupFormProps) {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirm = String(formData.get("confirm-password") || "");

    if (!name || !email || !password || !confirm) {
      alert("Vui lòng nhập đầy đủ thông tin");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      alert("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    try {
      await onRegister(name, email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>Enter your email below to create your account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input id="name" name="name" type="text" placeholder="John Doe" required />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </Field>

                <Field>
                  <Field className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input id="password" name="password" type="password" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                      <Input
                          id="confirm-password"
                          name="confirm-password"
                          type="password"
                          required
                      />
                    </Field>
                  </Field>
                  <FieldDescription>Must be at least 6 characters long.</FieldDescription>
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Đang tạo tài khoản..." : "Create Account"}
                  </Button>

                  <FieldDescription className="text-center">
                    Already have an account? <a href="/">Sign in</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
  );
}
