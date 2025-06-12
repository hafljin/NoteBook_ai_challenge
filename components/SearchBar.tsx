import React from 'react';
import { View, TextInput, StyleSheet, useColorScheme } from 'react-native';
import { Search } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search notes...' }: SearchBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
      borderColor: isDark ? '#38383A' : '#E5E5EA',
      shadowColor: isDark ? '#000000' : '#000000',
    },
    input: {
      color: isDark ? '#FFFFFF' : '#000000',
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Search size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
      <TextInput
        style={[styles.input, dynamicStyles.input]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});