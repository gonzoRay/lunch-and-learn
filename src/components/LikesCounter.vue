<template>
  <v-badge
    :class="['no-select', $vuetify.breakpoint.xsOnly ? 'small-badge' : '']"
    value="likeCount"
    color="primary"
    transition="fab-transition"
  >
    <v-icon :color="getLikeColor()" large @click.prevent="likeSession(item)">thumb_up</v-icon>
    <span slot="badge">{{ likeCount(item.id) }}</span>
  </v-badge>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

import { Session } from '@/types';

@Component
export default class LikesCounter extends Vue {
  @Prop()
  private item!: Session;

  private likedByNames: string[] = [];

  @Getter
  private useDarkTheme!: boolean;

  @Action('likeSessionAsync')
  private likeSession: any;

  @Action
  private getUserInfo!: (userId: string) => any;

  @Getter
  private likeCount!: (id: string) => number;

  @Getter
  private likedByMe!: (item: Session) => boolean;

  @Action
  private buildLikedList!: any;

  protected created() {
    if (!this.item.likedBy) { return; }

    this.buildLikedList(this.item.likedBy)
      .then((snapshot: firebase.firestore.QuerySnapshot) => {
        snapshot.docs.forEach(u => {
          this.likedByNames.push(u.get('name'));
        });
      });
  }
  private getLikeColor(): string {
    if (!this.likedByMe(this.item)) {
      return '';
    }

    return 'secondary';
  }
}
</script>

<style lang="stylus">
.v-progress-linear__bar {
  padding: 25px;
}

.small-badge {
  span.v-badge__badge {
    height: 20px;
    width: 20px;
  }
}
</style>