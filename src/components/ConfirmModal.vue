<template>
  <v-layout row justify-center>
    <v-dialog
      :value="currentConfirmModal === name"
      persistent
      :max-width="($vuetify.breakpoint.smAndUp ? '40%' : '60%')"
    >
      <v-card role="dialog" v-bind:aria-labelledby="prompt" v-bind:aria-describedby="description">
        <v-card-title class="headline">{{ prompt }}</v-card-title>
        <v-card-text>
          {{ description }}
          <slot></slot>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary darken-1"
            v-bind:aria-label="declineText"
            flat
            @click.prevent="onDecline"
          >{{ declineText }}</v-btn>
          <v-btn
            color="primary darken-1"
            v-bind:aria-label="confirmText"
            flat
            @click.native="onConfirm"
          >{{ confirmText }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Mutation, Action, Getter } from 'vuex-class';

@Component
export default class ConfirmModal extends Vue {
  @Prop({ required: true })
  private name!: string;

  @Prop({ default: 'Are you sure?' })
  private prompt!: string;

  @Prop({ default: 'This action cannot be undone.' })
  private description!: string;

  @Prop({ default: 'Yes' })
  private confirmText!: string;

  @Prop({ default: 'No' })
  private declineText!: string;

  @Action
  private showConfirmModal!: (name: string) => void;

  @Action
  private hideConfirmModal!: () => void;


  @Getter
  private currentConfirmModal!: string;

  private resolve: any;

  show() {
    this.showConfirmModal(this.name);
    return new Promise(resolve => {
      this.resolve = resolve;
    });
  }

  private onConfirm() {
    this.hideConfirmModal();
    this.resolve(true);
  }

  private onDecline() {
    this.hideConfirmModal();
    this.resolve(false);
  }
}
</script>

<style lang="stylus">
</style>
