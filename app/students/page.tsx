// app/page.tsx
import StudentCrudClient from "@/components/student-crud-client";

export default function Page() {
    return (
        <main className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Bảo An HomeStay</h1>
            <StudentCrudClient />
        </main>
    );
}
