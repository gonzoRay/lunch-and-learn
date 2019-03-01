import { ActionTree } from 'vuex';

import VueI18n from '@/i18n';
import router from '@/router';
import { AppState, Session } from '@/types';

import { firebase, sessionCollection, tagCollection, userCollection } from './db';

export const actions: ActionTree<AppState, any> = {
  SET_LOGGED_IN_USER({ commit }, user: firebase.User) {
    commit('setLoggedInUser', user);
  },
  buildLikedList(state, userIds: string[]) {
    const query = userCollection;
    for (const uId of userIds) {
      query.where('userId', '==', uId);
    }
    return query.get();
  },
  async ADD_SESSION({ dispatch, getters }, newSession: Session) {
    try {
      await dispatch('SAVE_TAGS', newSession.tags);

      // Set owner and add new session
      newSession.createdByUid = getters.currentUserId;
      return await sessionCollection.add(newSession);
    } catch (error) {
      dispatch('handleFirebaseError', error);
    }
  },
  async ACCEPT_SESSION({ commit, dispatch, getters }, payload: any) {
    const currentUserId = getters.currentUserId;
    if (!currentUserId) {
      return;
    }

    const docRef = sessionCollection.doc(payload.id);

    if (!payload.datetime) {
      const errorMessage = 'ACCEPT_SESSION - empty datetime';
      commit('showUnhandledError', errorMessage);
      throw new Error(errorMessage);
    }

    return await docRef
      .update({
        acceptedByUid: currentUserId,
        datetime: payload.datetime,
        acceptedOn: firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch(error => {
        dispatch('handleFirebaseError', error);
        throw new Error(error);
      });
  },
  async DELETE_SESSION({ dispatch }, id: string) {
    const docRef = sessionCollection.doc(id);
    return await docRef.delete().catch(error => {
      dispatch('handleFirebaseError', error);
      throw new Error(error);
    });
  },
  INIT_NEW_SESSION({ commit }) {
    commit('initNewSession');
  },
  LOAD_CURRENT_SESSION({ commit, getters }, id: string) {
    const currentSession = getters.getSessionById(id);
    commit('loadCurrentSession', currentSession);
  },
  routeHome() {
    router.replace('/');
  },
  async SAVE_SESSION({ dispatch }, payload: any) {
    const docRef = sessionCollection.doc(payload.id);

    return await docRef
      .update({
        title: payload.title,
        description: payload.description,
        tags: payload.tags
      })
      .then(() => dispatch('SAVE_TAGS', payload.tags))
      .catch(error => {
        dispatch('handleFirebaseError', error);
        throw new Error(error);
      });
  },
  async SAVE_TAGS({ commit }, tags: string[]) {
    const allTags = tags || [];
    allTags.forEach(async tag => {
      const tagRef = await tagCollection.where('name', '==', tag).get();
      if (tagRef.empty) {
        tagCollection.add({ name: tag });
      }
    });
  },
  saveUserPrefs({ dispatch, getters }, prefs) {
    let userRef: firebase.firestore.DocumentReference;
    userCollection
      .where('uid', '==', getters.currentUserId)
      .get()
      .then((snapshot: firebase.firestore.QuerySnapshot) => {
        userRef = snapshot.docs[0].ref;
        return userRef
          .update({ userPrefs: prefs })
          .catch(error => dispatch('handleFirebaseError', error));
      });
  },
  async registerUserLogin({ commit, state }, user: firebase.User) {
    const userRef = userCollection.where('uid', '==', user.uid).get();

    const result = await userRef;

    if (!result.empty) {
      commit('showSnackbar', {
        text: `Successfully signed in: ${user.displayName}`
      });
      commit('loadUserPrefs', result.docs[0].get('userPrefs'));
      return;
    }

    await userCollection
      .add({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        avatarUrl: user.photoURL,
        userPrefs: {
          useDarkTheme: state.userPrefs.useDarkTheme
        }
      })
      .then(() =>
        commit('showSnackbar', `Successfully registered: ${user.displayName}`)
      );
  },
  likeSessionAsync({ dispatch, getters }, session: Session) {
    const currentUserId = getters.currentUserId;
    let currentSessionId: string;

    // get latest snapshot of model from server
    const docRef = sessionCollection.doc(session.id);
    const sessionDocSnapshot = docRef.get();

    return sessionDocSnapshot.then(
      (snapshot: firebase.firestore.DocumentSnapshot) => {
        currentSessionId = snapshot.id;

        const currentUserLikes = sessionCollection
          .where('likedBy', 'array-contains', currentUserId)
          .get();

        currentUserLikes.then(
          (currentLikes: firebase.firestore.QuerySnapshot) => {
            let payload;
            const likedSessions = currentLikes.docs;

            const alreadyLiked = likedSessions.some(
              s => s.id === currentSessionId
            );

            if (!alreadyLiked) {
              payload = {
                likedBy: firebase.firestore.FieldValue.arrayUnion(currentUserId)
              };
            } else {
              payload = {
                likedBy: firebase.firestore.FieldValue.arrayRemove(
                  currentUserId
                )
              };
            }

            return docRef
              .update(payload)
              .catch(error => dispatch('handleFirebaseError', error));
          }
        );
      }
    );
  },
  handleUnexpectedError({ dispatch }, error) {
    const alertText = VueI18n.t('unhandledError').toString();
    /* tslint:disable-next-line:no-console */
    console.error(`Firebase error: ${alertText}`);
  },
  handleFirebaseError({ commit }, error: firebase.firestore.FirestoreError) {
    let alertText = '';
    switch (error.code) {
      case 'permission-denied':
        alertText = VueI18n.t('permissionDenied').toString();
        break;

      default:
        alertText = VueI18n.t('unhandledFirebaseError').toString();
        /* tslint:disable-next-line:no-console */
        console.error(`Firebase error: ${alertText}`);
    }

    commit('showSnackbar', {
      text: alertText,
      mode: 'error'
    });
  },
  logout(state) {
    return firebase.auth().signOut();
  },
  showAlert({ commit, getters }, alertOptions) {
    if (typeof alertOptions === 'string') {
      const alertOptionsParams = {
        text: alertOptions
      };

      commit('showAlert', {
        ...getters.alertOptions,
        ...alertOptionsParams
      });
    } else {
      commit('showAlert', { ...getters.alertOptions, ...alertOptions });
    }
  },
  showSnackbarError({ commit, dispatch }, label) {
    dispatch('showSnackbar', {
      text: label,
      mode: 'error',
      timeout: 5000
    });
  },
  showSnackbar({ commit, getters }, snackbarOptions) {
    if (typeof snackbarOptions === 'string') {
      const snackbarConfigParams = {
        text: snackbarOptions
      };

      commit('showSnackbar', {
        ...getters.snackbarConfig,
        ...snackbarConfigParams
      });
    } else {
      commit('showSnackbar', { ...getters.snackbarConfig, ...snackbarOptions });
    }
  },
  showConfirmModal({ commit }, modalName) {
    commit('showConfirmModal', modalName);
  },
  hideConfirmModal({ commit }) {
    commit('hideConfirmModal');
  },
  async UNACCEPT_SESSION({ commit, dispatch, getters }, payload: any) {
    const currentUserId = getters.currentUserId;
    if (!currentUserId) {
      return;
    }

    const docRef = sessionCollection.doc(payload.id);

    return await docRef
      .update({
        acceptedByUid: null,
        datetime: null,
        acceptedOn: null
      })
      .catch(error => {
        dispatch('handleFirebaseError', error);
        throw new Error(error);
      });
  }
};

export default actions;
