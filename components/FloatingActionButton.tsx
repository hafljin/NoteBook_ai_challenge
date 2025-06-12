import React from 'react';
import { TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Plus } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface FloatingActionButtonProps {
  onPress: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const dynamicStyles = StyleSheet.create({
    fab: {
      backgroundColor: isDark ? '#5AC8FA' : '#007AFF',
      shadowColor: isDark ? '#5AC8FA' : '#007AFF',
    },
  });

  return (
    <AnimatedTouchableOpacity
      style={[styles.fab, dynamicStyles.fab, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});