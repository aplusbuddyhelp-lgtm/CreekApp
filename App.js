import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

// Keep splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

// ========== CUSTOM SPLASH SCREEN ==========
const CustomSplashScreen = ({ onFinish }) => {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const progressAnim = useState(new Animated.Value(0))[0];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    const timer = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  Animated.timing(progressAnim, { toValue: progress, duration: 200, useNativeDriver: false }).start();

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.splashContainer}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.logoText}>Creek.</Text>
      </Animated.View>
      <View style={styles.loadingBarContainer}>
        <Animated.View style={[styles.loadingBarFill, { width: progressWidth }]} />
      </View>
      <Text style={styles.footerText}>by Kreek inc.</Text>
    </View>
  );
};

// ========== MAIN CONTENT ==========
function MainContent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.content, { paddingBottom: insets.bottom }]}>
      <Text style={styles.text}>Creek App is Ready!</Text>
      <Text style={styles.subText}>Your reels feed will appear here</Text>
    </View>
  );
}

// ========== APP ==========
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Simulate loading resources
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  if (showSplash) {
    return <CustomSplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <MainContent />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ========== STYLES ==========
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00FF00',
    letterSpacing: 2,
  },
  loadingBarContainer: {
    width: width * 0.6,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 80,
  },
  loadingBarFill: {
    height: '100%',
    backgroundColor: '#00FF00',
    borderRadius: 2,
  },
  footerText: {
    fontSize: 14,
    color: '#00FF00',
    opacity: 0.7,
    position: 'absolute',
    bottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#00FF00',
    fontSize: 24,
    marginBottom: 10,
  },
  subText: {
    color: '#888',
    fontSize: 14,
  },
});
