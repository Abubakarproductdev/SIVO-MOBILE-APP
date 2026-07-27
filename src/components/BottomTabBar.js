import React from 'react';
import { View, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Home,
  MessageSquare,
  History,
  Settings,
  Crown,
} from 'lucide-react-native';
import { SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

function BottomTabBar({ currentScreen, navigate }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const tabs = [
    { name: 'Home', icon: Home, screen: 'Home' },
    { name: 'Chat', icon: MessageSquare, screen: 'Conversation' },
    { name: 'History', icon: History, screen: 'History' },
    { name: 'Upgrade', icon: Crown, screen: 'Upgrade' },
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
                activeOpacity={0.7}
              >
                <View style={styles.tabIconWrapper}>
                  <tab.icon
                    size={24}
                    color={isActive ? colors.primary : colors.textMuted}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  tabBarWrapper: { 
    backgroundColor: colors.bgDark, 
    borderTopWidth: 1, 
    borderTopColor: colors.border 
  },
  tabBar: {  
    height: 76, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    paddingBottom: 19, 
    paddingTop: 12 
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.sm },
  tabIconWrapper: { alignItems: 'center', justifyContent: 'center' },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: -10,
  }
});

export default BottomTabBar;
