import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

type ButtonSize = 'sm' | 'md';

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type AnchorProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type NativeButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonProps = AnchorProps | NativeButtonProps;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800',
  secondary:
    'border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50',
  ghost:
    'border border-white/30 bg-white/10 text-white hover:bg-white/20',
  outline:
    'border-2 border-slate-300 bg-transparent text-slate-900 hover:border-slate-500',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
};

function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500',
    variantStyles[variant],
    sizeStyles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if ('href' in props) {
    return (
      <a className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
