import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Note, Category } from '@/types/Note';
import { Calendar, Check } from 'lucide-react-native';
import { CategoryTag } from './CategoryTag';

interface NoteCardProps {
  note: Note;
  category?: Category;
  onPress: () => void;
  onLongPress: () => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
}

export function NoteCard({ 
  note, 
  category, 
  onPress, 
  onLongPress, 
  isSelectionMode = false, 
  isSelected = false 
}: NoteCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPreview = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const dynamicStyles = StyleSheet.create({
    card: {
      backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
      shadowColor: isDark ? '#000000' : '#000000',
      borderColor: isSelected ? (isDark ? '#5AC8FA' : '#007AFF') : 'transparent',
    },
    title: {
      color: isDark ? '#FFFFFF' : '#000000',
    },
    preview: {
      color: isDark ? '#8E8E93' : '#6D6D70',
    },
    dateText: {
      color: isDark ? '#8E8E93' : '#8E8E93',
    },
  });

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        dynamicStyles.card,
        isSelectionMode && styles.selectionCard,
        isSelected && styles.selectedCard
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {isSelectionMode && (
        <View style={[
          styles.selectionIndicator,
          { backgroundColor: isSelected ? (isDark ? '#5AC8FA' : '#007AFF') : 'transparent' }
        ]}>
          {isSelected && <Check size={16} color="#FFFFFF" />}
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, dynamicStyles.title]} numberOfLines={1}>
            {note.title || 'Untitled'}
          </Text>
          {category && (
            <CategoryTag category={category} size="small" />
          )}
        </View>
        {note.content && (
          <Text style={[styles.preview, dynamicStyles.preview]} numberOfLines={2}>
            {getPreview(note.content)}
          </Text>
        )}
        <View style={styles.dateContainer}>
          <Calendar size={14} color={isDark ? '#8E8E93' : '#8E8E93'} />
          <Text style={[styles.dateText, dynamicStyles.dateText]}>
            {formatDate(note.updatedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCard: {
    borderWidth: 2,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginRight: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  preview: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});