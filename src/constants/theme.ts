import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Renkler
  colors_default: {
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
  },

  colors_dark: {
    primary:   '#1E88E5',  // canlı mavi
    secondary: '#90A4AE',  // açık gri
    success:   '#43A047',  // koyu yeşil
    danger:    '#E53935',  // canlı kırmızı
    warning:   '#FFB300',  // koyu sarı
    info:      '#00ACC1',  // cam göbeği
    light:     '#212529',  // neredeyse siyah
    dark:      '#121212',  // tamamen karanlık
    white:     '#FFFFFF',
    black:     '#000000',
    background:'#121212',  // koyu arka plan
    text:      '#E0E0E0',  // açık gri metin
    textSecondary: '#B0BEC5', // ikincil metin
    border:    '#37474F',  // koyu gri
    card:      '#1E272E',  // koyu kart rengi
    notification: '#FF7043' // turuncu bildirim
  },


  colors: {
    primary:   '#8E44AD',  // leylak
    secondary: '#F1948A',  // pastel pembe
    success:   '#82E0AA',  // pastel yeşil
    danger:    '#EC7063',  // pastel kırmızı
    warning:   '#F7DC6F',  // açık sarı
    info:      '#85C1E9',  // pastel mavi
    light:     '#FDFEFE',  // neredeyse beyaz
    dark:      '#566573',  // uçuk lacivert
    white:     '#FFFFFF',
    black:     '#000000',
    background:'#FBFCFC',  // çok açık gri
    text:      '#2C3E50',  // koyu mavi-gri
    textSecondary: '#5D6D7E', // ikincil metin
    border:    '#D5DBDB',  // açık gri
    card:      '#FFFFFF',  // beyaz kart
    notification: '#F8C471' // açık turuncu
  },

  // Tipografi
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: 'bold',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    small: {
      fontSize: 14,
      lineHeight: 20,
    },
  },

  // Boşluklar
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border Radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },

  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0.4,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width:  0.4,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width:  0.4,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
});