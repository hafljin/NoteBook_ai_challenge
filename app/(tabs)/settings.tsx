import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Linking, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Info, Heart, Mail, Shield, Book, Tag, Plus, Edit3, Trash2, X } from 'lucide-react-native';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types/Note';
import { CategoryTag } from '@/components/CategoryTag';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
  
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('#FF6B6B');

  const predefinedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@quicknote.app?subject=QuickNote Support');
  };

  const handlePrivacyPolicy = () => {
    // In a real app, this would open the privacy policy
    console.log('Privacy Policy');
  };

  const handleAbout = () => {
    // In a real app, this would show more details
    console.log('About QuickNote');
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryColor('#FF6B6B');
    setCategoryModalVisible(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryColor(category.color);
    setCategoryModalVisible(true);
  };

  const handleDeleteCategory = (category: Category) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"? Notes in this category will not be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(category.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete category');
            }
          },
        },
      ]
    );
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: categoryName.trim(),
          color: categoryColor,
        });
      } else {
        await createCategory(categoryName.trim(), categoryColor);
      }
      setCategoryModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save category');
    }
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress 
  }: { 
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: isDark ? '#8E8E93' : '#6D6D70' }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Settings
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#8E8E93' : '#6D6D70' }]}>
              CATEGORIES
            </Text>
            <TouchableOpacity onPress={handleAddCategory} style={styles.addButton}>
              <Plus size={20} color={isDark ? '#5AC8FA' : '#007AFF'} />
            </TouchableOpacity>
          </View>
          
          {categories.map((category) => (
            <View key={category.id} style={[styles.categoryItem, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
              <View style={styles.categoryContent}>
                <CategoryTag category={category} size="medium" />
              </View>
              <View style={styles.categoryActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditCategory(category)}
                >
                  <Edit3 size={18} color={isDark ? '#8E8E93' : '#6D6D70'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteCategory(category)}
                >
                  <Trash2 size={18} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#8E8E93' : '#6D6D70' }]}>
            APP INFO
          </Text>
          
          <SettingItem
            icon={<Info size={24} color={isDark ? '#5AC8FA' : '#007AFF'} />}
            title="About QuickNote"
            subtitle="Simple, fast, and private note-taking"
            onPress={handleAbout}
          />
          
          <SettingItem
            icon={<Book size={24} color={isDark ? '#5AC8FA' : '#007AFF'} />}
            title="Version"
            subtitle="1.0.0"
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#8E8E93' : '#6D6D70' }]}>
            PRIVACY & SECURITY
          </Text>
          
          <SettingItem
            icon={<Shield size={24} color={isDark ? '#32D74B' : '#34C759'} />}
            title="Privacy Policy"
            subtitle="Your data stays on your device"
            onPress={handlePrivacyPolicy}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#8E8E93' : '#6D6D70' }]}>
            SUPPORT
          </Text>
          
          <SettingItem
            icon={<Mail size={24} color={isDark ? '#FF6B35' : '#FF6000'} />}
            title="Contact Support"
            subtitle="Get help with QuickNote"
            onPress={handleEmailSupport}
          />
          
          <SettingItem
            icon={<Heart size={24} color={isDark ? '#FF453A' : '#FF3B30'} />}
            title="Made with ❤️"
            subtitle="Thank you for using QuickNote"
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#8E8E93' : '#6D6D70' }]}>
            QuickNote is designed to be simple, fast, and private.{'\n'}
            All your notes are stored locally on your device.
          </Text>
        </View>
      </ScrollView>

      {/* Category Modal */}
      <Modal
        visible={categoryModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
          <View style={[styles.modalHeader, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
            <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
              <X size={24} color={isDark ? '#5AC8FA' : '#007AFF'} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              {editingCategory ? 'Edit Category' : 'New Category'}
            </Text>
            <TouchableOpacity onPress={handleSaveCategory}>
              <Text style={[styles.saveButton, { color: isDark ? '#5AC8FA' : '#007AFF' }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Category Name
            </Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#000000',
                borderColor: isDark ? '#38383A' : '#E5E5EA'
              }]}
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Enter category name"
              placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
            />

            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Color
            </Text>
            <View style={styles.colorGrid}>
              {predefinedColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    categoryColor === color && styles.selectedColorButton
                  ]}
                  onPress={() => setCategoryColor(color)}
                />
              ))}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.5,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 12,
  },
  categoryContent: {
    flex: 1,
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 12,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  saveButton: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorButton: {
    borderColor: '#000000',
    borderWidth: 3,
  },
});