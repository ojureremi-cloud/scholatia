import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import RegistrationForm from '@/components/security/RegistrationForm';

export default function RegisterPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Create your account"
          subtitle="Join Scholatia and build a trusted scholarly identity across the global research ecosystem."
        />
        <div className="mx-auto mt-10 max-w-2xl">
          <RegistrationForm />
        </div>
      </Container>
    </PageLayout>
  );
}
