import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Category } from '@/types/Note';

interface CategoryTagProps {
  category: Category;
  size?: 'small' | 'medium' | 'large';
}

export function CategoryTag({ category, size = 'medium' }: CategoryTagProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 8,
          fontSize: 10,
        };
      case 'large':
        return {
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          fontSize: 14,
        };
      default:
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          fontSize: 12,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: category.color + '20', // 20% opacity
      borderColor: category.color,
    },
    text: {
      color: isDark ? '#FFFFFF' : '#000000',
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container, sizeStyles]}>
      <Text style={[styles.text, dynamicStyles.text, { fontSize: sizeStyles.fontSize }]}>
        {category.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Inter-Medium',
  },
}); 