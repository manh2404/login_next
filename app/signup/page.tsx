"use client";

import { SignupForm } from "@/components/signup-form";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const handleRegister = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Đăng ký thất bại");
      return;
    }

    alert("Đăng ký thành công");
    router.push("/"); // về trang đăng nhập
  };

  return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm onRegister={handleRegister} />
        </div>
      </div>
  );
}
