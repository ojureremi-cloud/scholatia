export type AuthFeature = {
  signInUrl: string;
  signUpUrl: string;
};

export const authFeature: AuthFeature = {
  signInUrl: '/login',
  signUpUrl: '/register',
};

export * from '@/lib/auth';
