import { useState, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, style, onClick, hover = false }: CardProps) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#111114',
        border: `1px solid ${hov && hover ? '#2e2e3a' : '#1e1e26'}`,
        borderRadius: 12,
        padding: 20,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hov && hover ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
