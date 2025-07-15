import { LoginForm } from '../features/login-form';

export default function ClientLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <LoginForm role="client" />
    </div>
  );
}
