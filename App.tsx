
import React, { useState, useEffect, useCallback } from 'react';
import { fetchTableData } from './services/supabaseClient';
import { TableItem, AppState } from './types';
import NameList from './components/NameList';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    data: [],
    assignedData: [],
    currentIndex: 0,
    previousIndex: 0,
    loading: true,
    error: null,
  });

  const [inputCount, setInputCount] = useState<string>('');

  const loadData = useCallback(async () => {
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null, 
      assignedData: [], 
      currentIndex: 0,
      previousIndex: 0
    }));
    try {
      const data = await fetchTableData();
      setState(prev => ({ ...prev, data, loading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || '데이터를 불러오는 데 실패했습니다.', loading: false }));
    }
  }, []);

  const handleAssign = () => {
    const count = parseInt(inputCount);
    if (isNaN(count) || count <= 0) {
      alert('올바른 인원수를 입력해주세요.');
      return;
    }

    if (state.data.length === 0) {
      alert('배정할 데이터가 없습니다.');
      return;
    }

    const totalCount = state.data.length;
    const startIndex = state.currentIndex;
    const newAssignedBatch: TableItem[] = [];

    // Cyclic assignment logic
    for (let i = 0; i < count; i++) {
      const targetIndex = (startIndex + i) % totalCount;
      newAssignedBatch.push(state.data[targetIndex]);
    }

    const nextIndex = (startIndex + count) % totalCount;
    
    setState(prev => ({ 
      ...prev, 
      previousIndex: startIndex, // Store the index before assignment
      assignedData: newAssignedBatch, 
      currentIndex: nextIndex,
    }));
  };

  const handleUndoAssignment = () => {
    // Revert to the state before the last "Assign" click
    setState(prev => ({
      ...prev,
      currentIndex: prev.previousIndex,
      assignedData: [],
    }));
  };

  const handleReset = () => {
    // Reset the entire sequence back to the start
    setState(prev => ({ 
      ...prev, 
      assignedData: [], 
      currentIndex: 0,
      previousIndex: 0,
    }));
    setInputCount('');
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <header className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              기계부 담당자 배정 시스템
            </h1>
          </div>
          <button
            onClick={loadData}
            disabled={state.loading}
            className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-all"
          >
            <i className={`fa-solid fa-sync mr-2 ${state.loading ? 'animate-spin' : ''}`}></i>
            DB 동기화 & 전체 초기화
          </button>
        </header>

        {/* Input Control Panel */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 transition-all hover:shadow-md">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                배정 요청 설정
              </label>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight">Next Start</span>
                 <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md">
                  #{state.currentIndex + 1}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-users text-slate-400"></i>
                </div>
                <input
                  type="number"
                  value={inputCount}
                  onChange={(e) => setInputCount(e.target.value)}
                  placeholder="배정할 인원수를 입력하세요"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-slate-400"
                />
              </div>
              <button
                onClick={handleAssign}
                disabled={state.loading || !inputCount || state.data.length === 0}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-slate-300"
              >
                배정 실행
              </button>
              
              <div className="flex flex-col gap-2">
                {state.assignedData.length > 0 && (
                  <button
                    onClick={handleUndoAssignment}
                    className="inline-flex items-center justify-center px-6 py-2 border border-amber-200 text-xs font-bold rounded-lg shadow-sm text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                  >
                    <i className="fa-solid fa-rotate-left mr-2"></i>
                    배정 취소
                  </button>
                )}
                {(state.assignedData.length > 0 || state.currentIndex > 0) && (
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center px-6 py-2 border border-red-200 text-xs font-bold rounded-lg shadow-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <i className="fa-solid fa-trash-can mr-2"></i>
                    순서 리셋
                  </button>
                )}
              </div>
            </div>

            {!state.loading && (
              <div className="flex justify-between items-center text-xs text-slate-400 italic">
                <p>DB 등록 인원: {state.data.length}명</p>
                <div className="flex items-center gap-1 text-indigo-500 font-medium not-italic">
                  <i className="fa-solid fa-circle-info"></i>
                  <span>순차 배정 중입니다.</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Main Content Area */}
        <main className="relative">
          {state.loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-slate-500 animate-pulse font-medium">데이터 로딩 중...</p>
            </div>
          ) : state.error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-lg flex items-start shadow-sm">
              <i className="fa-solid fa-circle-exclamation mt-1 mr-4 text-xl"></i>
              <div>
                <p className="font-bold">데이터 조회 오류</p>
                <p className="text-sm mt-1">{state.error}</p>
              </div>
            </div>
          ) : state.assignedData.length > 0 ? (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-lg font-bold text-slate-800">
                  <i className="fa-solid fa-clipboard-check text-green-500 mr-2"></i>
                  배정 결과
                </h2>
                <div className="flex gap-2">
                   <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">
                      이번 차수 {state.assignedData.length}명
                   </span>
                </div>
              </div>
              <NameList 
                items={state.assignedData} 
                allData={state.data}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
              <i className="fa-solid fa-user-plus text-slate-300 text-5xl mb-4"></i>
              <p className="text-slate-400 font-medium text-lg">새로운 배정 요청을 기다리고 있습니다.</p>
              <p className="text-slate-400 text-sm mt-1">인원수를 입력하고 배정 실행 버튼을 눌러주세요.</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} 기계부 담당자 배정 시스템 &bull; Supabase Backend</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
