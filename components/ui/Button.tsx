import { useState, ReactNode } from 'react';

interface ButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  icon,
  style,
}: ButtonProps) {
  const [hov, setHov] = useState(false);

  const variantStyles = {
    primary: {
      background: hov ? 'oklch(0.72 0.22 258)' : 'oklch(0.62 0.22 258)',
      color: '#fff',
      boxShadow: hov ? '0 0 20px oklch(0.62 0.22 258 / 0.35)' : 'none',
    },
    secondary: {
      background: hov ? '#1e1e26' : '#18181c',
      color: '#c8c8d8',
      border: '1px solid #2a2a34',
    },
    ghost: {
      background: hov ? '#1a1a22' : 'transparent',
      color: hov ? '#e0e0f0' : '#888898',
    },
    danger: {
      background: hov ? 'oklch(0.62 0.2 25 / 0.2)' : 'oklch(0.62 0.2 25 / 0.12)',
      color: 'oklch(0.62 0.2 25)',
      border: '1px solid oklch(0.62 0.2 25 / 0.25)',
    },
  };

  const sizeStyles = {
    sm: { fontSize: 12, padding: '5px 12px' },
    md: { fontSize: 13, padding: '8px 16px' },
    lg: { fontSize: 15, padding: '11px 22px' },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontFamily: 'Figtree, sans-serif',
        fontWeight: 500,
        border: variant === 'secondary' || variant === 'danger' ? '1px solid' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: 8,
        transition: 'all 0.15s ease',
        outline: 'none',
        opacity: disabled ? 0.45 : 1,
        whiteSpace: 'nowrap',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
}
