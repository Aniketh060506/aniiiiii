import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ChevronLeft,
  Save,
  MoreVertical,
  Trash2,
} from 'lucide-react';

export default function Dashboard({ notebook, notes, onBack, onSaveNote, onDeleteNote }) {
  const [currentNote, setCurrentNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px]',
      },
    },
  });

  useEffect(() => {
    if (notes && notes.length > 0 && !currentNote) {
      setCurrentNote(notes[0]);
      setNoteTitle(notes[0].title);
      editor?.commands.setContent(notes[0].content);
    }
  }, [notes]);

  const handleSave = () => {
    if (!editor) return;
    
    setIsSaving(true);
    const content = editor.getHTML();
    const wordCount = editor.getText().split(/\s+/).filter(Boolean).length;
    const characterCount = editor.getText().length;

    const noteData = {
      id: currentNote?.id || `note_${Date.now()}`,
      notebookId: notebook.id,
      title: noteTitle || 'Untitled Note',
      content,
      wordCount,
      characterCount,
      createdAt: currentNote?.createdAt || new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    onSaveNote(noteData);
    
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const handleNewNote = () => {
    setCurrentNote(null);
    setNoteTitle('');
    editor?.commands.setContent('');
  };

  const handleSelectNote = (note) => {
    setCurrentNote(note);
    setNoteTitle(note.title);
    editor?.commands.setContent(note.content);
  };

  const handleDelete = () => {
    if (currentNote && window.confirm('Are you sure you want to delete this note?')) {
      onDeleteNote(currentNote.id);
      handleNewNote();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-1 flex h-screen mr-80">
      {/* Notes List Sidebar */}
      <div className="w-64 border-r border-[rgba(255,255,255,0.1)] bg-[#0A0A0A] flex flex-col">
        <div className="p-4 border-b border-[rgba(255,255,255,0.1)]">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back to Notebooks</span>
          </button>
          <h2 className="text-white font-semibold text-lg mb-2">{notebook.name}</h2>
          <button
            onClick={handleNewNote}
            className="w-full bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-all"
          >
            New Note
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note)}
              className={`p-3 rounded-2xl cursor-pointer transition-all ${
                currentNote?.id === note.id
                  ? 'bg-[#1C1C1E] border border-[rgba(255,255,255,0.2)]'
                  : 'hover:bg-[#1C1C1E] border border-transparent'
              }`}
            >
              <h3 className="text-white font-medium text-sm mb-1 truncate">{note.title}</h3>
              <p className="text-gray-400 text-xs">
                {new Date(note.lastModified).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-xs mt-1">{note.wordCount} words</p>
            </div>
          ))}
          {notes.length === 0 && (
            <div className="text-center text-gray-600 text-sm py-8">
              No notes yet
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col bg-[#000000]">
        {/* Toolbar */}
        <div className="border-b border-[rgba(255,255,255,0.1)] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded-full transition-all ${
                editor.isActive('bold')
                  ? 'bg-white text-black'
                  : 'hover:bg-[#1C1C1E] text-gray-400'
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded-full transition-all ${
                editor.isActive('italic')
                  ? 'bg-white text-black'
                  : 'hover:bg-[#1C1C1E] text-gray-400'
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded-full transition-all ${
                editor.isActive('strike')
                  ? 'bg-white text-black'
                  : 'hover:bg-[#1C1C1E] text-gray-400'
              }`}
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded-full transition-all ${
                editor.isActive('code')
                  ? 'bg-white text-black'
                  : 'hover:bg-[#1C1C1E] text-gray-400'
              }`}
            >
              <Code className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-[rgba(255,255,255,0.1)] mx-2" />
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-full transition-all ${
                editor.isActive('bulletList')
                  ? 'bg-white text-black'
                  : 'hover:bg-[#1C1C1E] text-gray-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-full transition-all ${
                editor.isActive('orderedList')
                  ? 'bg-white text-black'
                  : 'hover:bg-[#1C1C1E] text-gray-400'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded-full transition-all ${
                editor.isActive('blockquote')
                  ? 'bg-white text-black'
                  : 'hover:bg-[#1C1C1E] text-gray-400'
              }`}
            >
              <Quote className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-[rgba(255,255,255,0.1)] mx-2" />
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-2 rounded-full hover:bg-[#1C1C1E] text-gray-400 disabled:opacity-30"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-2 rounded-full hover:bg-[#1C1C1E] text-gray-400 disabled:opacity-30"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {currentNote && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-red-500 text-gray-400 hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full hover:scale-105 transition-all font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Title Input */}
        <div className="px-8 pt-6 pb-2">
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Untitled Note"
            className="w-full bg-transparent border-none text-white text-3xl font-bold focus:outline-none placeholder-gray-600"
          />
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
