import { LoginForm } from '../../components/login-form/login-form';

export default function LawyerLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <LoginForm role="lawyer" />
    </div>
  );
}
