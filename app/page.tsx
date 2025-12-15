'use client'
import { LoginForm } from "@/components/login-form"
import {useRouter} from "next/navigation";

export default function Page() {
    const route = useRouter()
    const handleLogin = async (email: string, password: string) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        });
        const data = await res.json();

        if (!res.ok){
            alert(data.message || " đăng nhập thất bại")
        }else {
            alert(data.message);
            route.push("/students");
        }

    }
  return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm onLogin ={handleLogin} />
        </div>
      </div>
  )
}
