import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { ChatProvider } from './ChatContext';
import { auth, onAuthStateChanged } from './src/config/firebase';
import COLORS from './src/constants/colors';
import styles from './src/styles/styles';

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

// =============================================
// MAIN APP COMPONENT (Fixed Splash & History)
// =============================================
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Splash');
  const [user, setUser] = useState(null);
  
  // State to hold the specific chat we want to view in History
  const [activeHistoryItem, setActiveHistoryItem] = useState(null);

  // 1. AUTH LISTENER (Restored)
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          // If we are currently on Splash or Login, go to Home
          if (currentScreen === 'Login' || currentScreen === 'Splash') {
            setCurrentScreen('Home');
          }
        } else {
          setUser(null);
          // If we logged out, go to Login
          if (currentScreen !== 'Splash') {
            setCurrentScreen('Login');
          }
        }
      });
      return unsubscribe;
    }
  }, [currentScreen]);

  // 2. SPLASH TIMER (Restored - Fixes the stuck screen)
  useEffect(() => {
    if (currentScreen === 'Splash') {
      const timer = setTimeout(() => {
        if (!user) {
          setCurrentScreen('Login');
        } else {
          setCurrentScreen('Home');
        }
      }, 2500); // 2.5 seconds delay
      return () => clearTimeout(timer);
    }
  }, [currentScreen, user]);

  // 3. NAVIGATION HANDLER
  const navigate = (screenName, data = null) => {
    if (data) {
      // If data is passed (like a history item), save it so the next screen can use it
      setActiveHistoryItem(data);
    }
    setCurrentScreen(screenName);
  };

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
      default: return <HomeScreen navigate={navigate} />;
    }
  };

  return (
    <ChatProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
        {showTopBar && (
          <TopBar screen={currentScreen} onBackClick={() => navigate('Home')} />
        )}
        <View style={styles.screenContainer}>{renderScreen()}</View>
        {showBottomBar && (
          <BottomTabBar currentScreen={currentScreen} navigate={navigate} />
        )}
      </View>
    </ChatProvider>
  );
}