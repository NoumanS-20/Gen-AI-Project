import { useState, ReactNode } from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  style?: React.CSSProperties;
  icon?: ReactNode;
  label?: string;
  hint?: string;
  error?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  style,
  icon,
  label,
  hint,
  error,
  onKeyDown,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? 'oklch(0.65 0.22 25)'
    : focused
    ? 'oklch(0.62 0.22 258)'
    : '#232329';

  const glowShadow = error
    ? '0 0 0 3px oklch(0.65 0.22 25 / 0.12)'
    : focused
    ? '0 0 0 3px oklch(0.62 0.22 258 / 0.12)'
    : 'none';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: '#888898',
            fontFamily: 'Figtree, sans-serif',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: 12,
              color: '#55556a',
              display: 'flex',
            }}
          >
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          style={{
            width: '100%',
            padding: icon ? '10px 14px 10px 38px' : '10px 14px',
            background: '#111114',
            border: `1px solid ${borderColor}`,
            borderRadius: 8,
            color: '#e8e8f4',
            fontSize: 13,
            fontFamily: 'Figtree, sans-serif',
            outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            boxSizing: 'border-box',
            boxShadow: glowShadow,
            ...style,
          }}
        />
      </div>
      {hint && (
        <span
          style={{
            fontSize: 11,
            color: '#55556a',
            fontFamily: 'Figtree, sans-serif',
          }}
        >
          {hint}
        </span>
      )}
    </div>
  );
}
