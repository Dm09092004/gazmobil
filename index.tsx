import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function IndexScreen() {
  const [clickSpeed, setClickSpeed] = useState(0);
  const lastClickTime = useRef<number | null>(null);

  const [count, setCount] = useState(0);
  const [bearStage, setBearStage] = useState(0);

  const progress = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Параметры дуги
  const radius = width * 0.4;
  const strokeWidth = 10;
  const circumference = 3 * Math.PI * radius;
  const halfCircumference = circumference / 2;

  useEffect(() => {
    const duration = 15000;

    translateX.value = withRepeat(
      withTiming(width, { duration, easing: Easing.linear }),
      -1,
      false,
      () => { translateX.value = 0; }
    );

    translateY.value = withRepeat(
      withTiming(height, { duration, easing: Easing.linear }),
      -1,
      false,
      () => { translateY.value = 0; }
    );
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value - width },
      { translateY: translateY.value - height }
    ],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value - height }
    ],
  }));

  const animatedStyle4 = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value - width },
      { translateY: translateY.value }
    ],
  }));

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: halfCircumference * (1 - progress.value),
  }));

  const bearImages = [
    require('@/assets/images/image.png'),
    require('@/assets/images/image2.png'),
    require('@/assets/images/image3.png'),
  ];

  const handlePress = () => {
    const now = Date.now();

    // считаем скорость клика
    if (lastClickTime.current) {
      const diff = (now - lastClickTime.current) / 1000;
      if (diff > 0) {
        const cps = 1 / diff;
        setClickSpeed(Number(cps.toFixed(1)));
      }
    }
    lastClickTime.current = now;

    // обновляем деньги
    const newCount = count + 1;
    setCount(newCount);

    progress.value = withTiming(Math.min(progress.value + 0.1, 1), { duration: 400 });

    if (newCount % 10 === 0) {
      setBearStage((prev) => (prev + 1) % bearImages.length);
      progress.value = withTiming(0, { duration: 300 });
    }
  };

  return (
    <View style={styles.container}>
      {/* Градиент неба */}
      <LinearGradient
        colors={['#060698', '#BDCEFA']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Бесшовный фон */}
      <AnimatedImage source={require('@/assets/images/back2.png')} style={[styles.backgroundImage, animatedStyle1]} resizeMode="cover" />
      <AnimatedImage source={require('@/assets/images/back2.png')} style={[styles.backgroundImage, animatedStyle2]} resizeMode="cover" />
      <AnimatedImage source={require('@/assets/images/back2.png')} style={[styles.backgroundImage, animatedStyle3]} resizeMode="cover" />
      <AnimatedImage source={require('@/assets/images/back2.png')} style={[styles.backgroundImage, animatedStyle4]} resizeMode="cover" />

      {/* 🌥️ Облака */}
      <View style={[styles.cloudBack, styles.backRight]}><View style={styles.cloudCircle} /></View>
      <View style={[styles.cloudBack, styles.backLeft]}><View style={styles.cloudCircle} /></View>
      <View style={[styles.cloudFront, styles.frontLeft]} />
      <View style={[styles.cloudFront, styles.frontRight]} />
      <View style={[styles.cloudFrontm, styles.frontLeftm]} />
      <View style={[styles.cloudFrontm, styles.frontRightm]} />
      <View style={[styles.cloudBacks, styles.bottomLeft]}><View style={styles.cloudCircles} /></View>
      <View style={[styles.cloudBacks, styles.bottomRight]}><View style={styles.cloudCircles} /></View>

      {/* Кнопки сверху */}
      <View style={styles.topButtons}>
        {/* Розовый большой баланс */}
        <LinearGradient
          colors={['#DD41DB', '#6629E7', '#1919EF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.balanceBtn, styles.bigBalance]}
        >
          <TouchableOpacity activeOpacity={0.7} style={styles.balanceContent}>
            <Text style={styles.bigBalanceText}>{count} ₽</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Голубой — скорость клика */}
        <TouchableOpacity
          style={[styles.balanceBtn, styles.smallBalance]}
          activeOpacity={0.8}
        >
          <View style={styles.balanceContent}>
            <Text style={styles.smallBalanceText}>{clickSpeed} кликов/сек</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Дуга прогресса */}
      <View style={styles.progressWrapper}>
        <Svg height={radius + strokeWidth} width={radius * 3 + strokeWidth}>
          <Defs>
            <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="5%" stopColor="#DD41DB" />
              <Stop offset="95%" stopColor="#FF82BE" />
            </SvgLinearGradient>
          </Defs>
          <AnimatedCircle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke="url(#grad)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${halfCircumference},${circumference}`}
            animatedProps={animatedProps}
            strokeLinecap="round"
            rotation={180}
            originX={radius + strokeWidth / 2}
            originY={radius + strokeWidth / 2}
          />
        </Svg>
      </View>

      {/* Медведь */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={[
          styles.characterWrapper,
          bearStage === 0 && { top: height * 0.36 },
          bearStage === 1 && { top: height * 0.34 },
          bearStage === 2 && { top: height * 0.26, left: width * 0.14 },
        ]}
      >
        <Image
          source={bearImages[bearStage]}
          style={[
            styles.character,
            bearStage === 1 && { width: width * 0.75, height: width * 0.75 },
            bearStage === 2 && { width: width * 0.75, height: width * 0.75 },
          ]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Белая подложка */}
      <View style={styles.bottomWhite} />

      {/*Кнопка ракеты */}
      <TouchableOpacity
        style={styles.bottomBtn}
        activeOpacity={0.8}
        onPress={() => router.push("/task")}
      >
        <LinearGradient
          colors={['#3CFFB9', '#1919EF']}
          start={{ x: -0.1, y: 0 }}
          end={{ x: 1.2, y: 1 }}
          style={styles.bottomGradient}
        >
          <Image source={require('@/assets/images/racet.png')} style={styles.rocket} resizeMode="contain" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const cloudSize = width * 0.24;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060698', alignItems: 'center' },
  backgroundImage: { position: 'absolute', width, height, top: 0, left: 0, zIndex: 0 },

  // кнопки
  topButtons: {
    position: 'absolute',
    top: 70,
    right: 20,
    flexDirection: 'column',
    gap: 12,
    zIndex: 10
  },
  balanceBtn: {
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigBalance: { paddingVertical: 14, paddingHorizontal: 28 },
  smallBalance: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'rgba(88, 255, 255, 1)',
    backgroundColor: 'transparent',
  },
  bigBalanceText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  smallBalanceText: { color: 'rgba(88, 255, 255, 1)', fontSize: 14, fontWeight: '600' },

  // медведь
  characterWrapper: { position: 'absolute', top: height * 0.45, zIndex: 4 },
  character: { width: width * 0.55, height: width * 0.55 },

  // низ
  bottomWhite: { position: 'absolute', bottom: 0, width, height: height * 0.35, backgroundColor: '#fff', zIndex: 1 },
  bottomBtn: {
    position: 'absolute',
    bottom: height * 0.07,
    left: width / 2 - 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    zIndex: 10,
    overflow: 'hidden',
    shadowColor: '#3CFFB9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20
  },
  bottomGradient: { flex: 1, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  rocket: { width: 40, height: 40 },

  // прогресс дуга
  progressWrapper: { position: 'absolute', top: height * 0.38, left: width / 2 - width * 0.4, zIndex: 3 },

  // облака
  cloudBack: { position: 'absolute', width: cloudSize * 1.2, height: cloudSize * 0.4, backgroundColor: 'rgba(222, 225, 238, 1)', borderRadius: 50, alignItems: 'center', zIndex: 3 },
  cloudCircle: { position: 'absolute', top: -cloudSize * 0.3, width: cloudSize * 0.8, height: cloudSize * 0.8, backgroundColor: 'rgba(222, 225, 238, 1)', borderRadius: 100 },
  cloudFront: { position: 'absolute', width: cloudSize * 1.2, height: cloudSize * 0.4, backgroundColor: '#fff', borderRadius: 50, zIndex: 5 },
  cloudFrontm: { position: 'absolute', width: cloudSize * 0.8, height: cloudSize * 0.8, backgroundColor: '#fff', borderRadius: 120, zIndex: 5 },
  cloudBacks: { position: 'absolute', width: cloudSize * 1.2, height: cloudSize * 0.4, backgroundColor: 'rgb(247, 248, 250)', borderRadius: 50, alignItems: 'center', zIndex: 3 },
  cloudCircles: { position: 'absolute', top: -cloudSize * 0.5, width: cloudSize * 1.6, height: cloudSize * 1.5, backgroundColor: ' rgb(247, 248, 250)', borderRadius: 100 },

  // позиции облаков
  backLeft: { top: height * 0.55, left: width * 0.15 },
  backRight: { top: height * 0.55, right: width * 0.15 },
  frontLeft: { top: height * 0.58, left: width * 0.23 },
  frontLeftm: { top: height * 0.55, left: width * 0.28 },
  frontRight: { top: height * 0.58, right: width * 0.2 },
  frontRightm: { top: height * 0.55, right: width * 0.25 },
  bottomLeft: { bottom: -height * 0.1, left: -width * 0.2, width: cloudSize * 2.5, height: cloudSize * 1.4 },
  bottomRight: { bottom: -height * 0.1, right: -width * 0.2, width: cloudSize * 2.5, height: cloudSize * 1.4 },
});
