import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { useAnimateNavbar } from '../hooks/useAnimateNavbar';
import type { AnimatedNavbarProps } from '../types';

// Helper to clamp opacity for Hermes
const safeOpacity = (
  value: Animated.AnimatedInterpolation<any> | number | undefined
): number | Animated.AnimatedInterpolation<any> => {
  if (value === undefined) return 1; // fallback
  if (typeof value === 'number') return Math.max(0, Math.min(1, value));
  if ('interpolate' in value) {
    return value.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  }
  return 1; // fallback
};

const AnimatedNavbar = ({
                          scroll,
                          imageHeight,
                          OverflowHeaderComponent,
                          TopNavbarComponent,
                          headerHeight,
                          headerElevation,
                        }: AnimatedNavbarProps) => {
  const [headerOpacity, overflowHeaderOpacity] = useAnimateNavbar(
    scroll,
    imageHeight,
    headerHeight
  );

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            zIndex: 1, // <--- always integer!
            height: Math.round(headerHeight),
            opacity: safeOpacity(headerOpacity),
            elevation: headerElevation,
          },
        ]}
      >
        {TopNavbarComponent}
      </Animated.View>
      <Animated.View
        style={[
          styles.container,
          styles.overflowHeader,
          {
            zIndex: 0, // <--- always integer!
            height: Math.round(headerHeight),
            opacity: safeOpacity(overflowHeaderOpacity),
          },
        ]}
      >
        {OverflowHeaderComponent}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overflowHeader: {
    backgroundColor: 'transparent',
  },
});

export default AnimatedNavbar;
