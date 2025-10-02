import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type Card = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  colors: readonly [string, string, ...string[]];
  bg: string;
  titleColor: string;
  descriptionColor: string;
};

const cards: Card[] = [
  {
    id: '1',
    title: 'Бонусы',
    description: 'выбирай бонусы и зарабатывай больше',
    buttonText: 'Выбрать',
    colors: ['#DD41DB', '#AA32A8', '#772376'],
    bg: 'rgba(38, 0, 38, 1)',
    titleColor: 'rgba(180, 111, 180, 1)',
    descriptionColor: 'rgba(220, 160, 220, 1)',
  },
  {
    id: '2',
    title: 'Задания',
    description: 'выполняй задания и получай улучшения',
    buttonText: 'Выполнить',
    colors: ['#1E3CFF', '#1426A8', '#0D165E'],
    bg: 'rgba(10, 20, 60, 1)',
    titleColor: 'rgba(170, 170, 255, 1)',
    descriptionColor: 'rgba(180, 180, 255, 1)',
  },
  {
    id: '3',
    title: 'Колесо Удачи',
    description: 'испытай удачу и получи крутые бонусы',
    buttonText: 'Испытать Удачу',
    colors: ['#00FFAE', '#00C27F', '#008F5D'],
    bg: 'rgba(0, 40, 20, 1)',
    titleColor: 'rgb(140, 221, 191)',
    descriptionColor: 'rgb(173, 216, 200)',
  },
];

export default function TaskScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList<Card>>(null);

  const [fontsLoaded] = useFonts({
    "HalvarBreit-Medium": require("@/assets/HalvarBreit-Md.ttf"),
    "gn": require("@/assets/Gazprombank Sans Normal Italic.ttf"),
  });

  // Анимации для кнопок
  const selectButtonScale = useSharedValue(1);
  const returnButtonScale = useSharedValue(1);

  const selectButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: selectButtonScale.value }],
  }));

  const returnButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: returnButtonScale.value }],
  }));

  const handleSelectPressIn = () => {
    selectButtonScale.value = withSpring(0.95);
  };

  const handleSelectPressOut = () => {
    selectButtonScale.value = withSpring(1);
  };

  const handleReturnPressIn = () => {
    returnButtonScale.value = withSpring(0.95);
  };

  const handleReturnPressOut = () => {
    returnButtonScale.value = withSpring(1);
  };

  const loopedCards = React.useMemo(() => {
    const repeated: Card[] = [];
    for (let i = 0; i < 50; i++) {
      repeated.push(...cards);
    }
    return repeated;
  }, []);

  // анимация фона
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

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


    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: Math.floor(loopedCards.length / 2),
        animated: false,
      });
    }, 100);
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - width }, { translateY: translateY.value - height }],
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value - height }],
  }));
  const animatedStyle4 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - width }, { translateY: translateY.value }],
  }));

  const renderCard = ({ item }: { item: Card }) => (
    <LinearGradient
      colors={item.bg === 'rgba(10, 20, 60, 1)' ? ['#141436', '#0A143C'] : [item.bg, item.bg]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.card}
    >
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <View style={[
            styles.titleWrapper,
            item.id === '3' && styles.wheelTitleWrapper // Добавляем специальный стиль для контейнера
          ]}>
            <Text 
              style={[
                styles.cardTitle, 
                { color: item.titleColor },
                item.id === '3' && styles.wheelTitleText // Специальный стиль для текста
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {item.title}
            </Text>
          </View>
          <View style={styles.descriptionWrapper}>
            <Text 
              style={[styles.cardDescription, { color: item.descriptionColor }]}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {item.description}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <AnimatedTouchableOpacity 
          style={[styles.selectButton, selectButtonAnimatedStyle]} 
          activeOpacity={0.8}
          onPressIn={handleSelectPressIn}
          onPressOut={handleSelectPressOut}
        >
          <LinearGradient
            colors={item.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.selectButtonGradient}
          >
            <LinearGradient
              colors={['rgba(207, 201, 201, 0.55)', 'transparent']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              
            />
            <Text style={styles.selectButtonText}>{item.buttonText}</Text>
          </LinearGradient>
        </AnimatedTouchableOpacity>
      </View>
    </LinearGradient>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      
      <LinearGradient
        colors={['#060698', '#BDCEFA']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <AnimatedImage source={require('@/assets/images/back2.png')} style={[styles.backgroundImage, animatedStyle1]} resizeMode="cover" />
      <AnimatedImage source={require('@/assets/images/back2.png')} style={[styles.backgroundImage, animatedStyle2]} resizeMode="cover" />
      <AnimatedImage source={require('@/assets/images/back2.png')} style={[styles.backgroundImage, animatedStyle3]} resizeMode="cover" />
      <AnimatedImage source={require('@/assets/images/back2.png')} style={[styles.backgroundImage, animatedStyle4]} resizeMode="cover" />

      <View style={[styles.cloudBacks, styles.bottomLeft]}><View style={styles.cloudCircles} /></View>
      <View style={[styles.cloudBacks, styles.bottomRight]}><View style={styles.cloudCircles} /></View>

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.push('/')}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <LinearGradient
          colors={['#DD41DB', '#6629E7', '#1919EF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.balanceBtn}
        >
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.balanceText}>1200 ₽</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <FlatList<Card>
  ref={flatListRef}
  data={loopedCards}
  renderItem={renderCard}
  horizontal
  showsHorizontalScrollIndicator={false}
  keyExtractor={(_, index) => index.toString()}
  snapToInterval={width * 0.75 + 20}
  decelerationRate="fast"
  bounces={false}
  initialScrollIndex={cards.length * 25} // Начинаем с "виртуального" центра
  getItemLayout={(_, index) => ({
    length: width * 0.75 + 20,
    offset: (width * 0.75 + 20) * index,
    index,
  })}
  contentContainerStyle={{
    paddingTop: height * 0.25,
    paddingHorizontal: (width - width * 0.75) / 2,
  }}
/>
      
      <AnimatedTouchableOpacity
        style={[styles.returnBtn, { zIndex: 20 }, returnButtonAnimatedStyle]}
        activeOpacity={0.8}
        onPress={() => router.push('/')}
        onPressIn={handleReturnPressIn}
        onPressOut={handleReturnPressOut}
      >
        <LinearGradient
          colors={['#00FFE0', '#0077FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.returnGradient}
        >
          <LinearGradient
            colors={['rgba(228, 226, 226, 0)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.glowEffect}
          />
          <Text style={styles.returnText}>Вернуться</Text>
        </LinearGradient>
      </AnimatedTouchableOpacity>
    </View>
  );
}

const cloudSize = width * 0.24;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060698' },
  backgroundImage: { position: 'absolute', width, height, top: 0, left: 0, zIndex: 0 },

  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  balanceBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  balanceText: { color: '#fff', fontWeight: 'bold' },

  card: {
    width: width * 0.75,
    height: 350,
    marginHorizontal: 10,
    borderRadius: 22,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  cardContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  textContainer: {
    height: 150,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWrapper: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  wheelTitleWrapper: {
    height: 90, 
  },
  descriptionWrapper: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardTitle: {
    fontFamily: "HalvarBreit-Medium", 
    fontSize: 50,                     
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  wheelTitleText: {
    fontSize: 60, 
  },
  cardDescription: { 
    fontSize: 20, 
    textAlign: 'center', 
    fontFamily: "gs",
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  selectButton: { 
    width: '70%', 
    borderRadius: 25, 
    overflow: 'hidden',
   
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  selectButtonGradient: { 
    paddingVertical: 12, 
    borderRadius: 25, 
    alignItems: 'center', 
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  selectButtonText: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#fff', 
    textAlign: 'center',
    fontFamily: "gs",
    zIndex: 2,
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderRadius: 25,
    zIndex: 1,
  },

  returnBtn: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: width * 0.6,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  returnGradient: { 
    paddingVertical: 14, 
    borderRadius: 30, 
    alignItems: 'center',
    position: 'relative',
  },
  returnText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff',
    zIndex: 2,
  },

  cloudBacks: { position: 'absolute', width: cloudSize * 1.2, height: cloudSize * 0.4, backgroundColor: 'rgb(247, 248, 250)', borderRadius: 50, alignItems: 'center', zIndex: 3 },
  cloudCircles: { position: 'absolute', top: -cloudSize * 0.5, width: cloudSize * 1.6, height: cloudSize * 1.5, backgroundColor: ' rgb(247, 248, 250)', borderRadius: 100 },

  bottomLeft: { bottom: -height * 0.1, left: -width * 0.2, width: cloudSize * 2.5, height: cloudSize * 1.4 },
  bottomRight: { bottom: -height * 0.1, right: -width * 0.2, width: cloudSize * 2.5, height: cloudSize * 1.4 },
});