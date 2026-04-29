interface SpinnerProps {
  size?: number;
  color?: string;
}

export default function Spinner({ size = 20, color }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke={color || '#232329'}
        strokeWidth="2.5"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        fill="none"
        stroke={color || 'oklch(0.62 0.22 258)'}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
