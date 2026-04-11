import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Home,
  MessageSquare,
  History,
  Settings,
} from 'lucide-react-native';
import COLORS from '../constants/colors';
import { RADIUS, TYPOGRAPHY, SPACING } from '../constants/theme';

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

const styles = StyleSheet.create({
  tabBarWrapper: { backgroundColor: COLORS.bgCard, borderTopWidth: 1, borderTopColor: COLORS.border },
  tabBar: {  height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingBottom: 25, paddingTop: 20 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.sm },
  tabIconWrapper: { width: 44, height: 36, justifyContent: 'center', alignItems: 'center', borderRadius: RADIUS.md },
  tabIconActive: { backgroundColor: 'rgba(99, 102, 241, 0.15)' },
  tabLabel: { fontSize: TYPOGRAPHY.size.tiny, fontWeight: TYPOGRAPHY.weight.medium, marginTop: 4 },
});

export default BottomTabBar;
