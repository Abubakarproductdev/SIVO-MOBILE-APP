import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import {
  Home,
  MessageSquare,
  History,
  Settings,
} from 'lucide-react-native';
import COLORS from '../constants/colors';
import styles from '../styles/styles';

// =============================================
// BOTTOM TAB BAR
// =============================================
function BottomTabBar({ currentScreen, navigate }) {
  const tabs = [
    { name: 'Home', icon: Home, screen: 'Home' },
    { name: 'Chat', icon: MessageSquare, screen: 'Conversation' },
    { name: 'History', icon: History, screen: 'History' },
    { name: 'Settings', icon: Settings, screen: 'Settings' },
  ];

  return (
    <View style={styles.tabBarWrapper}>
      <SafeAreaView>
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = currentScreen === tab.screen;
            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => navigate(tab.screen)}
                style={styles.tabItem}
              >
                <View
                  style={[
                    styles.tabIconWrapper,
                    isActive && styles.tabIconActive,
                  ]}
                >
                  <tab.icon
                    size={22}
                    color={isActive ? COLORS.primary : COLORS.textMuted}
                  />
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isActive ? COLORS.primary : COLORS.textMuted },
                  ]}
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

export default BottomTabBar;
