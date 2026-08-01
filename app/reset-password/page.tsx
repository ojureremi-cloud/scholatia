import React from 'react';
import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import ResetPasswordForm from '@/components/security/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Reset password"
          subtitle="Choose a new password for your Scholatia account."
        />
        <div className="mx-auto mt-10 max-w-2xl">
          <React.Suspense fallback={null}>
            <ResetPasswordForm />
          </React.Suspense>
        </div>
      </Container>
    </PageLayout>
  );
}
