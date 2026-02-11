
import React, { useState, useEffect, useCallback } from 'react';
import { fetchTableData } from './services/supabaseClient';
import { generateDataInsights } from './services/geminiService';
import { TableItem, AppState } from './types';
import NameList from './components/NameList';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    data: [],
    loading: true,
    error: null,
    aiInsight: null,
    aiLoading: false,
  });

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchTableData();
      setState(prev => ({ ...prev, data, loading: false }));
      
      // Once data is loaded, optionally get AI insights
      if (data.length > 0) {
        getAiInsights(data);
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || 'Failed to fetch data', loading: false }));
    }
  }, []);

  const getAiInsights = async (items: TableItem[]) => {
    setState(prev => ({ ...prev, aiLoading: true }));
    try {
      const insight = await generateDataInsights(items);
      setState(prev => ({ ...prev, aiInsight: insight, aiLoading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, aiLoading: false }));
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <header className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Table Explorer
            </h1>
            <p className="mt-1 text-slate-500 font-medium">
              Live data from <code className="bg-slate-200 px-1 rounded text-indigo-600">supabase.table1</code>
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={state.loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
          >
            <i className={`fa-solid fa-rotate mr-2 ${state.loading ? 'animate-spin' : ''}`}></i>
            Refresh Data
          </button>
        </header>

        {/* AI Insight Section */}
        {state.aiInsight && !state.loading && (
          <div className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-400 p-6 rounded-r-lg shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fa-solid fa-wand-magic-sparkles text-indigo-500 text-xl"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wider">AI Insights</h3>
                <div className="mt-2 text-sm text-indigo-700 leading-relaxed">
                  <p>{state.aiInsight}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="relative">
          {state.loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-slate-500 animate-pulse font-medium">Fetching records from Supabase...</p>
            </div>
          ) : state.error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-md flex items-center shadow-sm">
              <i className="fa-solid fa-circle-exclamation mr-3 text-xl"></i>
              <div>
                <p className="font-bold">Error encountered</p>
                <p className="text-sm">{state.error}</p>
                <p className="text-xs mt-2 opacity-75">Check your 'Table_URL' and 'Table_KEY' environment variables.</p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-sm font-semibold text-slate-500">
                  Showing {state.data.length} records
                </span>
                <span className="flex items-center text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full uppercase">
                   <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                   Connected
                </span>
              </div>
              <NameList items={state.data} />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Supabase Table Viewer &bull; Built with React & Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
