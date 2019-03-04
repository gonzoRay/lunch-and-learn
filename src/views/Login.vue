<template>
  <v-container fill-height v-if="!isLoading">
    <v-layout row wrap align-center>
      <v-flex class="text-xs-center">
        <App-Logo :appName="appName"></App-Logo>
        <div class="title font-weight-light">{{ 'siteDescription' | t}}</div>
        <v-layout column>
          <v-flex xs4>&nbsp;</v-flex>
          <v-flex xs4>
            <v-btn
              large
              color="primary"
              flat
              outline
              class="google-logo"
              @click.prevent="signInWithGoogle"
            >
              <img height="25px" src="../assets/google-logo.png">Sign in with Google
            </v-btn>
          </v-flex>
          <v-flex xs4>
            <v-btn large color="info" flat outline @click.prevent="signInAsGuest">Sign in as Guest</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';

import firebase from 'firebase/app';

import AppLogo from '@/components/AppLogo.vue';

@Component({
  components: {
    AppLogo
  }
})
export default class Login extends Vue {
  @Getter
  private appName!: string;

  @Getter
  private isLoading!: boolean;

  private signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((authData: firebase.auth.UserCredential) => {
        this.$store.dispatch('registerUserLogin', authData.user);
        this.$router.replace('/sessions');
      })
      .catch(err => alert(err.message || err));
  }

  private signInAsGuest() {
    const self = this;
    firebase
      .auth()
      .signInAnonymously()
      .catch((error) => {
        self.$store.dispatch('handleFirebaseError', error);
      });
  }
}
</script>

<style lang="stylus">
.google-logo {
  img {
    padding-right: 12px;
  }
}
</style>
