import AuthForm from "../components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="gradient-page min-h-screen flex items-center justify-center px-4 py-12">
      <AuthForm mode="login" />
    </div>
  );
}
