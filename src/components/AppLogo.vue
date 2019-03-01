<template>
  <div>
    <img class="logo" v-bind:src="getLogoImage()" height="120px" title="app logo">
    <div class="fill-height bottom-gradient"></div>
    <h1 class="display-3" v-if="appName">
      <span class="font-weight-light" v-html="appName"></span>
    </h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';

@Component
export default class AppLogo extends Vue {
  @Prop()
  private appName!: string;

  @Getter
  private useDarkTheme!: boolean;

  private getLogoImage(): string {
    return this.useDarkTheme
      ? require('@/assets/logo.png')
      : require('@/assets/logo.png');
  }
}
</script>
