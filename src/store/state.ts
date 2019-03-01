import { AlertConfig, AppState, SnackbarConfig } from '@/types';

const alertConfig = {
  show: false,
  text: '',
  mode: 'success',
  dismissable: true
} as AlertConfig;

const snackbarConfig = {
  show: false,
  text: '',
  mode: 'success',
  multiline: false,
  timeout: 3000
} as SnackbarConfig;

export const state: AppState = {
  appName: 'lunch <b>&</b> learn',
  userPrefs: { useDarkTheme: false },
  showAddModal: false,
  confirmModalName: '',
  isLoading: true,
  alertConfig,
  snackbarConfig,
  sessions: [],
  users: [],
  allTags: [],
  currentUser: null,
  newSession: null,
  currentSession: null
};

export default state;
