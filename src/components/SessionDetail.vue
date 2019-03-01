<template>
  <v-container>
    <div class="session-detail">
      <div d-flex>
        <v-layout row align-center>
          <v-flex xs8>
            <v-btn
              flat
              small
              :color="getColorByTheme()"
              class="ml-0 pl-0"
              @click="gotoList()"
            >{{ $t('backToSessions')}}</v-btn>
          </v-flex>
          <v-spacer/>
          <v-flex xs4>
            <v-menu offset-y left v-if="!isEditing">
              <v-btn slot="activator" icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile
                  @click="editSession(item)"
                  :disabled="!isOwner(item.id)"
                  alt="edit"
                  aria-label="edit"
                >
                  <v-list-tile-title>{{ 'editSession' | t }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
              <v-list>
                <v-list-tile
                  @click="deleteSession(item)"
                  :disabled="!isOwner(item.id)"
                  alt="delete"
                  aria-label="delete"
                >
                  <v-list-tile-title>{{ 'deleteSession' | t }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-flex>

          <div class="pl-4" d-flex>
            <v-layout row>
              <v-flex>
                <v-btn
                  v-if="isEditing && $vuetify.breakpoint.smAndUp"
                  color="info"
                  @click="isEditing = false"
                >Cancel</v-btn>
                <v-btn
                  v-if="isEditing && $vuetify.breakpoint.xsOnly"
                  flat
                  icon
                  @click="cancelEdits"
                >
                  <v-icon>close</v-icon>
                </v-btn>
              </v-flex>

              <v-flex>
                <v-btn
                  v-if="isEditing && $vuetify.breakpoint.smAndUp"
                  color="primary"
                  type="submit"
                  form="editForm"
                  :disabled="!editForm"
                >Save</v-btn>
                <v-btn
                  v-if="isEditing && $vuetify.breakpoint.xsOnly"
                  flat
                  icon
                  type="submit"
                  form="editForm"
                  :disabled="!editForm"
                >
                  <v-icon color="primary">save</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </div>
        </v-layout>
      </div>

      <div class="no-select">
        <v-form id="editForm" v-model="editForm" @submit.prevent="saveEdits(item)">
          <div d-flex>
            <v-layout row justify-start align-center>
              <v-flex>
                <span
                  :class="[ $vuetify.breakpoint.smAndUp ? 'display-1' : 'headline']"
                  v-if="!isEditing"
                >{{ item.title }}</span>
                <v-text-field
                  v-else
                  v-model="item.title"
                  :rules="validators.title.rules"
                  :counter="validators.title.maxLength"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </div>
        </v-form>
      </div>
      <span
        v-if="!isLoading"
        :class="[ 
                  $vuetify.breakpoint.smAndUp ? 'headline' : 'subheading', 
                  !speakerName ? 'font-italic' : ''
                ]"
      >{{ speakerName || 'noSpeakerSelected' | t }}</span>
      <div class="description pt-4">
        <div class="subheading" v-if="!isEditing">{{ item.description }}</div>
        <v-textarea
          v-else
          v-model="item.description"
          :rules="validators.description.rules"
          :counter="validators.description.maxLength"
          auto-grow
          flat
          required
        ></v-textarea>
      </div>
      <div class="tags">
        <v-combobox
          v-if="isEditing"
          v-model="item.tags"
          :items="allTags"
          :label="'tags' | t"
          multiple
          chips
        ></v-combobox>
        <v-chip
          v-else
          v-for="tag in item.tags"
          :key="tag"
          :small="$vuetify.breakpoint.xsOnly"
        >{{ tag }}</v-chip>
      </div>
      <div class="detail-actions">
        <div>
          <div class="py-4" v-if="item.datetime">
            <span v-if="isMyTalk(item)">You're scheduled to present this talk on:</span>
            <span v-else>This talk is scheduled to be presented on:</span>
            <div class="primary--text headline">
              <span>{{ item.datetime | fromFirebaseTimestamp | formatDate($vuetify.breakpoint.xsOnly) }}</span>

              <div>{{ item.datetime | fromFirebaseTimestamp | formatTime($vuetify.breakpoint.xsOnly) }}</div>
            </div>
          </div>
        </div>

        <div
          class="body-1 font-italic"
          v-if="isEditing && item.acceptedByUid"
        >{{ 'modifyDateUnacceptFirst' | t }}</div>

        <div v-if="!isEditing">
          <div v-if="isMyTalk(item)" class="pl-0 pt-2 align-right">
            <v-btn
              outline
              @click="unacceptSession(item)"
              :aria-label="$t('unacceptSession')"
              color="warning"
            >
              <v-icon>{{ 'close' }}</v-icon>
              <span class="btn-icon-label pl-1">{{ $t('unacceptSession') }}</span>
            </v-btn>
            <div
              class="hidden-sm-and-up py-4"
            >You accepted this talk {{ item.acceptedOn | fromFirebaseTimestamp | timeAgo}} ago.</div>
            <span
              class="hidden-xs-only py-4 pl-4"
            >You accepted this talk {{ item.acceptedOn | fromFirebaseTimestamp | timeAgo}} ago.</span>
          </div>

          <div v-else class="pt-2">
            <v-btn
              outline
              @click="acceptSession(item)"
              :disabled="!!item.acceptedByUid"
              :aria-label="!!item.acceptedByUid ? $t('alreadyAccepted') : $t('acceptSession')"
              :aria-disabled="!!item.acceptedByUid"
              :color="getAcceptButtonColor(item)"
            >
              <v-icon>{{ item.acceptedByUid ? 'check_circle' : 'check_circle_outline' }}</v-icon>
              <span
                class="btn-icon-label pl-1"
              >{{ item.acceptedByUid ? $t('alreadyAccepted') : $t('acceptSession') }}</span>
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal
      name="deleteModal"
      ref="deleteModal"
      prompt="Delete talk?"
      confirmText="Delete"
      declineText="Cancel"
    />

    <ConfirmModal
      name="unacceptModal"
      ref="unacceptModal"
      prompt="Unaccept talk?"
      description="Are you really doing this? The team was counting on you."
      confirmText="Unaccept"
      declineText="Cancel"
    />
    <AcceptSessionModal name="acceptModal" ref="acceptModal"/>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model, Mixins } from 'vue-property-decorator';
import { State, Getter, Mutation, Action } from 'vuex-class';

import { AppState, Session, SessionUser } from '@/types';
import { userCollection } from '@/store/db';

import ConfirmModal from '@/components/ConfirmModal.vue';
import AcceptSessionModal from '@/components/AcceptSessionModal.vue';
import SessionForm from '@/mixins/SessionForm.vue';

@Component({
  components: {
    AcceptSessionModal,
    ConfirmModal
  }
})
export default class SessionDetail extends Mixins(SessionForm) {
  editForm = true;
  isEditing: boolean = false;
  private speakerName: string | null = '';

  @Prop({ required: true })
  private id!: string;

  @Getter('currentSession')
  private item!: Session;

  @Getter
  private allTags!: string[];

  @Getter
  private getSessionOwnerId!: (id: string) => string;

  @Getter
  private isOwner!: (id: string) => string;

  @Getter
  private isLoading!: boolean;

  @Getter
  private currentConfirmModal!: string;

  @Getter
  private useDarkTheme!: boolean;

  @Action
  private ACCEPT_SESSION: any;

  @Action
  private DELETE_SESSION: any;

  @Action
  private UNACCEPT_SESSION: any;

  @Action
  private SAVE_SESSION: any;

  @Action
  private showSnackbar!: any;

  @Action
  private showSnackbarError!: any;

  constructor() {
    super();
    this.speakerName = '';
  }

  async created() {
    if (!this.id) {
      this.gotoList();
    }

    this.$store.dispatch('LOAD_CURRENT_SESSION', this.id);
    if (!this.item) {
      this.gotoList();
    }
    this.speakerName = await this.lookupSpeakerName();
  }

  acceptSession(item: Session): void {
    const acceptModal = this.$refs.acceptModal as AcceptSessionModal;

    acceptModal.show().then(async (confirmAction: boolean) => {
      if (confirmAction) {
        try {
          await this.ACCEPT_SESSION({ id: item.id, datetime: acceptModal.sessionDatetime });
          const sessionApprovedLabel = this.$i18n.t('sessionAccepted', [item.title]);
          this.$router.replace(`/sessions/accepted`);
          this.showSnackbar(sessionApprovedLabel);
        } catch (error) {
          this.showSnackbar('Error during accept');
        }
      }
    });
  }

  saveEdits(item: Session) {
    this.$store.dispatch('SAVE_SESSION', item);
    this.$store.dispatch('LOAD_CURRENT_SESSION', this.id);
    this.isEditing = false;
  }

  cancelEdits() {
    this.isEditing = false;
    this.$store.dispatch('LOAD_CURRENT_SESSION', this.id);
  }

  unacceptSession(item: Session): void {
    const unacceptModal = this.$refs.unacceptModal as ConfirmModal;
    unacceptModal.show().then(async confirmAction => {
      if (confirmAction) {
        try {
          await this.UNACCEPT_SESSION(item);
          const label = this.$i18n.t('sessionUnaccepted', [item.title]);
          this.showSnackbar({ text: label, timeout: 5000 });
          this.$router.replace(`/sessions/proposed`);
        } catch (error) {
          this.showSnackbarError('Error during unaccept');
        }
      }
    });
  }

  editSession(item: Session): void {
    this.isEditing = true;
  }

  isMyTalk(item: Session): boolean {
    return item.acceptedByUid === this.$store.getters.currentUserId;
  }

  getColorByTheme(): string {
    return this.useDarkTheme ? 'primary lighten-1' : 'primary';
  }

  getAcceptButtonColor(item: Session): string {
    const disabledColor = 'info';
    const actionColor = this.useDarkTheme ? 'accent' : 'primary';
    return item.acceptedByUid ? disabledColor : actionColor;
  }

  private getUserByUid(uid: string): Promise<firebase.firestore.QuerySnapshot> {
    return userCollection.where('uid', '==', uid).get();
  }

  private async lookupSpeakerName(): Promise<string> {
    if (!this.item.acceptedByUid) {
      return '';
    }

    let name = '';
    const result = await this.getUserByUid(this.item.acceptedByUid);
    if (result.empty) {
      return name;
    }

    const sessionUser = result.docs[0] && result.docs[0].data() as SessionUser;
    name = sessionUser ? `${sessionUser.name}` : '';

    return name;
  }

  private deleteSession(item: Session): void {
    const deleteModal = this.$refs.deleteModal as ConfirmModal;
    deleteModal.show().then(async confirmAction => {
      if (confirmAction) {
        try {
          await this.DELETE_SESSION(item.id);
          const sessionDeletedLabel = this.$i18n.t('sessionDeleted', [item.title]);
          this.showSnackbar({ text: sessionDeletedLabel, timeout: 5000, mode: 'error' });
          this.$router.replace('/sessions');
        } catch (error) {
          this.showSnackbarError('Error during delete');
        }
      }
    });
  }

  private gotoList() {
    this.$router.replace('/sessions');
  }

}
</script>

<style lang="stylus">
</style>

<i18n>
{
  "en": {
    "backToSessions": "Back to talks",
    "sessionAccepted": "Thank you for accepting to present: {0}.",
    "sessionUnaccepted": "I'm sorry to see you go.",
    "sessionDeleted": "Talk {0} has been deleted.",
    "acceptSession": "Accept this talk",
    "unacceptSession": "Unaccept this talk",
    "alreadyAccepted": "Already Accepted",
    "noSpeakerSelected": "No speaker selected",
    "deleteSession": "Delete talk",
    "editSession": "Edit talk...",
    "modifyDateUnacceptFirst": "If you'd like to modify the date you'll need to first unaccept and re-accept."
  }
}
</i18n>
