import React from 'react';

export default function Pill({
  label,
  value,
  tone = 'primary',
}: {
  label: string;
  value: string;
  tone?: 'primary' | 'purple' | 'cyan';
}) {
  const tones: Record<string, string> = {
    primary: 'bg-cyan-100 text-cyan-900 ring-cyan-200',
    purple: 'bg-purple-100 text-purple-900 ring-purple-200',
    cyan: 'bg-sky-100 text-sky-900 ring-sky-200',
  };

  return (
    <div className={`px-4 py-2 rounded-xl ring-1 ${tones[tone]} text-center`}>
      <div className="text-xs opacity-70 leading-none">{label}</div>
      <div className="font-semibold leading-tight">{value}</div>
    </div>
  );
}
