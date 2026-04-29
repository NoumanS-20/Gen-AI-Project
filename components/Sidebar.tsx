'use client';

import { useState } from 'react';
import Avatar from './ui/Avatar';
import { Icon } from './Icons';

const NAV_ITEMS = [
  { id: 'generate', label: 'Generate', iconKey: 'Zap' as const },
  { id: 'campaigns', label: 'Campaigns', iconKey: 'Briefcase' as const },
  { id: 'analytics', label: 'Analytics', iconKey: 'BarChart' as const },
  { id: 'settings', label: 'Settings', iconKey: 'Settings' as const },
];

interface SidebarProps {
  active: string;
  onNav: (id: string) => void;
  collapsed: boolean;
}

export default function Sidebar({ active, onNav, collapsed }: SidebarProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        width: collapsed ? 56 : 220,
        flexShrink: 0,
        background: '#0c0c0f',
        borderRight: '1px solid #1a1a22',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: collapsed ? '20px 14px' : '20px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid #1a1a22',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: 'oklch(0.62 0.22 258)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 16px oklch(0.62 0.22 258 / 0.4)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                color: '#f0f0f8',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              SmartReach
            </div>
            <div
              style={{
                fontSize: 10,
                color: 'oklch(0.72 0.22 258)',
                fontFamily: 'Figtree, sans-serif',
                fontWeight: 500,
              }}
            >
              AI
            </div>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const isHov = hovered === item.id;
          const IconComp = Icon[item.iconKey as keyof typeof Icon] as any;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: collapsed ? '9px 14px' : '9px 12px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                background: isActive ? 'oklch(0.62 0.22 258 / 0.14)' : isHov ? '#141418' : 'transparent',
                color: isActive ? 'oklch(0.72 0.22 258)' : isHov ? '#c8c8e0' : '#6b6b82',
                transition: 'all 0.15s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              <span style={{ display: 'flex', flexShrink: 0 }}>
                <IconComp />
              </span>
              {!collapsed && (
                <span style={{ fontFamily: 'Figtree, sans-serif', fontSize: 13, fontWeight: isActive ? 600 : 500 }}>
                  {item.label}
                </span>
              )}
              {isActive && !collapsed && (
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'oklch(0.62 0.22 258)',
                    marginLeft: 'auto',
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          padding: collapsed ? '14px 8px' : '14px 12px',
          borderTop: '1px solid #1a1a22',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Avatar name="Alex Johnson" size={28} />
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 12,
                fontWeight: 600,
                color: '#d0d0e8',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Alex Johnson
            </div>
            <div style={{ fontSize: 10, color: '#44445a', fontFamily: 'Figtree, sans-serif' }}>Free Plan</div>
          </div>
        )}
      </div>
    </div>
  );
}
