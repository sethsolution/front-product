import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  // si hay usuario logueado, redirigir a la página de productos
  return (
    <main className="container mx-auto py-10 px-4">
      <LoginForm />
    </main>
  );
}
