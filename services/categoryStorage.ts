import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '@/types/Note';

const CATEGORIES_STORAGE_KEY = 'quicknote_categories';

// デフォルトカテゴリー
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'personal', name: 'Personal', color: '#FF6B6B' },
  { id: 'work', name: 'Work', color: '#4ECDC4' },
  { id: 'ideas', name: 'Ideas', color: '#45B7D1' },
  { id: 'todo', name: 'Todo', color: '#96CEB4' },
  { id: 'important', name: 'Important', color: '#FFEAA7' },
];

export class CategoryStorage {
  static async getAllCategories(): Promise<Category[]> {
    try {
      const categoriesJson = await AsyncStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (!categoriesJson) {
        // 初回起動時はデフォルトカテゴリーを保存
        await this.saveDefaultCategories();
        return DEFAULT_CATEGORIES;
      }
      
      const categories = JSON.parse(categoriesJson);
      return categories;
    } catch (error) {
      console.error('Error loading categories:', error);
      return DEFAULT_CATEGORIES;
    }
  }

  static async saveCategory(category: Omit<Category, 'id'>): Promise<Category> {
    try {
      const categories = await this.getAllCategories();
      const newCategory: Category = {
        ...category,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };

      const updatedCategories = [...categories, newCategory];
      await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
      
      return newCategory;
    } catch (error) {
      console.error('Error saving category:', error);
      throw error;
    }
  }

  static async updateCategory(id: string, updates: Partial<Pick<Category, 'name' | 'color'>>): Promise<Category | null> {
    try {
      const categories = await this.getAllCategories();
      const categoryIndex = categories.findIndex(category => category.id === id);
      
      if (categoryIndex === -1) return null;

      const updatedCategory = {
        ...categories[categoryIndex],
        ...updates,
      };

      categories[categoryIndex] = updatedCategory;
      await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      
      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  static async deleteCategory(id: string): Promise<boolean> {
    try {
      const categories = await this.getAllCategories();
      const filteredCategories = categories.filter(category => category.id !== id);
      
      await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(filteredCategories));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      const categories = await this.getAllCategories();
      return categories.find(category => category.id === id) || null;
    } catch (error) {
      console.error('Error getting category by ID:', error);
      return null;
    }
  }

  private static async saveDefaultCategories(): Promise<void> {
    try {
      await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    } catch (error) {
      console.error('Error saving default categories:', error);
    }
  }
} 