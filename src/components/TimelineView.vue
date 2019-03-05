<template>
  <v-layout column>
    <h2
      :class="[$vuetify.breakpoint.smAndUp ? 'display-1' : 'headline', 'py-2']"
    >{{ 'upcomingSessions' | t }}</h2>
    <v-timeline v-if="timelineEvents.length">
      <v-timeline-item v-for="event in timelineEventsOrdered" :key="event.id" large>
        <v-avatar slot="icon">
          <img :src="event.speaker.avatarUrl">
        </v-avatar>
        <span slot="opposite">
          <div
            :class="[$vuetify.breakpoint.smAndUp ? 'headline' : 'title font-weight-light', 'primary--text']"
          >{{ event.startTime | fromFirebaseTimestamp | formatTime }}</div>
          <div>{{ event.startTime | fromFirebaseTimestamp | formatDate($vuetify.breakpoint.xsOnly) }}</div>

          <div
            :class="[ 
                    useDarkTheme ? 'accent--text text-darken-2' : 'secondary--text text-darken-1',
                    $vuetify.breakpoint.smAndUp ? 'subheading' : 'body-2'
                    ]"
          >{{ event.speaker.name }}</div>
        </span>
        <v-card class="elevation-2">
          <v-card-title>
            <div
              @click="gotoSession(event.id)"
              :class="['clickable', $vuetify.breakpoint.smAndUp ? 'headline' : 'subheading']"
            >{{ event.title }}</div>
          </v-card-title>

          <v-card-text
            v-if="$vuetify.breakpoint.xsOnly"
            class="mobile-description"
          >{{ event.description.substring(0, 60) + '...' }}</v-card-text>
          <v-card-text v-if="$vuetify.breakpoint.smAndUp">{{ event.description }}</v-card-text>

          <v-card-actions class="mb-1">
            <v-layout v-if="$vuetify.breakpoint.xsOnly" justify-center>
              <likes-counter :item="event"></likes-counter>
            </v-layout>
            <v-layout row v-if="$vuetify.breakpoint.smAndUp">
              <v-flex xs10>
                <span class="tags">
                  <v-chip v-for="(tag, index) in event.tags" :key="`tag-${index}`">{{ tag }}</v-chip>
                </span>
              </v-flex>
              <v-flex xs2>
                <likes-counter :item="event"></likes-counter>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    <div v-else>
      <div v-if="!isLoading">
        <span class="py-4 headline font-italic">{{ 'emptyMessage' | t }}</span>
      </div>
    </div>
    <div class="align-self-center pt-5">
      <v-btn
        outline
        :small="$vuetify.breakpoint.xsOnly"
        to="sessions/proposed"
      >{{ 'seeProposedTalks' | t }}</v-btn>
      <v-btn
        outline
        :small="$vuetify.breakpoint.xsOnly"
        @click="showAddSessionModal"
      >{{ addNewButtonText }}</v-btn>
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter, Action, Mutation } from 'vuex-class';
import { Session } from '@/types';

import orderBy from 'lodash.orderby';

import LikesCounter from '@/components/LikesCounter.vue';

@Component({
  components: { LikesCounter }
})
export default class TimelineView extends Vue {
  @Getter
  timelineEvents!: any;

  @Getter
  useDarkTheme!: boolean;

  @Getter
  isLoading!: boolean;

  @Mutation
  private showAddSessionModal!: void;

  gotoSession(id) {
    this.$router.replace(`/sessions/${id}/detail`);
  }

  get timelineEventsOrdered(): Session[] {
    return orderBy(this.timelineEvents, 'startTime');
  }

  get addNewButtonText(): string {
    const sessionResource = this.$i18n.tc('session').toString().toLowerCase();
    return this.$i18n.t('addNew', [sessionResource]).toString();
  }
}
</script>

<style lang="stylus">
.mobile-description {
  padding-top: 0;
  min-height: 100px;
  max-height: 100px;
}
</style>

<i18n>
{
    "en": {
        "upcomingSessions": "Upcoming Talks",
        "emptyMessage" : "No talks have been accepted",
        "seeProposedTalks": "See Proposed Talks"
    }
}
</i18n>

