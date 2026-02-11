
import React from 'react';
import { TableItem } from '../types';

interface NameListProps {
  items: TableItem[];
}

const NameList: React.FC<NameListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <i className="fa-solid fa-inbox text-4xl mb-4"></i>
        <p>No records found in table1</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md border border-slate-200">
      <ul className="divide-y divide-slate-200">
        {items.map((item, index) => (
          <li key={index} className="px-6 py-4 hover:bg-slate-50 transition-colors duration-150">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {item.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
              </div>
              <div className="flex-shrink-0 text-slate-400 text-xs italic">
                # {index + 1}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NameList;
