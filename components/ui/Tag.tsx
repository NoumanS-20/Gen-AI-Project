import { ReactNode } from 'react';
import Card from './Card';

interface TagProps {
  children: ReactNode;
  onRemove?: () => void;
}

export default function Tag({ children, onRemove }: TagProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: 'oklch(0.62 0.22 258 / 0.14)',
        color: 'oklch(0.72 0.22 258)',
        padding: '4px 10px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'Figtree, sans-serif',
      }}
    >
      {children}
      {onRemove && (
        <span
          onClick={onRemove}
          style={{
            cursor: 'pointer',
            opacity: 0.6,
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          ×
        </span>
      )}
    </span>
  );
}
