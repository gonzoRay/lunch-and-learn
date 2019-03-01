import { GetterTree } from 'vuex';

import { AppState, Session, SessionUser } from '@/types';
import addMinutes from 'date-fns/add_minutes';
import format from 'date-fns/format';
import isBefore from 'date-fns/is_before';

export const getters: GetterTree<AppState, any> = {
  appName: state => state.appName,
  appTitle: state => state.appName.replace(/<(?:.|\n)*?>/gm, ''),
  userPrefs: state => state.userPrefs,
  useDarkTheme: state => state.userPrefs.useDarkTheme || false,
  getSessionById: (state: AppState) => (id: string): Session | undefined =>
    state.sessions.find(s => s.id === id),
  getSessionOwnerId: (state: AppState) => (id: string): string | undefined => {
    const foundItem = state.sessions.find(s => s.id === id) as Session;
    if (!foundItem) {
      return '';
    }

    return foundItem.acceptedByUid || foundItem.createdByUid;
  },
  getSessionSpeaker: (state: AppState) => (
    acceptedByUid: string
  ): SessionUser | undefined => {
    return state.users.find(u => u.uid === acceptedByUid);
  },
  getSessionOwnerName: (state: AppState) => (
    id: string
  ): string | undefined => {
    const foundItem = state.sessions.find(s => s.id === id) as Session;
    const ownerId = foundItem.acceptedByUid || foundItem.createdByUid;
    const owner = state.users.find(u => u.uid === ownerId) as SessionUser;

    return owner ? `${owner.name}` : 'no owner found';
  },
  getSessionsByTagName: (state: AppState) => (tagName: string): Session[] => {
    return state.sessions.filter(s =>
      s.tags!.some(t => t.toLowerCase() === tagName.toLowerCase())
    );
  },
  isMyTalk: (state: AppState) => (item: Session): boolean => {
    const currentUid = state.currentUser && state.currentUser.uid;

    if (
      item.acceptedByUid === currentUid ||
      (!item.acceptedByUid && item.createdByUid === currentUid)
    ) {
      return true;
    }

    return false;
  },
  isOwner: (state: AppState, getters) => (id: string) => {
    return getters.currentUserId === getters.getSessionOwnerId(id);
  },
  likedByMe: (state: AppState) => (session: Session): boolean => {
    const likedBy = session.likedBy || [];
    const currentUser = state.currentUser as firebase.User;
    return likedBy.some((userId: string) => currentUser.uid === userId);
  },
  likeCount: (state: AppState) => (id: string): number => {
    const foundSession = state.sessions.find(s => s.id === id) as Session;

    const likedBy =
      foundSession && foundSession.likedBy ? foundSession.likedBy : 0;
    return (likedBy && likedBy.length) || 0;
  },
  proposed: state =>
    state.sessions.filter(
      session => !session.datetime && !session.acceptedByUid
    ),
  accepted: state => state.sessions.filter(session => session.acceptedByUid),
  past: state =>
    state.sessions
      .filter(
        session => session.datetime !== null || session.datetime !== undefined
      )
      .filter(session => {
        const sessionDate = session.datetime
          ? new Date(session.datetime)
          : undefined;
        if (!sessionDate) {
          return false;
        }

        isBefore(sessionDate, new Date());
      }),
  mySessions: state => {
    const currentUser = (state.currentUser as firebase.User) || undefined;
    const currentUserId = currentUser ? currentUser.uid : '';
    return state.sessions.filter(
      s => s.createdByUid === currentUserId || s.acceptedByUid === currentUserId
    );
  },
  showAddModal: state => state.showAddModal,
  currentConfirmModal: state => state.confirmModalName,
  isLoading: state => state.isLoading,
  alertConfig: state => state.alertConfig,
  snackbarConfig: state => state.snackbarConfig,
  allTags: state => state.allTags,
  currentSession: state => state.currentSession,
  newSession: state => state.newSession,
  currentUser: state => state.currentUser,
  currentUserId: state => {
    return state.currentUser && state.currentUser.uid
      ? state.currentUser.uid
      : '';
  },
  timelineEvents: (state, getters) =>
    state.sessions
      .filter(session => session.acceptedByUid && session.datetime)
      .map(session => {
        return {
          id: session.id,
          title: session.title,
          description: session.description,
          startTime: session.datetime,
          speaker: getters.getSessionSpeaker(session.acceptedByUid)
        };
      }),
  calendarEvents: state =>
    state.sessions
      .filter(session => session.acceptedByUid && session.datetime)
      .map(session => {
        const timestamp = session.datetime as any;
        const startTime = new Date(+timestamp.seconds * 1000);
        const endTime = addMinutes(startTime, 30);
        return {
          sessionId: session.id,
          start: format(startTime, 'YYYY-MM-DD HH:mm'),
          end: format(endTime, 'YYYY-MM-DD HH:mm'),
          title: session.title,
          content: '<a href="#">View Detail</a>'
        };
      })
};

export default getters;
