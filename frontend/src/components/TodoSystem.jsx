import { useState } from 'react';
import { ChevronLeft, Plus, ChevronRight, Calendar, Check } from 'lucide-react';

export default function TodoSystem({ todoData, onUpdateTodos, onBack }) {
  const [currentView, setCurrentView] = useState('year');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const currentYear = new Date().getFullYear();
  const years = todoData.length > 0 ? todoData : [];

  const handleCreateYear = () => {
    const newYear = {
      year: currentYear,
      months: Array.from({ length: 12 }, (_, i) => ({
        name: new Date(currentYear, i).toLocaleString('default', { month: 'long' }),
        taskCount: 0,
        focus: '',
        days: [],
      })),
    };
    onUpdateTodos([...todoData, newYear]);
  };

  const renderYearView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Your Planning Years</h2>
        <button
          onClick={handleCreateYear}
          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full hover:scale-105 transition-all font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Year
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {years.map((yearPlan) => (
          <div
            key={yearPlan.year}
            onClick={() => {
              setSelectedYear(yearPlan);
              setCurrentView('month');
            }}
            className="bg-[#1C1C1E] rounded-3xl p-6 border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-2xl">{yearPlan.year}</h3>
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-400 text-sm">12 months planned</p>
          </div>
        ))}
      </div>
      {years.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Calendar className="w-16 h-16 text-gray-600 mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">No planning years yet</h3>
          <p className="text-gray-400 text-center mb-6">Create your first year to start planning</p>
          <button
            onClick={handleCreateYear}
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full hover:scale-105 transition-all font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Year
          </button>
        </div>
      )}
    </div>
  );

  const renderMonthView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setCurrentView('year');
              setSelectedYear(null);
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Years
          </button>
        </div>
        <h2 className="text-3xl font-bold text-white">{selectedYear?.year}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {selectedYear?.months.map((month, idx) => (
          <div
            key={idx}
            onClick={() => {
              setSelectedMonth({ ...month, index: idx });
              setCurrentView('day');
            }}
            className="bg-[#1C1C1E] rounded-2xl p-5 border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] transition-all cursor-pointer"
          >
            <h3 className="text-white font-semibold text-lg mb-2">{month.name}</h3>
            <p className="text-gray-400 text-sm">{month.taskCount} tasks</p>
            {month.focus && <p className="text-gray-600 text-xs mt-2">Focus: {month.focus}</p>}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDayView = () => {
    const daysInMonth = new Date(selectedYear.year, selectedMonth.index + 1, 0).getDate();
    const days = selectedMonth.days.length > 0 ? selectedMonth.days : [];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCurrentView('month');
                setSelectedMonth(null);
              }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Months
            </button>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {selectedMonth.name} {selectedYear.year}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const dayNum = i + 1;
            const dayData = days.find((d) => d.day === dayNum);
            const weekday = new Date(selectedYear.year, selectedMonth.index, dayNum).toLocaleDateString(
              'en-US',
              { weekday: 'long' }
            );

            return (
              <div
                key={dayNum}
                onClick={() => {
                  setSelectedDay({ day: dayNum, weekday, tasks: dayData?.tasks || [], goal: dayData?.goal || '' });
                }}
                className="bg-[#1C1C1E] rounded-2xl p-4 border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">{dayNum}</span>
                  {dayData && <Check className="w-4 h-4 text-green-400" />}
                </div>
                <p className="text-gray-400 text-xs">{weekday}</p>
                {dayData && (
                  <p className="text-gray-600 text-xs mt-2">{dayData.tasks.length} tasks</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Day Detail Modal */}
        {selectedDay && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={() => setSelectedDay(null)}
          >
            <div
              className="bg-[#1C1C1E] rounded-3xl p-8 w-full max-w-2xl border border-[rgba(255,255,255,0.1)] max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white text-2xl font-bold">
                    {selectedMonth.name} {selectedDay.day}, {selectedYear.year}
                  </h2>
                  <p className="text-gray-400 text-sm">{selectedDay.weekday}</p>
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-gray-400 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Daily Goal</label>
                  <input
                    type="text"
                    value={selectedDay.goal}
                    onChange={(e) => setSelectedDay({ ...selectedDay, goal: e.target.value })}
                    placeholder="What do you want to achieve today?"
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-[rgba(255,255,255,0.3)]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Hourly Tasks</label>
                  <div className="space-y-2">
                    {selectedDay.tasks.map((task, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-2xl border border-[rgba(255,255,255,0.1)]"
                      >
                        <input
                          type="checkbox"
                          checked={task.isComplete}
                          onChange={() => {
                            const newTasks = [...selectedDay.tasks];
                            newTasks[idx].isComplete = !newTasks[idx].isComplete;
                            setSelectedDay({ ...selectedDay, tasks: newTasks });
                          }}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-gray-400 text-sm">{task.timeRange}</span>
                        <span className="text-white flex-1">{task.task}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 w-full px-4 py-2.5 bg-white text-black rounded-full hover:scale-105 transition-all font-medium">
                    Add Task
                  </button>
                </div>

                <button
                  onClick={() => setSelectedDay(null)}
                  className="w-full px-4 py-2.5 bg-[#262626] text-white rounded-full hover:bg-[#333333] transition-all"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 p-8 mr-80">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-all mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Back to Notebooks</span>
        </button>
      </div>

      {currentView === 'year' && renderYearView()}
      {currentView === 'month' && renderMonthView()}
      {currentView === 'day' && renderDayView()}
    </div>
  );
}
