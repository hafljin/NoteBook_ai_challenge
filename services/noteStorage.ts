import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '@/types/Note';

const NOTES_STORAGE_KEY = 'quicknote_notes';

export class NoteStorage {
  static async getAllNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (!notesJson) return [];
      
      const notes = JSON.parse(notesJson);
      return notes.sort((a: Note, b: Note) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  static async saveNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    try {
      const notes = await this.getAllNotes();
      const now = new Date().toISOString();
      
      const newNote: Note = {
        ...note,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: now,
        updatedAt: now,
      };

      const updatedNotes = [newNote, ...notes];
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
      
      return newNote;
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  }

  static async updateNote(id: string, updates: Partial<Pick<Note, 'title' | 'content' | 'categoryId'>>): Promise<Note | null> {
    try {
      const notes = await this.getAllNotes();
      const noteIndex = notes.findIndex(note => note.id === id);
      
      if (noteIndex === -1) return null;

      const updatedNote = {
        ...notes[noteIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      notes[noteIndex] = updatedNote;
      
      // Move updated note to top
      notes.splice(noteIndex, 1);
      notes.unshift(updatedNote);
      
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  static async deleteNote(id: string): Promise<boolean> {
    try {
      const notes = await this.getAllNotes();
      const filteredNotes = notes.filter(note => note.id !== id);
      
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filteredNotes));
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }

  static async getNoteById(id: string): Promise<Note | null> {
    try {
      const notes = await this.getAllNotes();
      return notes.find(note => note.id === id) || null;
    } catch (error) {
      console.error('Error getting note by ID:', error);
      return null;
    }
  }
}