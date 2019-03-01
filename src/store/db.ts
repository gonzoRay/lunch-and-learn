import Vue from 'vue';
import VueFirestore from 'vue-firestore';

import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from '@/firebase.config';
import firebase from 'firebase/app';

import { store } from '@/store';
import state from '@/store/state';
import { Session, SessionUser } from '@/types';

Vue.use(VueFirestore);

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
let sessionUnsubscribe;
let tagUnsubscribe;

const sessionCollection = db.collection('sessions');
const tagCollection = db.collection('tags');
const userCollection = db.collection('users');

const onError = src => error => {
  /* tslint:disable-next-line:no-console */
  console.error(`Firebase onSnapshot failed: ${error} src: ${src}`);
};

// Subscribe to changes in authentication state
firebase.auth().onAuthStateChanged(user => {
  store.dispatch('SET_LOGGED_IN_USER', user);

  if (!user) {
    return;
  }

  // Subscribe to changes in Firestore collections in Firebase
  sessionUnsubscribe = sessionCollection.onSnapshot(sessionsRef => {
    if (!firebase.auth().currentUser) {
      return;
    }

    state.isLoading = true;
    state.sessions = [];
    sessionsRef.forEach(doc => {
      const session = doc.data();
      session.id = doc.id;
      state.sessions.push(session as Session);
    });
    state.isLoading = false;
  }, onError('session'));

  tagUnsubscribe = tagCollection.onSnapshot(tagRef => {
    if (!firebase.auth().currentUser) {
      return;
    }

    state.isLoading = true;
    state.allTags = [];
    tagRef.forEach(tagDoc => {
      state.allTags.push(tagDoc.data().name);
    });
    state.isLoading = false;
  }, onError('tags'));

  store.dispatch('routeHome');
});

const userUnsubscribe = userCollection.onSnapshot(userRef => {
  state.isLoading = true;
  state.users = [];
  userRef.forEach(tagDoc => {
    const user = tagDoc.data() as SessionUser;
    state.users.push(user);
  });
  state.isLoading = false;
}, onError('users'));

export {
  tagCollection,
  sessionCollection,
  userCollection,
  sessionUnsubscribe,
  tagUnsubscribe,
  userUnsubscribe,
  db,
  firebase
};
