<template>
  <v-layout row justify-center>
    <v-dialog
      :value="currentConfirmModal === name"
      persistent
      :max-width="($vuetify.breakpoint.smAndUp ? '40%' : '60%')"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <v-card role="dialog" :aria-labelledby="'prompt' | t" :aria-describedby="'description' | t">
        <v-toolbar dark color="primary" :hidden="$vuetify.breakpoint.smAndUp">
          <v-btn icon dark aria-label="close accept dialog" @click="onDecline">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ 'prompt' | t }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat aria-label="'save'" @click="onConfirm">{{ 'confirmText' | t}}</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-title class="headline" v-show="$vuetify.breakpoint.smAndUp">{{ 'prompt' | t }}</v-card-title>
        <v-card-text>
          <div class="description">{{ 'description' | t }}</div>
          <div class="datetime-form">
            <v-menu
              :close-on-content-click="false"
              v-model="datePicker"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                :value="formatDate()"
                :label="'chooseDateInput' | t"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker
                v-model="sessionDate"
                :min="currentDate"
                @input="onDateSelect($event)"
                class="mt-3"
              ></v-date-picker>
            </v-menu>

            <v-menu
              ref="timePicker"
              :disabled="!sessionDate"
              :close-on-content-click="false"
              v-model="timePicker"
              :nudge-right="40"
              :return-value.sync="sessionTime"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                :value="formatTime()"
                :label="'chooseTimeInput' | t"
                prepend-icon="access_time"
                readonly
              ></v-text-field>
              <v-time-picker
                v-if="timePicker"
                :value="sessionTime"
                @input="$refs.timePicker.save(sessionTime)"
                class="mt-3"
              ></v-time-picker>
            </v-menu>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :aria-label="'declineText' | t"
            flat
            @click.prevent="onDecline"
          >{{ $t('declineText') }}</v-btn>
          <v-btn
            color="primary"
            :aria-label="'confirmText' | t"
            flat
            @click.native="onConfirm"
          >{{ $t('confirmText') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script lang="ts">
import { Component, Model, Prop, Vue } from 'vue-property-decorator';
import { Mutation, Action, Getter } from 'vuex-class';

import format from 'date-fns/format';
import parse from 'date-fns/parse';
import isValid from 'date-fns/is_valid';

@Component
export default class AcceptSessionModal extends Vue {
  @Prop({ required: true })
  private name!: string;

  @Action
  private showConfirmModal!: (name: string) => void;

  @Action
  private hideConfirmModal!: () => void;

  @Getter
  private currentConfirmModal!: string;

  private resolve!: (confirm: boolean) => void;

  private currentDate: string;

  private datePicker: boolean = false;

  private timePicker: boolean = false;

  private sessionDate!: string;
  private sessionTime: any = '11:00:00';

  get sessionDatetime(): Date {
    return parse(`${this.sessionDate}T${this.sessionTime}`);
  }

  constructor() {
    super();

    this.currentDate = new Date().toISOString().substr(0, 10);
    this.sessionDate = '';

  }

  show(): any {
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

  private onDateSelect(): void {
    this.datePicker = false;
  }

  private onTimeSelect(): void {
    this.timePicker = false;
  }

  private formatDate(): string {
    return this.sessionDate ? format(this.sessionDate, 'dddd, MMMM Do YYYY') : '';
  }

  private formatTime(): string {
    if (!isValid(new Date(this.sessionDate)) || !this.sessionTime) {
      return '';
    }

    const displayTime = parse(`${this.sessionDate}T${this.sessionTime}`);
    return displayTime ? format(displayTime, 'hh:mm A') : '';
  }
}
</script>

<style lang="stylus">
.description {
  padding-bottom: 10px;
}
</style>

<i18n>
{
  "en": {
    "prompt": "Accept this talk?",
    "description": "Please choose a date and time to present this talk.",
    "chooseDateInput": "Choose a date for your talk",
    "chooseTimeInput": "Choose a time for your talk",
    "confirmText": "Accept",
    "declineText": "Cancel"
  }
}
</i18n>
