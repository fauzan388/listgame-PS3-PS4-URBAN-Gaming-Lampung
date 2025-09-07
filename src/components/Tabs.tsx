import React from 'react';

export default function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: readonly string[];
  active: string;
  onChange: (t: any) => void;
}) {
  return (
    <div className="inline-flex rounded-2xl bg-gray-100 p-1">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`relative px-3 md:px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            active === t ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}