<template>
  <v-alert
    origin="top"
    v-model="config.show"
    :type="config.mode"
    :dismissible="config.dismissable === true ? true : false"
    :icon="config.icon"
  >{{ config.text }}</v-alert>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';

import { AlertConfig } from '@/types';

@Component
export default class Alert extends Vue {
  @Getter('alertConfig')
  private config!: AlertConfig;
}
</script>

<style>
</style>
