import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import ForgotPasswordForm from '@/components/security/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Forgot password"
          subtitle="Recover access to your Scholatia account."
        />
        <div className="mx-auto mt-10 max-w-2xl">
          <ForgotPasswordForm />
        </div>
      </Container>
    </PageLayout>
  );
}
