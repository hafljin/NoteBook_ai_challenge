import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  Text, 
  Alert,
  useColorScheme,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, Save, Trash2 } from 'lucide-react-native';
import { useNotes } from '@/hooks/useNotes';
import { useCategories } from '@/hooks/useCategories';
import { NoteStorage } from '@/services/noteStorage';
import { CategorySelector } from '@/components/CategorySelector';

export default function EditorScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { createNote, updateNote, deleteNote } = useNotes();
  const { categories, getCategoryById } = useCategories();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);
  const originalTitle = useRef('');
  const originalContent = useRef('');
  const originalCategoryId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (id) {
      loadNote(id);
    } else {
      // Focus title input for new notes
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [id]);

  useEffect(() => {
    // Check for unsaved changes
    const titleChanged = title !== originalTitle.current;
    const contentChanged = content !== originalContent.current;
    const categoryChanged = categoryId !== originalCategoryId.current;
    setHasUnsavedChanges(titleChanged || contentChanged || categoryChanged);
  }, [title, content, categoryId]);

  const loadNote = async (noteId: string) => {
    try {
      setIsLoading(true);
      const note = await NoteStorage.getNoteById(noteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setCategoryId(note.categoryId);
        originalTitle.current = note.title;
        originalContent.current = note.content;
        originalCategoryId.current = note.categoryId;
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty Note', 'Please add a title or content before saving.');
      return;
    }

    try {
      setIsSaving(true);
      
      const noteTitle = title.trim() || 'Untitled';
      const noteContent = content.trim();
      
      if (id) {
        await updateNote(id, { 
          title: noteTitle, 
          content: noteContent,
          categoryId: categoryId
        });
      } else {
        await createNote(noteTitle, noteContent, categoryId);
      }
      
      originalTitle.current = title;
      originalContent.current = content;
      originalCategoryId.current = categoryId;
      setHasUnsavedChanges(false);
      
      // Navigate back to the notes list
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save before leaving?',
        [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
          {
            text: 'Save',
            onPress: handleSave,
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleDelete = () => {
    if (!id) return;
    
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteNote(id);
              if (success) {
                router.replace('/(tabs)');
              } else {
                Alert.alert('Error', 'Failed to delete note. Please try again.');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note. Please try again.');
            }
          },
        },
      ]
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#000000' : '#F2F2F7',
    },
    header: {
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
      borderBottomColor: isDark ? '#38383A' : '#E5E5EA',
    },
    titleInput: {
      color: isDark ? '#FFFFFF' : '#000000',
    },
    contentInput: {
      color: isDark ? '#FFFFFF' : '#000000',
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
    },
  });

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <KeyboardAvoidingView 
        style={styles.flex} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, dynamicStyles.header]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={isDark ? '#5AC8FA' : '#007AFF'} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {id ? 'Edit Note' : 'New Note'}
          </Text>
          
          <View style={styles.headerActions}>
            {id && (
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDelete}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Trash2 size={24} color="#FF3B30" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.saveButton,
                { opacity: (hasUnsavedChanges && !isSaving) ? 1 : 0.5 }
              ]}
              onPress={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isSaving ? (
                <Save size={24} color={isDark ? '#5AC8FA' : '#007AFF'} />
              ) : (
                <Check size={24} color={isDark ? '#5AC8FA' : '#007AFF'} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Title Input */}
        <TextInput
          ref={titleInputRef}
          style={[styles.titleInput, dynamicStyles.titleInput]}
          value={title}
          onChangeText={setTitle}
          placeholder="Note title"
          placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
          returnKeyType="next"
          onSubmitEditing={() => contentInputRef.current?.focus()}
          blurOnSubmit={false}
        />

        {/* Category Selector */}
        <CategorySelector
          categories={categories}
          selectedCategoryIds={categoryId ? [categoryId] : []}
          onSelectCategories={(ids) => setCategoryId(ids.length > 0 ? ids[0] : undefined)}
          showClearOption={true}
          multiple={false}
        />

        {/* Content Input */}
        <TextInput
          ref={contentInputRef}
          style={[styles.contentInput, dynamicStyles.contentInput]}
          value={content}
          onChangeText={setContent}
          placeholder="Start writing..."
          placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
          multiline
          textAlignVertical="top"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleInput: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 16,
  },
});