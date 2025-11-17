import React, { useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

interface SwipeBackScreenProps {
  children: React.ReactNode;
  onSwipeBack: () => void;
  enabled?: boolean;
}

export const SwipeBackScreen: React.FC<SwipeBackScreenProps> = ({
  children,
  onSwipeBack,
  enabled = true,
}) => {
  const [translateX] = useState(new Animated.Value(0));
  const screenWidth = Dimensions.get('window').width;

  const gesture = Gesture.Pan()
    .enabled(enabled)
    .activeOffsetX([10, 1000]) // Only trigger when swiping from left
    .failOffsetX([-10, 0])
    .onUpdate((event) => {
      // Only allow rightward swipes
      if (event.translationX > 0) {
        translateX.setValue(Math.min(event.translationX, screenWidth));
      }
    })
    .onEnd((event) => {
      // If swiped more than 30% of screen or fast enough, trigger back
      if (event.translationX > screenWidth * 0.3 || event.velocityX > 800) {
        Animated.spring(translateX, {
          toValue: screenWidth,
          useNativeDriver: true,
          speed: 20,
        }).start(() => {
          onSwipeBack();
          translateX.setValue(0);
        });
      } else {
        // Otherwise, spring back to original position
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }).start();
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: translateX }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
