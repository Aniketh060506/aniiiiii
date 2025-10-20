import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import {
  Flame,
  FileText,
  Database,
  BookOpen,
  Search,
  TrendingUp,
  Clock,
  Star,
  Plus,
  Target,
  Calendar,
  Zap,
  Activity,
} from 'lucide-react';

export default function Sidebar({ analytics, onSearch }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="w-80 h-screen bg-[#000000] border-r border-[rgba(255,255,255,0.1)] flex flex-col fixed right-0 top-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-white" />
            <h2 className="text-white font-semibold text-base">Quick Tools</h2>
          </div>
          <button className="w-8 h-8 rounded-full bg-[#1C1C1E] hover:bg-[#262626] flex items-center justify-center transition-all">
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-5 py-3 border-b border-[rgba(255,255,255,0.1)]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search everywhere..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1C1C1E] border border-[rgba(255,255,255,0.1)] rounded-full text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-all"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.1)]">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-[#1C1C1E] rounded-2xl p-3 text-center border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] transition-all cursor-pointer">
            <div className="text-2xl font-bold text-white mb-1">{analytics.notebookCount}</div>
            <div className="text-xs text-gray-400">NB</div>
          </div>
          <div className="bg-[#1C1C1E] rounded-2xl p-3 text-center border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] transition-all cursor-pointer">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white mb-1">
              <Flame className="w-5 h-5 text-[#EF4444]" />
              {analytics.streak}
            </div>
            <div className="text-xs text-gray-400">STR</div>
          </div>
          <div className="bg-[#1C1C1E] rounded-2xl p-3 text-center border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] transition-all cursor-pointer">
            <div className="text-2xl font-bold text-white mb-1">{analytics.totalNotes}</div>
            <div className="text-xs text-gray-400">NT</div>
          </div>
          <div className="bg-[#1C1C1E] rounded-2xl p-3 text-center border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] transition-all cursor-pointer">
            <div className="text-lg font-bold text-white mb-1">{analytics.storageMb.toFixed(1)}</div>
            <div className="text-xs text-gray-400">MB</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-5 py-3 border-b border-[rgba(255,255,255,0.1)] flex items-center gap-4">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
            activeTab === 'analytics'
              ? 'bg-white text-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
            activeTab === 'recent'
              ? 'bg-white text-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          Recent
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
            activeTab === 'favorites'
              ? 'bg-white text-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Star className="w-4 h-4" />
          Favorites
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {activeTab === 'analytics' && (
          <>
            {/* Activity Chart */}
            <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-white" />
                <h3 className="text-white font-medium text-sm">Activity (7 days)</h3>
              </div>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={analytics.activity}>
                  <Bar dataKey="notes" radius={[8, 8, 0, 0]}>
                    {analytics.activity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="rgba(255, 255, 255, 0.8)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Today's Productivity */}
            <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-white" />
                <h3 className="text-white font-medium text-sm">Today's Productivity</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{analytics.today.notes} notes created</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{analytics.today.todos} todos completed</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{analytics.today.templates} templates used</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{analytics.today.captures} web captures</span>
                </div>
              </div>
            </div>

            {/* Content Analytics */}
            <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-white" />
                <h3 className="text-white font-medium text-sm">Content Analytics</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{analytics.content.totalWords.toLocaleString()} total words</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{analytics.content.avgWordsPerNote} avg words/note</span>
                </div>
                {analytics.content.breakdown.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak & Goals */}
            <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-[#EF4444]" />
                <h3 className="text-white font-medium text-sm">Streak & Goals</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Current: {analytics.goals.currentStreak} days</span>
                  <Flame className="w-4 h-4 text-[#EF4444]" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Best ever: {analytics.goals.bestStreak} days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">This month: {analytics.goals.monthlyProgress}%</span>
                </div>
              </div>
            </div>

            {/* Storage Breakdown */}
            <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-white" />
                <h3 className="text-white font-medium text-sm">Storage Breakdown</h3>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-[#0A0A0A] rounded-full h-2 mb-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all"
                    style={{ width: `${(analytics.storageMb / analytics.storageTotalMb) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{analytics.storageMb.toFixed(1)}MB / {analytics.storageTotalMb}MB</span>
                </div>
                {analytics.storageBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{item.name}: {item.value.toFixed(1)}MB</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-white" />
                <h3 className="text-white font-medium text-sm">Quick Templates</h3>
              </div>
              <div className="space-y-2">
                {analytics.templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{template.name} ({template.useCount}x)</span>
                    <button className="px-3 py-1 bg-white text-black text-xs rounded-full hover:scale-105 transition-all">
                      Use
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Insights */}
            <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-white" />
                <h3 className="text-white font-medium text-sm">Weekly Insights</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Most productive: {analytics.weeklyInsights.mostProductiveDay}</div>
                <div className="text-sm text-gray-400">{analytics.weeklyInsights.totalWords} words written</div>
                <div className="text-sm text-gray-400">{analytics.weeklyInsights.notesCreated} notes created</div>
                <div className="text-sm text-gray-400">{analytics.weeklyInsights.todosCompleted} todos completed</div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'recent' && (
          <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-white" />
              <h3 className="text-white font-medium text-sm">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {analytics.recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{item.notebookName}</div>
                    <div className="text-gray-400 text-xs">{item.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-white" />
              <h3 className="text-white font-medium text-sm">Favorites</h3>
            </div>
            <div className="space-y-3">
              {analytics.favorites.map((item) => (
                <div key={item.id} className="flex items-center gap-3 cursor-pointer hover:bg-[#262626] p-2 rounded-xl transition-all">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
