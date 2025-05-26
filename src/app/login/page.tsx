import LoginForm from '@/components/frontend/LoginForm';

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-md mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      <LoginForm />
    </div>
  );
}
