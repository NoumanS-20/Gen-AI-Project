interface AvatarProps {
  name: string;
  size?: number;
}

export default function Avatar({ name, size = 32 }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'oklch(0.62 0.22 258 / 0.14)',
        border: '1px solid oklch(0.62 0.22 258 / 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'oklch(0.72 0.22 258)',
        fontSize: size * 0.35,
        fontWeight: 700,
        fontFamily: 'Space Grotesk, sans-serif',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
