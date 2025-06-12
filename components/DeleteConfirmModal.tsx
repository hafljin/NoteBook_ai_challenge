import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, useColorScheme } from 'react-native';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface DeleteConfirmModalProps {
  visible: boolean;
  noteTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ visible, noteTitle, onConfirm, onCancel }: DeleteConfirmModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const dynamicStyles = StyleSheet.create({
    overlay: {
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
      backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
    },
    title: {
      color: isDark ? '#FFFFFF' : '#000000',
    },
    message: {
      color: isDark ? '#8E8E93' : '#6D6D70',
    },
    cancelButton: {
      backgroundColor: isDark ? '#3A3A3C' : '#F2F2F7',
    },
    cancelText: {
      color: isDark ? '#FFFFFF' : '#000000',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={[styles.overlay, dynamicStyles.overlay]}>
        <View style={[styles.modal, dynamicStyles.modal]}>
          <View style={styles.iconContainer}>
            <AlertTriangle size={48} color="#FF3B30" />
          </View>
          
          <Text style={[styles.title, dynamicStyles.title]}>Delete Note</Text>
          
          <Text style={[styles.message, dynamicStyles.message]}>
            Are you sure you want to delete "{noteTitle || 'Untitled'}"? This action cannot be undone.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, dynamicStyles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, dynamicStyles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={onConfirm}
            >
              <Text style={[styles.buttonText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modal: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    // Dynamic styles applied above
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  deleteText: {
    color: '#FFFFFF',
  },
});