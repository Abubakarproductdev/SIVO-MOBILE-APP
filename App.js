import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, View, StatusBar, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { ChatProvider } from './ChatContext';
import { auth, onAuthStateChanged } from './src/config/firebase';
import { syncCurrentUser } from './src/services/userService';
import COLORS from './src/constants/colors';

// Components
import TopBar from './src/components/TopBar';
import BottomTabBar from './src/components/BottomTabBar';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import HistoryDetailScreen from './src/screens/HistoryDetailScreen';
import LiveConversationScreen from './src/screens/LiveConversationScreen';
import SignToSpeechScreen from './src/screens/SignToSpeechScreen';
import SpeechToSignScreen from './src/screens/SpeechToSignScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// =============================================
// MAIN APP COMPONENT
// =============================================
export default function App() {
  const [navigationStack, setNavigationStack] = useState(['Splash']);
  const [user, setUser] = useState(null);
  const [activeHistoryItem, setActiveHistoryItem] = useState(null);
  const currentScreen = navigationStack[navigationStack.length - 1];

  let [fontsLoaded] = useFonts({
    Orbitron_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const resetNavigation = useCallback((screenName) => {
    setNavigationStack([screenName]);
  }, []);

  const navigate = useCallback((screenName, data = null, options = {}) => {
    if (data !== null) {
      setActiveHistoryItem(data);
    }

    setNavigationStack((prev) => {
      if (options.reset) return [screenName];
      if (options.replace) return [...prev.slice(0, -1), screenName];
      if (prev[prev.length - 1] === screenName) return prev;
      return [...prev, screenName];
    });
  }, []);

  const goBack = useCallback(() => {
    setNavigationStack((prev) => {
      if (prev.length > 1) return prev.slice(0, -1);
      if (user && prev[0] !== 'Home') return ['Home'];
      return prev;
    });
  }, [user]);

  // 1. AUTH LISTENER
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          syncCurrentUser().catch((error) => console.log('User sync error:', error.message));
          setNavigationStack((prev) => {
            const activeScreen = prev[prev.length - 1];
            return activeScreen === 'Login' || activeScreen === 'Splash' ? ['Home'] : prev;
          });
        } else {
          setUser(null);
          setNavigationStack((prev) => (prev[prev.length - 1] === 'Splash' ? prev : ['Login']));
        }
      });
      return unsubscribe;
    }
  }, []);

  // 2. SPLASH TIMER
  useEffect(() => {
    if (currentScreen === 'Splash') {
      const timer = setTimeout(() => {
        if (!user) {
          resetNavigation('Login');
        } else {
          resetNavigation('Home');
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, resetNavigation, user]);

  // 3. ANDROID HARDWARE BACK HANDLER
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentScreen === 'Splash' || currentScreen === 'Login') {
        return false;
      }

      goBack();
      return true;
    });

    return () => subscription.remove();
  }, [currentScreen, goBack]);

  const tabScreens = ['Home', 'History', 'Conversation', 'Settings'];
  const authScreens = ['Splash', 'Login', 'HistoryDetail']; 
  const showTopBar = !authScreens.includes(currentScreen);
  const showBottomBar = tabScreens.includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash': return <SplashScreen />;
      case 'Login': return <LoginScreen navigate={navigate} />;
      case 'Home': return <HomeScreen navigate={navigate} />;
      
      case 'History': return <HistoryScreen navigate={navigate} />;
      case 'HistoryDetail': return <HistoryDetailScreen item={activeHistoryItem} navigate={navigate} />;
      
      case 'Conversation': return <LiveConversationScreen navigate={navigate} />;
      case 'SpeechToSign': return <SpeechToSignScreen navigate={navigate} />;
      case 'SignToSpeech': return <SignToSpeechScreen navigate={navigate} />;
      case 'Settings': return <SettingsScreen navigate={navigate} />;
      case 'Profile': return <ProfileScreen navigate={navigate} />;
      default: return <HomeScreen navigate={navigate} />;
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ChatProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
        {showTopBar && (
          <TopBar
            screen={currentScreen}
            onBackClick={goBack}
            onProfilePress={() => navigate('Profile')}
          />
        )}
        <View style={styles.screenContainer}>{renderScreen()}</View>
        {showBottomBar && (
          <BottomTabBar currentScreen={currentScreen} navigate={navigate} />
        )}
      </View>
    </ChatProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  screenContainer: { flex: 1 },
});
