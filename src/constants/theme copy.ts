import { StyleSheet } from 'react-native';

// Tema anahtarları
export type ThemeKey = 'light' | 'dark' | 'pastel';

// Renk paletleri
const lightColors = {
  primary: '#4B95FF',
  secondary: '#6C757D',
  success: '#28A745',
  danger: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
  light: '#F8F9FA',
  dark: '#343A40',
  white: '#FFFFFF',
  black: '#000000',
  background: '#FFFFFF',
  text: '#212529',
  textSecondary: '#6C757D',
  border: '#DEE2E6',
  card: '#FFFFFF',
  notification: '#4B95FF',
};

const darkColors = {
  primary:   '#1E88E5',
  secondary: '#90A4AE',
  success:   '#43A047',
  danger:    '#E53935',
  warning:   '#FFB300',
  info:      '#00ACC1',
  light:     '#212529',
  dark:      '#121212',
  white:     '#FFFFFF',
  black:     '#000000',
  background:'#121212',
  text:      '#E0E0E0',
  textSecondary: '#B0BEC5',
  border:    '#37474F',
  card:      '#1E272E',
  notification: '#FF7043',
};

const pastelColors = {
  primary:   '#8E44AD',
  secondary: '#F1948A',
  success:   '#82E0AA',
  danger:    '#EC7063',
  warning:   '#F7DC6F',
  info:      '#85C1E9',
  light:     '#FDFEFE',
  dark:      '#566573',
  white:     '#FFFFFF',
  black:     '#000000',
  background:'#FBFCFC',
  text:      '#2C3E50',
  textSecondary: '#5D6D7E',
  border:    '#D5DBDB',
  card:      '#FFFFFF',
  notification: '#F8C471',
};

// Tema koleksiyonu
export const themes: Record<ThemeKey, typeof lightColors> = {
  light: lightColors,
  dark: darkColors,
  pastel: pastelColors,
};

// Stil oluşturma
export const styles = StyleSheet.create({
  colors: { ...lightColors },       // Varsayılan tema
  colors_dark: { ...darkColors },
  colors_pastel: { ...pastelColors },

  typography: {
    h1: { fontSize: 32, fontWeight: 'bold', lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: 'bold', lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: 'bold', lineHeight: 28 },
    body: { fontSize: 16, lineHeight: 24 },
    small:{ fontSize: 14, lineHeight: 20 },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, round: 999 },
  shadows: {
    sm: { shadowColor:'#000', shadowOffset:{width:0.4,height:1}, shadowOpacity:0.18, shadowRadius:1.0, elevation:1 },
    md: { shadowColor:'#000', shadowOffset:{width:0.4,height:2}, shadowOpacity:0.25, shadowRadius:3.84, elevation:5 },
    lg: { shadowColor:'#000', shadowOffset:{width:0.4,height:4}, shadowOpacity:0.30, shadowRadius:4.65, elevation:8 },
  },
});

// Tema uygulama fonksiyonu
export function applyTheme(theme: ThemeKey) {
  const variant = themes[theme] || lightColors;
  Object.assign(styles.colors, variant);
}

// Varsayılan temayı uygula
applyTheme('light');
