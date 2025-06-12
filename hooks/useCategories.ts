import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/types/Note';
import { CategoryStorage } from '@/services/categoryStorage';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedCategories = await CategoryStorage.getAllCategories();
      setCategories(loadedCategories);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (name: string, color: string) => {
    try {
      setError(null);
      const newCategory = await CategoryStorage.saveCategory({ name, color });
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError('Failed to create category');
      console.error('Error creating category:', err);
      throw err;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, updates: Partial<Pick<Category, 'name' | 'color'>>) => {
    try {
      setError(null);
      const updatedCategory = await CategoryStorage.updateCategory(id, updates);
      if (updatedCategory) {
        setCategories(prev => 
          prev.map(category => 
            category.id === id ? updatedCategory : category
          )
        );
        return updatedCategory;
      }
    } catch (err) {
      setError('Failed to update category');
      console.error('Error updating category:', err);
      throw err;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setError(null);
      const success = await CategoryStorage.deleteCategory(id);
      if (success) {
        setCategories(prev => prev.filter(category => category.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete category');
      console.error('Error deleting category:', err);
      throw err;
    }
  }, []);

  const getCategoryById = useCallback((id: string) => {
    return categories.find(category => category.id === id) || null;
  }, [categories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
} 