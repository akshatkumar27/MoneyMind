import React, {useEffect, useRef} from 'react';
import {View, Image, StyleSheet, Animated, Easing} from 'react-native';
import {MascotLoaderProps} from './types';
import { useThemeColors } from "../context/ThemeContext";

export const MascotLoader: React.FC<MascotLoaderProps> = ({size = 120}) => {
    const colors = useThemeColors();
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Scale for shadow to make it shrink as mascot floats up
  const shadowScaleAnim = floatAnim.interpolate({
    inputRange: [-20, 0],
    outputRange: [0.6, 1],
  });

  const shadowOpacityAnim = floatAnim.interpolate({
    inputRange: [-20, 0],
    outputRange: [0.3, 0.8],
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floatAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.imageContainer, {transform: [{translateY: floatAnim}]}]}>
        <Image
          source={require('../asset/mascot.png')}
          style={{width: size, height: size * 1.2}}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View
        style={[
                                  styles.shadow,
                                  {
                                    width: size * 0.6,
                                    height: size * 0.15,
                                    opacity: shadowOpacityAnim,
                                    transform: [{scale: shadowScaleAnim}],
                                  },
                                , { backgroundColor: colors.primary }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  imageContainer: {
    zIndex: 2,
  },
  shadow: {
    borderRadius: 100,
    marginTop: 10,
    zIndex: 1,
  },
});
