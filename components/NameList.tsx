
import React from 'react';
import { TableItem } from '../types';

interface NameListProps {
  items: TableItem[];
  allData?: TableItem[]; // Added allData to find the correct rank in cyclic scenarios
}

const NameList: React.FC<NameListProps> = ({ items, allData = [] }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <i className="fa-solid fa-inbox text-4xl mb-4"></i>
        <p>배정된 명단이 없습니다.</p>
      </div>
    );
  }

  // Helper to find original rank
  const getOriginalRank = (name: string) => {
    if (allData.length === 0) return null;
    const idx = allData.findIndex(item => item.name === name);
    return idx !== -1 ? idx + 1 : null;
  };

  return (
    <div className="overflow-hidden bg-white shadow-md sm:rounded-xl border border-slate-200">
      <ul className="divide-y divide-slate-100">
        {items.map((item, index) => {
          const rank = getOriginalRank(item.name);
          return (
            <li key={`${item.name}-${index}`} className="group px-6 py-5 hover:bg-slate-50 transition-all duration-200">
              <div className="flex items-center justify-between space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium tracking-wide uppercase">배정 완료</p>
                </div>
                {rank !== null && (
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Rank</span>
                    <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 min-w-[3rem] text-center">
                      #{rank}
                    </span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NameList;
