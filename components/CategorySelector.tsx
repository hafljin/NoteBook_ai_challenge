import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { Category } from '@/types/Note';
import { CategoryTag } from './CategoryTag';
import { X } from 'lucide-react-native';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onSelectCategories: (categoryIds: string[]) => void;
  showClearOption?: boolean;
  multiple?: boolean;
}

export function CategorySelector({ 
  categories, 
  selectedCategoryIds = [], 
  onSelectCategories, 
  showClearOption = true,
  multiple = true
}: CategorySelectorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const selectedCategories = categories.filter(cat => selectedCategoryIds.includes(cat.id));

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
      borderColor: isDark ? '#38383A' : '#E5E5EA',
    },
    title: {
      color: isDark ? '#FFFFFF' : '#000000',
    },
    clearButton: {
      backgroundColor: isDark ? '#FF453A' : '#FF3B30',
    },
  });

  const handleCategoryToggle = (categoryId: string) => {
    if (multiple) {
      // 複数選択モード
      const newSelectedIds = selectedCategoryIds.includes(categoryId)
        ? selectedCategoryIds.filter(id => id !== categoryId)
        : [...selectedCategoryIds, categoryId];
      onSelectCategories(newSelectedIds);
    } else {
      // 単一選択モード
      onSelectCategories(selectedCategoryIds.includes(categoryId) ? [] : [categoryId]);
    }
  };

  const handleClearSelection = () => {
    onSelectCategories([]);
  };

  const handleRemoveCategory = (categoryId: string) => {
    const newSelectedIds = selectedCategoryIds.filter(id => id !== categoryId);
    onSelectCategories(newSelectedIds);
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.title, dynamicStyles.title]}>
        Categories {selectedCategoryIds.length > 0 && `(${selectedCategoryIds.length})`}
      </Text>
      
      {selectedCategories.length > 0 && (
        <View style={styles.selectedContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectedTagsContainer}
          >
            {selectedCategories.map((category) => (
              <View key={category.id} style={styles.selectedTagWrapper}>
                <CategoryTag category={category} size="medium" />
                {showClearOption && (
                  <TouchableOpacity
                    style={[styles.removeButton, dynamicStyles.clearButton]}
                    onPress={() => handleRemoveCategory(category.id)}
                  >
                    <X size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
          
          {showClearOption && selectedCategories.length > 1 && (
            <TouchableOpacity
              style={[styles.clearAllButton, dynamicStyles.clearButton]}
              onPress={handleClearSelection}
            >
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategoryIds.includes(category.id) && styles.selectedCategoryButton
            ]}
            onPress={() => handleCategoryToggle(category.id)}
          >
            <CategoryTag category={category} size="small" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  selectedContainer: {
    marginBottom: 12,
  },
  selectedTagsContainer: {
    paddingRight: 16,
  },
  selectedTagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  clearAllText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  categoryButton: {
    marginRight: 8,
  },
  selectedCategoryButton: {
    opacity: 0.7,
  },
}); 