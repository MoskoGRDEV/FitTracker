import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, ViewStyle } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// Διορθωμένο HapticTab που περνάει σωστά τα props
function HapticTabFixed({ children, onPress, style, ...rest }: any) {
  return (
    <TouchableOpacity
      {...rest} // forward όλων των props
      style={style as ViewStyle}
      onPress={() => {
        onPress?.(); // κρατάμε το onPress
        // Εδώ μπορείς να βάλεις haptic feedback
      }}
    >
      {children}
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTabFixed,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'NotePad',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size ?? 28} name="note" color={color ?? 'black'} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar&activities"
        options={{
          title: 'Calendar&Αctivities',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size ?? 28} name="calendar" color={color ?? 'black'} />
          ),
        }}
      />
      <Tabs.Screen
        name="BMIcalculator"
        options={{
          title: 'BMIcalculator',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="calculator" size={size ?? 24} color={color ?? 'black'} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'settings',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="gear" size={size ?? 24} color={color ?? 'black'} />
          ),
        }}
      />
    </Tabs>
  );
}
