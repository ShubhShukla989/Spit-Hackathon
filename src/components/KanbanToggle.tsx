import React from 'react';

interface KanbanToggleProps {
  view: 'list' | 'kanban';
  onChange: (view: 'list' | 'kanban') => void;
}

export const KanbanToggle: React.FC<KanbanToggleProps> = ({ view, onChange }) => {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group" aria-label="View toggle">
      <button
        type="button"
        onClick={() => onChange('list')}
        className={`px-4 py-2 text-sm font-medium border rounded-l-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
          view === 'list'
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
        }`}
        aria-pressed={view === 'list'}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onChange('kanban')}
        className={`px-4 py-2 text-sm font-medium border-t border-r border-b rounded-r-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
          view === 'kanban'
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
        }`}
        aria-pressed={view === 'kanban'}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      </button>
    </div>
  );
};
