<template>
  <router-link tag="li" v-bind:key="item.id" :to="{name: 'details', params: { id: item.id }}">
    <v-tooltip v-if="isMyTalk(item)" bottom nudge-top="70">
      <v-list-tile slot="activator" class="no-select" :key="item.id" avatar>
        <v-list-tile-avatar class="hidden-xs-only">
          <v-avatar>
            <v-icon>event_note</v-icon>
          </v-avatar>
        </v-list-tile-avatar>
        <v-list-tile-content class="content-min-width">
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          <v-list-tile-sub-title class="text--primary">
            {{ getSessionOwnerName(item.id) }}
            <v-chip small label>{{ $t('submitter') }}</v-chip>
          </v-list-tile-sub-title>
          <v-list-tile-sub-title class="text-truncate">{{ item.description }}</v-list-tile-sub-title>
        </v-list-tile-content>
        <!-- <v-chip label v-if="isMyTalk()">{{ $t('owner') }}</v-chip> -->
        <v-list-tile-action :class="{'action-mobile' : $vuetify.breakpoint.xsOnly}">
          <likes-counter :item="item"></likes-counter>
        </v-list-tile-action>
        <v-spacer class="action-spacer"></v-spacer>
      </v-list-tile>
      <span>{{ $t('yourTalk') }}</span>
    </v-tooltip>
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

import { Session } from '@/types';
import LikesCounter from '@/components/LikesCounter.vue';

@Component({
  components: { LikesCounter }
})
export default class PastListItem extends Vue {
  @Prop()
  private item!: Session;

  @Getter
  private currentUserId!: string;

  @Getter
  private isMyTalk!: (item: Session) => boolean;

  @Getter
  private getSessionOwnerName!: (id: string) => string;
}
</script>

<style lang="stylus">
li a {
  text-decoration: none;
}

.action-mobile {
  margin-right: 5px;
}

.action-spacer {
  flex-grow: 0.05 !important;
}

.content-min-width {
  min-width: 83%;
  max-width: 83%;
}
</style>

<i18n>
{
  "en": {
    "yourTalk": "This is your talk.",
    "submitter": "Submitter",
    "presenter": "Presenter"
  }
}
</i18n>