import { LoginForm } from '@/components/auth/login-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}