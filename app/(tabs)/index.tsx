import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, useColorScheme, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useNotes } from '@/hooks/useNotes';
import { useCategories } from '@/hooks/useCategories';
import { NoteCard } from '@/components/NoteCard';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { SearchBar } from '@/components/SearchBar';
import { CategorySelector } from '@/components/CategorySelector';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { Note, Category } from '@/types/Note';
import { FileText, Trash2, X, Check } from 'lucide-react-native';

export default function NotesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const { notes, loading, error, deleteNote } = useNotes();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  
  // 複数選択機能の状態
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());

  const filteredNotes = useMemo(() => {
    let filtered = notes;
    
    // カテゴリーでフィルタリング（複数選択対応）
    if (selectedCategoryIds.length > 0) {
      filtered = filtered.filter(note => 
        note.categoryId && selectedCategoryIds.includes(note.categoryId)
      );
    }
    
    // 検索クエリでフィルタリング
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(note => {
        const titleMatch = note.title.toLowerCase().includes(query);
        const contentMatch = note.content.toLowerCase().includes(query);
        
        // カテゴリー名でも検索
        let categoryMatch = false;
        if (note.categoryId) {
          const category = categories.find(cat => cat.id === note.categoryId);
          if (category) {
            categoryMatch = category.name.toLowerCase().includes(query);
          }
        }
        
        return titleMatch || contentMatch || categoryMatch;
      });
    }
    
    return filtered;
  }, [notes, searchQuery, selectedCategoryIds, categories]);

  const getNoteWithCategory = (note: Note) => {
    const category = note.categoryId ? categories.find(cat => cat.id === note.categoryId) : undefined;
    return { note, category };
  };

  const handleCreateNote = () => {
    router.push('/editor');
  };

  const handleNotePress = (note: Note) => {
    if (isSelectionMode) {
      // 選択モード時は選択状態を切り替え
      const newSelectedNotes = new Set(selectedNotes);
      if (newSelectedNotes.has(note.id)) {
        newSelectedNotes.delete(note.id);
      } else {
        newSelectedNotes.add(note.id);
      }
      setSelectedNotes(newSelectedNotes);
    } else {
      // 通常モード時はエディターを開く
      router.push(`/editor?id=${note.id}`);
    }
  };

  const handleNoteLongPress = (note: Note) => {
    if (!isSelectionMode) {
      // 長押しで選択モードに入る
      setIsSelectionMode(true);
      setSelectedNotes(new Set([note.id]));
    }
  };

  const handleDeleteConfirm = async () => {
    if (noteToDelete) {
      try {
        await deleteNote(noteToDelete.id);
        setDeleteModalVisible(false);
        setNoteToDelete(null);
      } catch (error) {
        Alert.alert('Error', 'Failed to delete note. Please try again.');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setNoteToDelete(null);
  };

  // 複数選択削除の処理
  const handleBulkDelete = () => {
    if (selectedNotes.size === 0) return;

    Alert.alert(
      'Delete Notes',
      `Are you sure you want to delete ${selectedNotes.size} note${selectedNotes.size > 1 ? 's' : ''}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const deletePromises = Array.from(selectedNotes).map(noteId => deleteNote(noteId));
              await Promise.all(deletePromises);
              setSelectedNotes(new Set());
              setIsSelectionMode(false);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete some notes. Please try again.');
            }
          },
        },
      ]
    );
  };

  // 選択モードをキャンセル
  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedNotes(new Set());
  };

  // 全選択/全選択解除
  const handleSelectAll = () => {
    if (selectedNotes.size === filteredNotes.length) {
      // 全選択解除
      setSelectedNotes(new Set());
    } else {
      // 全選択
      setSelectedNotes(new Set(filteredNotes.map(note => note.id)));
    }
  };

  const renderNoteCard = ({ item }: { item: Note }) => {
    const { note, category } = getNoteWithCategory(item);
    const isSelected = selectedNotes.has(note.id);
    
    return (
      <NoteCard
        note={note}
        category={category}
        onPress={() => handleNotePress(note)}
        onLongPress={() => handleNoteLongPress(note)}
        isSelectionMode={isSelectionMode}
        isSelected={isSelected}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FileText size={80} color={isDark ? '#48484A' : '#C7C7CC'} />
      <Text style={[styles.emptyTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
        No notes yet
      </Text>
      <Text style={[styles.emptyMessage, { color: isDark ? '#8E8E93' : '#6D6D70' }]}>
        Tap the + button to create your first note
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
        QuickNote
      </Text>
      <Text style={[styles.subtitle, { color: isDark ? '#8E8E93' : '#6D6D70' }]}>
        {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
        {isSelectionMode && selectedNotes.size > 0 && ` • ${selectedNotes.size} selected`}
      </Text>
    </View>
  );

  const renderSelectionHeader = () => (
    <View style={[styles.selectionHeader, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
      <TouchableOpacity onPress={handleCancelSelection} style={styles.selectionButton}>
        <X size={24} color={isDark ? '#5AC8FA' : '#007AFF'} />
      </TouchableOpacity>
      
      <Text style={[styles.selectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
        {selectedNotes.size} selected
      </Text>
      
      <View style={styles.selectionActions}>
        <TouchableOpacity onPress={handleSelectAll} style={styles.selectionButton}>
          <Text style={[styles.selectionActionText, { color: isDark ? '#5AC8FA' : '#007AFF' }]}>
            {selectedNotes.size === filteredNotes.length ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>
        
        {selectedNotes.size > 0 && (
          <TouchableOpacity onPress={handleBulkDelete} style={styles.deleteButton}>
            <Trash2 size={24} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: isDark ? '#FF453A' : '#FF3B30' }]}>
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
      {isSelectionMode ? renderSelectionHeader() : renderHeader()}
      
      {!isSelectionMode && (
        <>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notes, categories..."
          />

          <CategorySelector
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            onSelectCategories={setSelectedCategoryIds}
            showClearOption={true}
            multiple={true}
          />
        </>
      )}

      <FlatList
        data={filteredNotes}
        renderItem={renderNoteCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          filteredNotes.length === 0 && styles.emptyListContainer
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {!isSelectionMode && <FloatingActionButton onPress={handleCreateNote} />}

      <DeleteConfirmModal
        visible={deleteModalVisible}
        noteTitle={noteToDelete?.title || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  selectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  selectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  selectionButton: {
    padding: 8,
  },
  selectionActionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  deleteButton: {
    padding: 8,
  },
  listContainer: {
    paddingBottom: 120,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});