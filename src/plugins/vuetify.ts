import 'vuetify/src/stylus/app.styl';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import { theme } from '@/theme';

Vue.use(Vuetify, {
  iconfont: 'md',
  options: {
    customProperties: true
  },
  theme
});
