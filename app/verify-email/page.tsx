import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { AuthServiceError, verifyEmail } from '@/lib/auth/service';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === 'string' ? params.token : '';
  const email = typeof params.email === 'string' ? params.email : undefined;

  let verified = false;
  let error: string | null = null;

  if (!token) {
    error = 'This verification link is invalid. Please use the link from your verification email.';
  } else {
    try {
      await verifyEmail(token, email);
      verified = true;
    } catch (cause) {
      if (cause instanceof AuthServiceError) {
        error = cause.message;
      } else {
        error = 'Something went wrong while verifying your email. Please try again.';
      }
    }
  }

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Email verification"
          subtitle="Confirm your email address to activate your Scholatia account."
        />
        <div className="mx-auto mt-10 max-w-2xl">
          {verified ? (
            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
              <Alert
                variant="success"
                title="Email verified"
                description="Your email address has been verified and your account is now active. You can sign in to Scholatia."
              />
              <Button href="/login" className="w-full">
                Sign in
              </Button>
            </div>
          ) : (
            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
              <Alert variant="danger" title="Verification failed" description={error ?? 'Unknown error.'} />
              <Button href="/register" variant="secondary" className="w-full">
                Create an account
              </Button>
            </div>
          )}
        </div>
      </Container>
    </PageLayout>
  );
}
