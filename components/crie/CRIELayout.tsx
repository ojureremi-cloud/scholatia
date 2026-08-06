'use client';

import type { ReactNode } from 'react';
import { PageLayout } from '@/components/layout';
import Container from '@/components/ui/Container';
import { CRIENavigation } from './CRIENavigation';
import { CRIESidebar } from './CRIESidebar';

type CRIELayoutProps = {
  children: ReactNode;
  showSidebar?: boolean;
  sidebarSections?: string[];
};

export function CRIELayout({ children, showSidebar = true, sidebarSections }: CRIELayoutProps) {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <CRIENavigation />
        <div className="mt-10">
          {showSidebar ? (
            <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <CRIESidebar sections={sidebarSections} />
              </aside>
              <div className="min-w-0">{children}</div>
            </div>
          ) : (
            children
          )}
        </div>
      </Container>
    </PageLayout>
  );
}
