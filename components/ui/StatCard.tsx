import Card from './Card';

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  color?: string;
}

export default function StatCard({ label, value, delta, color }: StatCardProps) {
  const pos = delta && delta.startsWith('+');
  return (
    <Card style={{ padding: '18px 20px' }}>
      <div
        style={{
          fontSize: 11,
          color: '#666678',
          fontFamily: 'Figtree, sans-serif',
          fontWeight: 500,
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: color || '#f0f0f8',
          fontFamily: 'Space Grotesk, sans-serif',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {delta && (
        <div
          style={{
            fontSize: 11,
            marginTop: 6,
            color: pos ? 'oklch(0.68 0.18 155)' : 'oklch(0.62 0.2 25)',
            fontFamily: 'Figtree, sans-serif',
            fontWeight: 500,
          }}
        >
          {delta} vs last week
        </div>
      )}
    </Card>
  );
}
