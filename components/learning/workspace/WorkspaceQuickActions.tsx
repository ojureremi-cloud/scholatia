import Button from '@/components/ui/Button';
import { coursesUrl, homeUrl, readingUrl, workspaceUrl } from '../format';

export function WorkspaceQuickActions() {
  return (
    <section className="flex flex-wrap gap-3">
      <Button href={workspaceUrl()} variant="primary">
        Resume learning
      </Button>
      <Button href={readingUrl()} variant="secondary">
        📚 Reading workspace
      </Button>
      <Button href={coursesUrl()} variant="secondary">
        📘 Browse courses
      </Button>
      <Button href={homeUrl()} variant="secondary">
        🏠 Student home
      </Button>
    </section>
  );
}
