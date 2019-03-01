// Store
export interface AppState {
  appName: string;
  userPrefs: UserPrefs;
  showAddModal: boolean;
  confirmModalName: string;
  isLoading: boolean;
  alertConfig: AlertConfig;
  snackbarConfig: SnackbarConfig;
  sessions: Session[];
  users: SessionUser[];
  allTags: Tag[];
  currentUser: firebase.User | null;
  newSession: Session | null;
  currentSession: Session | null;
}

// Models
export interface Session {
  id: string;
  title: string;
  description: string;
  datetime?: string;
  tags?: string[];
  createdByUid: string;
  likedBy?: string[];
  acceptedByUid?: string | null;
  acceptedOn?: string;
}

export interface UserPrefs {
  useDarkTheme: boolean;
}

export interface Tag {
  tagName: string;
}

export interface SessionUser {
  email: string;
  name: string;
  uid: string;
  avatarUrl: string;
  userPrefs: UserPrefs;
}

export interface SnackbarConfig {
  show: boolean;
  text: string;
  mode: string;
  multiline: boolean;
  timeout: number;
}

export interface AlertConfig {
  show: boolean;
  text: string;
  mode: string;
  dismissable: boolean;
}
