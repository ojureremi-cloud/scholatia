import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import LoginForm from '@/components/security/LoginForm';

export default function LoginPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Sign in"
          subtitle="Access your Scholatia account and scholarly workspace."
        />
        <div className="mx-auto mt-10 max-w-2xl">
          <LoginForm />
        </div>
      </Container>
    </PageLayout>
  );
}
