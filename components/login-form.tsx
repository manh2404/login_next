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

type LoginFormProps = React.ComponentProps<"div"> & {
    onLogin: (email: string, password: string) => Promise<void> | void;
};

export function LoginForm({ className, onLogin, ...props }: LoginFormProps) {
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");

        try {
            await onLogin(email, password);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"          // ✅ thêm name để FormData lấy được
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </Field>

                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    name="password"       // ✅ thêm name
                                    type="password"
                                    required
                                />
                            </Field>

                            <Field>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? "Logging in..." : "Login"}
                                </Button>

                                <Button variant="outline" type="button" className="w-full">
                                    Login with Google
                                </Button>

                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <a href="/signup">Sign up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
