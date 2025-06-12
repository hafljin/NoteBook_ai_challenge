import { useState, useEffect, useCallback } from 'react';
import { Note } from '@/types/Note';
import { NoteStorage } from '@/services/noteStorage';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedNotes = await NoteStorage.getAllNotes();
      setNotes(loadedNotes);
    } catch (err) {
      setError('Failed to load notes');
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (title: string, content: string, categoryId?: string) => {
    try {
      setError(null);
      const newNote = await NoteStorage.saveNote({ title, content, categoryId });
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError('Failed to create note');
      console.error('Error creating note:', err);
      throw err;
    }
  }, []);

  const updateNote = useCallback(async (id: string, updates: Partial<Pick<Note, 'title' | 'content' | 'categoryId'>>) => {
    try {
      setError(null);
      const updatedNote = await NoteStorage.updateNote(id, updates);
      if (updatedNote) {
        setNotes(prev => {
          const filtered = prev.filter(note => note.id !== id);
          return [updatedNote, ...filtered];
        });
        return updatedNote;
      }
    } catch (err) {
      setError('Failed to update note');
      console.error('Error updating note:', err);
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    try {
      setError(null);
      const success = await NoteStorage.deleteNote(id);
      if (success) {
        setNotes(prev => prev.filter(note => note.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
      throw err;
    }
  }, []);

  const clearCategoryFromNotes = useCallback(async (categoryId: string) => {
    try {
      setError(null);
      const success = await NoteStorage.clearCategoryFromNotes(categoryId);
      if (success) {
        setNotes(prev => prev.map(note => 
          note.categoryId === categoryId 
            ? { ...note, categoryId: undefined, updatedAt: new Date().toISOString() }
            : note
        ));
        setTimeout(async () => {
          await loadNotes();
        }, 50);
      }
      return success;
    } catch (err) {
      setError('Failed to clear category from notes');
      console.error('Error clearing category from notes:', err);
      throw err;
    }
  }, [loadNotes]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    loading,
    error,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    clearCategoryFromNotes,
  };
}