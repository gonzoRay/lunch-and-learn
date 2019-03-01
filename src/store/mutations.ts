import { MutationTree } from 'vuex';

import { AppState, Session } from '@/types';

export const mutations: MutationTree<AppState> = {
  toggleDarkTheme(state) {
    state.userPrefs.useDarkTheme = !state.userPrefs.useDarkTheme;
  },
  hideAddSessionModal(state) {
    state.showAddModal = false;
  },
  hideConfirmModal(state) {
    state.confirmModalName = '';
  },
  loadCurrentSession(state, payload) {
    state.currentSession = payload;
  },
  loadSessions(state, sessions: Session[]) {
    state.isLoading = false;
    state.sessions = sessions;
  },
  loadUserPrefs(state, payload = null) {
    state.userPrefs = payload;
  },
  initNewSession(state, payload) {
    state.newSession =
      payload ||
      ({
        id: '',
        title: '',
        description: '',
        tags: [],
        createdByUid: '',
        acceptedByUid: null
      } as Session);
  },
  setLoggedInUser(state, user) {
    state.currentUser = user;
  },
  showAddSessionModal(state) {
    state.showAddModal = true;
  },
  showAlert(state, payload) {
    state.alertConfig = Object.assign({}, state.alertConfig, payload);
    state.alertConfig.show = true;
  },
  showConfirmModal(state, payload) {
    state.confirmModalName = payload;
  },
  showSnackbar(state, payload) {
    state.snackbarConfig = payload;
    state.snackbarConfig.multiline = payload.text && payload.text.length > 50 ? true : false;
    state.snackbarConfig.show = true;
  },
  showUnhandledError(state, payload) {
    if (typeof payload === 'object') {
      /* tslint:disable-next-line:no-console */
      console.error(`Unhandled app error: %o`, payload);
    } else {
      /* tslint:disable-next-line:no-console */
      console.error(`Unhandled app error: ${payload}`);
    }
  }
};

export default mutations;
