export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotePreview {
  id: string;
  title: string;
  preview: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteWithCategory extends Note {
  category?: Category;
}