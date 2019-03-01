import Vue from 'vue';

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';

const fromFirebaseTimestamp = (value: any) => {
  if (value) {
    return new Date(+value.seconds * 1000);
  }
};

const formatDate = (value: any, isMobile: boolean) => {
  if (value) {
    return isMobile
      ? format(value, 'MMM Do, YYYY (ddd)')
      : format(value, 'MMMM Do, YYYY (dddd)');
  }
};

const formatDateWithTime = (value: any, isMobile: boolean) => {
  if (value) {
    return isMobile
      ? format(value, 'MMM Do, YYYY @ hh:mm A (ddd)')
      : format(value, 'MMMM Do, YYYY @ hh:mm A (dddd)');
  }
};

const formatTime = (value: any) => {
  if (value) {
    return format(value, 'hh:mm A');
  }
};

const toNow = (value: any) => {
  if (value) {
    return distanceInWordsToNow(value);
  }
};

const toISOString = (value: any) => {
  if (value) {
    const date = fromFirebaseTimestamp(value);

    if (!date) {
      return;
    }

    return date.toISOString();
  }
};

Vue.filter('fromFirebaseTimestamp', fromFirebaseTimestamp);
Vue.filter('formatDate', formatDate);
Vue.filter('formatDateWithTime', formatDateWithTime);
Vue.filter('formatTime', formatTime);
Vue.filter('timeAgo', toNow);
Vue.filter('toISOString', toISOString);
