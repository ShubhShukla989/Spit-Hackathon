import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function Table<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border-[1.5px] border-[#D4A657]">
      <table className="min-w-full">
        <thead style={{ backgroundColor: '#1E293B' }}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#FFFFFF' }}
                aria-sort={column.sortable ? 'none' : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={`transition-all duration-300 ${onRowClick ? 'cursor-pointer' : ''}`}
              style={{ 
                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F8F5F2',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(212,166,87,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F8F5F2';
              }}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={onRowClick ? (e) => e.key === 'Enter' && onRowClick(item) : undefined}
            >
              {columns.map((column) => (
                <td 
                  key={column.key} 
                  className="px-6 py-4 text-sm"
                  style={{ 
                    color: '#1E293B',
                    borderTop: '1px solid #D4A657'
                  }}
                >
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
