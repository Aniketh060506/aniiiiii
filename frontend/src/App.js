import { useState, useEffect } from 'react';
import './App.css';
import LenisWrapper from './components/LenisWrapper';
import Sidebar from './components/Sidebar';
import NotebookManager from './components/NotebookManager';
import Dashboard from './components/Dashboard';
import TodoSystem from './components/TodoSystem';
import { loadData, saveData, calculateAnalytics } from './utils/storage';
import { getMockData } from './utils/mockData';
import { Menu, X, CheckSquare } from 'lucide-react';

function App() {
  const [data, setData] = useState(null);
  const [currentView, setCurrentView] = useState('notebooks');
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    // Load data from localStorage or use mock data
    const storedData = loadData();
    if (storedData.notebooks.length === 0) {
      // First time user - use mock data
      const mockData = getMockData();
      setData(mockData);
      saveData(mockData);
    } else {
      setData(storedData);
    }
  }, []);

  useEffect(() => {
    // Listen for web capture messages from Chrome extension
    const handleMessage = (event) => {
      if (event.data.type === 'CONTENT_CAPTURE') {
        handleWebCapture(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [data]);

  const handleWebCapture = (payload) => {
    if (!data) return;

    const targetNotebook = data.notebooks.find(nb => nb.isTarget);
    if (!targetNotebook) {
      alert('Please set a target notebook first');
      return;
    }

    const newNote = {
      id: `note_${Date.now()}`,
      notebookId: targetNotebook.id,
      title: `Capture from ${payload.sourceDomain}`,
      content: payload.selectedHTML,
      source: payload.sourceDomain,
      sourceUrl: payload.sourceUrl,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      wordCount: payload.selectedText.split(/\s+/).filter(Boolean).length,
      characterCount: payload.selectedText.length,
    };

    const updatedData = {
      ...data,
      notes: [...data.notes, newNote],
    };

    updatedData.notebooks = updatedData.notebooks.map(nb =>
      nb.id === targetNotebook.id
        ? { ...nb, itemCount: nb.itemCount + 1 }
        : nb
    );

    updatedData.analytics = calculateAnalytics(updatedData);
    setData(updatedData);
    saveData(updatedData);

    // Show success message
    alert(`✅ Captured from ${payload.sourceDomain}`);
  };

  const handleCreateNotebook = (name) => {
    const newNotebook = {
      id: `nb_${Date.now()}`,
      name,
      itemCount: 0,
      createdAt: new Date().toISOString(),
      isTarget: data.notebooks.length === 0,
    };

    const updatedData = {
      ...data,
      notebooks: [...data.notebooks, newNotebook],
    };

    updatedData.analytics = calculateAnalytics(updatedData);
    setData(updatedData);
    saveData(updatedData);
  };

  const handleSelectNotebook = (notebook) => {
    setSelectedNotebook(notebook);
    setCurrentView('editor');
  };

  const handleDeleteNotebook = (notebookId) => {
    if (window.confirm('Are you sure you want to delete this notebook?')) {
      const updatedData = {
        ...data,
        notebooks: data.notebooks.filter(nb => nb.id !== notebookId),
        notes: data.notes.filter(n => n.notebookId !== notebookId),
      };

      updatedData.analytics = calculateAnalytics(updatedData);
      setData(updatedData);
      saveData(updatedData);
    }
  };

  const handleSetTarget = (notebookId) => {
    const updatedData = {
      ...data,
      notebooks: data.notebooks.map(nb => ({
        ...nb,
        isTarget: nb.id === notebookId,
      })),
    };

    setData(updatedData);
    saveData(updatedData);

    // Send message to Chrome extension
    window.postMessage({
      type: 'TARGET_NOTEBOOK_UPDATED',
      notebookId,
    }, '*');
  };

  const handleSaveNote = (noteData) => {
    const existingNoteIndex = data.notes.findIndex(n => n.id === noteData.id);
    let updatedNotes;

    if (existingNoteIndex >= 0) {
      updatedNotes = [...data.notes];
      updatedNotes[existingNoteIndex] = noteData;
    } else {
      updatedNotes = [...data.notes, noteData];
      // Update notebook item count
      data.notebooks = data.notebooks.map(nb =>
        nb.id === noteData.notebookId
          ? { ...nb, itemCount: nb.itemCount + 1 }
          : nb
      );
    }

    const updatedData = {
      ...data,
      notes: updatedNotes,
    };

    updatedData.analytics = calculateAnalytics(updatedData);
    setData(updatedData);
    saveData(updatedData);
  };

  const handleDeleteNote = (noteId) => {
    const note = data.notes.find(n => n.id === noteId);
    if (!note) return;

    const updatedData = {
      ...data,
      notes: data.notes.filter(n => n.id !== noteId),
      notebooks: data.notebooks.map(nb =>
        nb.id === note.notebookId
          ? { ...nb, itemCount: Math.max(0, nb.itemCount - 1) }
          : nb
      ),
    };

    updatedData.analytics = calculateAnalytics(updatedData);
    setData(updatedData);
    saveData(updatedData);
  };

  const handleUpdateTodos = (todoSystem) => {
    const updatedData = {
      ...data,
      todoSystem,
    };

    setData(updatedData);
    saveData(updatedData);
  };

  const handleBackToNotebooks = () => {
    setCurrentView('notebooks');
    setSelectedNotebook(null);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <LenisWrapper>
      <div className="min-h-screen bg-black">
        {/* Top Navigation Bar */}
        <div className={`fixed top-0 right-0 h-16 bg-[#0A0A0A] border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between px-6 z-40 transition-all duration-300 ${
          showSidebar ? 'left-80' : 'left-0'
        }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 rounded-full bg-[#1C1C1E] hover:bg-[#262626] transition-all"
            >
              {showSidebar ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
            <h1 className="text-white font-bold text-xl">CopyDock</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('notebooks')}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  currentView === 'notebooks'
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Notebooks
              </button>
              <button
                onClick={() => setCurrentView('todos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                  currentView === 'todos'
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                Todo System
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Left Side */}
        {showSidebar && (
          <Sidebar
            analytics={data.analytics}
            onSearch={(query) => console.log('Search:', query)}
          />
        )}

        {/* Main Content */}
        <div className={`pt-16 transition-all duration-300 ${showSidebar ? 'ml-80' : 'ml-0'}`}>
          {currentView === 'notebooks' && (
            <NotebookManager
              notebooks={data.notebooks}
              onCreateNotebook={handleCreateNotebook}
              onSelectNotebook={handleSelectNotebook}
              onDeleteNotebook={handleDeleteNotebook}
              onSetTarget={handleSetTarget}
            />
          )}

          {currentView === 'editor' && selectedNotebook && (
            <Dashboard
              notebook={selectedNotebook}
              notes={data.notes.filter(n => n.notebookId === selectedNotebook.id)}
              onBack={handleBackToNotebooks}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {currentView === 'todos' && (
            <TodoSystem
              todoData={data.todoSystem}
              onUpdateTodos={handleUpdateTodos}
              onBack={handleBackToNotebooks}
            />
          )}
        </div>
      </div>
    </LenisWrapper>
  );
}

export default App;
