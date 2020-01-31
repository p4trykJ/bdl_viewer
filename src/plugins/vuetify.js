import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import pl from 'vuetify/es5/locale/pl';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: {pl},
    current: 'pl',
  },
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: '#cad3d2',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
      dark: {
        primary: '#caa3d2',
        secondary: '#a0bec5',
        accent: '#8caeff',
        error: '#b21a1b',
      },
    },
  },
});
