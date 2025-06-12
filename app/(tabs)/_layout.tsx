import { Tabs } from 'expo-router';
import { NotebookPen, Settings } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  const tintColorLight = '#007AFF';
  const tintColorDark = '#5AC8FA';
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorScheme === 'dark' ? tintColorDark : tintColorLight,
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#8E8E93' : '#8E8E93',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
          borderTopColor: colorScheme === 'dark' ? '#38383A' : '#E5E5EA',
          borderTopWidth: 0.5,
          paddingBottom: 8,
          paddingTop: 8,
          height: 84,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notes',
          tabBarIcon: ({ size, color }) => (
            <NotebookPen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}