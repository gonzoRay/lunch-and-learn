<template>
  <v-app :dark="useDarkTheme" id="inspire">
    <NavDrawer :drawer="drawer" @change="onDrawerChange($event)" v-if="currentUser"></NavDrawer>
    <v-toolbar dark app fixed :clipped-left="$vuetify.breakpoint.lgAndUp" color="primary">
      <v-toolbar-title style="width: 300px" class="ml-0">
        <v-toolbar-side-icon v-if="currentUser" @click.stop="toggleDrawer"></v-toolbar-side-icon>
        <span class="font-weight-light" v-html="appName"></span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span
        v-if="currentUser"
        class="welcome-msg hidden-xs-only"
      >{{ $t('welcome', [getFirstName()]) }}</span>
      <v-menu
        v-if="currentUser"
        v-model="userMenu"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
      >
        <v-btn icon large slot="activator">
          <v-avatar v-if="currentUser">
            <img :src="getUserPhotoUrl()" alt="user avatar">
          </v-avatar>
        </v-btn>
        <v-card>
          <v-list>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img :src="getUserPhotoUrl()" alt="user avatar">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ getUsername() }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ getUserEmail() }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-action>
                <v-switch :value="useDarkTheme" @change="toggleDarkMode" color="accent"></v-switch>
              </v-list-tile-action>
              <v-list-tile-title>Use dark theme</v-list-tile-title>
            </v-list-tile>
          </v-list>
          <v-card-actions>
            <v-btn color="primary" flat @click="gotoMySessions()" v-t="'mySessions'"></v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="logout()">Log out</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-container>
        <Alert></Alert>
        <v-layout align-start>
          <router-view :key="$route.fullPath"/>
        </v-layout>
        <v-layout align-end>
          <SnackbarAlert></SnackbarAlert>
        </v-layout>
      </v-container>
    </v-content>

    <v-btn v-if="currentUser" fab bottom right color="primary" fixed @click="showAddSessionModal()">
      <v-icon>add</v-icon>
    </v-btn>
    <AddSessionForm></AddSessionForm>
    <v-footer app>
      <span v-html="appName"></span>
      &nbsp;&copy;{{ getCurrentYear() }}
    </v-footer>
  </v-app>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter, Mutation, Action } from 'vuex-class';

import format from 'date-fns/format';
import firebase from 'firebase/app';
import 'firebase/auth';
import { sessionUnsubscribe, tagUnsubscribe, userUnsubscribe } from '@/store/db';

import AppModal from '@/components/AppModal.vue';
import Alert from '@/components/Alert.vue';
import AddSessionForm from '@/components/AddSessionForm.vue';
import SnackbarAlert from '@/components/SnackbarAlert.vue';
import NavDrawer from '@/components/NavDrawer.vue';
import Sessions from '@/views/Sessions.vue';
import { Session } from '@/types';

@Component({
  components: {
    Alert,
    AddSessionForm,
    Sessions,
    SnackbarAlert,
    NavDrawer
  }
})
export default class App extends Vue {
  private userMenu: boolean;
  private drawer: any;

  @Getter
  private appName!: string;

  @Getter
  private appTitle!: string;

  @Getter
  private useDarkTheme!: boolean;

  @Mutation
  private showAddSessionModal!: void;

  @Mutation
  private toggleDarkTheme!: any;

  @Getter
  private currentUser!: firebase.User;

  constructor() {
    super();
    this.userMenu = false;
    this.drawer = null;
  }

  gotoMySessions() {
    this.userMenu = false;
    this.$router.replace('/mysessions');
  }

  logout() {
    sessionUnsubscribe();
    tagUnsubscribe();
    userUnsubscribe();

    this.$store.dispatch('logout')
      .catch(err => alert(err.message || err))
      .finally(() => {
        this.userMenu = false;
        this.onDrawerChange(false);
        this.$router.replace('/login');
      });
  }

  back(): void {
    this.$router.go(-1);
  }

  showBack(): boolean {
    return this.$route.name === 'details';
  }

  onDrawerChange(event): void {
    this.drawer = event;
  }

  toggleDrawer(event): void {
    this.onDrawerChange(!this.drawer);
  }

  toggleDarkMode(): void {
    this.toggleDarkTheme();

    this.$store.dispatch('saveUserPrefs', { useDarkTheme: this.useDarkTheme });
    this.userMenu = false;
  }

  getFirstName(): string {
    const currentUserDisplayName = this.currentUser ? this.currentUser.displayName : '';
    return currentUserDisplayName ? currentUserDisplayName.split(' ')[0] : '';
  }

  getUsername(): string {
    return this.currentUser && this.currentUser.displayName || '';
  }

  getUserEmail() {
    return this.currentUser ? this.currentUser.email : '<unknown email>';
  }

  getUserPhotoUrl() {
    return this.currentUser ? this.currentUser.photoURL : '';
  }

  getCurrentYear() {
    return new Date().getFullYear();
  }

  protected created(): void {
    document.title = this.appTitle;
  }
}
</script>

<style lang="stylus">
li {
  cursor: pointer;
}

li.router-link-active {
  &.on-dark-text {
    color: var(--v-accent-base);
  }

  color: var(--v-primary-base);
}

.welcome-msg {
  padding-right: 10px;
}

.v-footer {
  padding-left: 5px;
}

.button-link {
  cursor: pointer;
  color: var(--v-primary);
}

.indent-tags {
  padding-left: 12px;
}

.clickable {
  cursor: pointer;
}

.not-clickable {
  cursor: not-allowed !important;
}

.flex-fix {
  width: 100%;
}

.no-select {
  user-select: none;
}
</style>

<i18n>
{
  "en": {
    "welcome": "Welcome, {0}",
    "MySessions": "My Talks"
  }
}
</i18n>