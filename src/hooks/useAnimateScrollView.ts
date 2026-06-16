import { useRef } from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export const useAnimateScrollView = (
  imageHeight: number,
  disableScale?: boolean,
  onScrollPositionChange?: (y: number) => void
) => {
  const scroll = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;

    // Call the callback function with the scroll position
    if (onScrollPositionChange) {
      onScrollPositionChange(y);
    }
  };

  const scale = scroll.interpolate({
    inputRange: [-imageHeight, 0, imageHeight],
    outputRange: [2.5, 1, 0.85],
    extrapolate: 'clamp',
  });

  const translateYDown = scroll.interpolate({
    inputRange: [-imageHeight, 0, imageHeight],
    outputRange: [-imageHeight * 0.6, 0, imageHeight * 0.5],
    extrapolate: 'clamp',
  });

  const translateYUp = scroll.interpolate({
    inputRange: [-imageHeight, 0, imageHeight],
    outputRange: [imageHeight * 0.3, 0, 0],
    extrapolate: 'clamp',
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scroll } } }],
    { useNativeDriver: true, listener: handleScroll }
  );

  return [
    scroll,
    onScroll,
    disableScale ? 1 : scale,
    disableScale ? 0 : translateYDown,
    disableScale ? 0 : translateYUp,
  ] as const;
};
