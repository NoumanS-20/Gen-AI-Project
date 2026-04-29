import { ReactNode } from 'react';

const colors = {
  default: { bg: '#1e1e26', text: '#a0a0b4' },
  accent: { bg: 'oklch(0.62 0.22 258 / 0.14)', text: 'oklch(0.72 0.22 258)' },
  green: { bg: 'oklch(0.68 0.18 155 / 0.14)', text: 'oklch(0.68 0.18 155)' },
  amber: { bg: 'oklch(0.75 0.16 75 / 0.14)', text: 'oklch(0.75 0.16 75)' },
  red: { bg: 'oklch(0.62 0.2 25 / 0.14)', text: 'oklch(0.62 0.2 25)' },
};

interface BadgeProps {
  children: ReactNode;
  color?: keyof typeof colors;
  style?: React.CSSProperties;
}

export default function Badge({ children, color = 'default', style }: BadgeProps) {
  const c = colors[color];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 9px',
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.03em',
        background: c.bg,
        color: c.text,
        fontFamily: 'Figtree, sans-serif',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
