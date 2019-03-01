<template>
  <v-snackbar
    v-model="config.show"
    :color="config.mode"
    :bottom="true"
    :timeout="config.timeout"
    :multline="config.multiline"
    :vertical="$vuetify.breakpoint.xsOnly"
  >{{ config.text }}</v-snackbar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';

import { SnackbarConfig } from '@/types';

@Component
export default class SnackbarAlert extends Vue {
  @Getter('snackbarConfig')
  private config!: SnackbarConfig;
}
</script>

<style>
</style>
