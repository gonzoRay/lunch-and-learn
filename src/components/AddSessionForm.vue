<template>
  <v-dialog
    :value="showAddModal"
    width="800px"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    :hide-overlay="$vuetify.breakpoint.xsOnly"
  >
    <v-card>
      <v-toolbar dark color="primary" :hidden="$vuetify.breakpoint.smAndUp">
        <v-btn icon dark aria-label="close save dialog" @click="hideAddSessionModal">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ 'createNewSessionMobile' | t }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            dark
            flat
            aria-label="'save'"
            :disabled="!addForm"
            type="submit"
            form="addForm"
          >{{ 'submitSession' | t }}</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-title
        v-show="$vuetify.breakpoint.smAndUp"
        class="py-4 title card-title"
      >{{ 'createNewSession' | t }}</v-card-title>
      <v-card-text>
        <v-form id="addForm" v-model="addForm" @submit.prevent="saveSession(newSession)">
          <v-container grid-list-sm class="pa-4">
            <v-layout row wrap>
              <v-flex xs12 align-center justify-space-between>
                <v-layout align-center>
                  <v-text-field
                    v-model="newSession.title"
                    prepend-icon="title"
                    :counter="50"
                    v-bind:placeholder="$t('title')"
                    :rules="validators.title.rules"
                    required
                  ></v-text-field>
                </v-layout>
              </v-flex>
              <v-flex xs12>
                <v-textarea
                  v-model="newSession.description"
                  prepend-icon="notes"
                  :counter="validators.description.maxLength"
                  v-bind:placeholder="$t('briefDescription')"
                  :rules="validators.description.rules"
                  required
                ></v-textarea>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  prepend-icon="label"
                  v-model="newSession.tags"
                  :items="allTags"
                  :label="'tags' | t"
                  multiple
                  chips
                ></v-combobox>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions v-show="$vuetify.breakpoint.smAndUp">
        <v-spacer></v-spacer>
        <v-btn
          flat
          color="primary"
          aria-label="close save dialog"
          @click="cancelDialog"
        >{{ 'cancel' | t }}</v-btn>
        <v-btn
          flat
          aria-label="save new"
          :disabled="!addForm"
          form="addForm"
          type="submit"
        >{{ 'submitSession' | t }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { Getter, Mutation, Action } from 'vuex-class';

import { mutations } from '@/store/mutations';
import { Session } from '@/types';
import SessionForm from '@/mixins/SessionForm.vue';

@Component
export default class AddSessionForm extends Mixins(SessionForm) {
  addForm = true;
  showDateMenu = false;

  @Getter('newSession')
  private _newSession!: Session;

  @Getter
  private showAddModal!: boolean;

  @Mutation
  private hideAddSessionModal: any;

  @Getter
  private allTags!: string[];

  constructor() {
    super();
    this.$store.dispatch('INIT_NEW_SESSION');
  }

  get newSession() {
    return this._newSession;
  }

  set newSession(value) {
    this.$store.commit('initNewSession', value);
  }

  async saveSession(data: Session): Promise<void> {
    try {
      await this.$store.dispatch('ADD_SESSION', data);
      this.$store.dispatch('INIT_NEW_SESSION', null);
      this.hideAddSessionModal();
    } catch (error) {

    }
  }

  cancelDialog(): void {
    this.$store.dispatch('INIT_NEW_SESSION', null);
    this.hideAddSessionModal();
  }
}
</script>

<style lang="stylus">
.card-title {
  background-color: var(--v-primary-base);
  color: var(--v-info-lighten5);
}
</style>

<i18n>
{
  "en": {
    "add": "Add",
    "tags": "Tags",
    "createNewSession": "Submit new talk idea",
    "createNewSessionMobile": "New talk",
    "title": "Title of talk",
    "briefDescription": "Enter a brief description of the talk",
    "submitSession": "submit talk"
  }
}
</i18n>