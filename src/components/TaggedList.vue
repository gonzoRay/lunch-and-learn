<template>
  <div class="flex-fix">
    <h5 class="headline">Tagged as:
      <v-chip color="primary" text-color="white">
        <v-icon left>label</v-icon>
        {{ name }}
      </v-chip>
    </h5>
    <v-list three-line v-show="tagged.length">
      <template v-for="(item, index) in tagged">
        <ProposedListItem :key="item.id" :item="item"/>
        <v-divider v-if="index + 1 < tagged.length" :key="`tagged-${index}`"></v-divider>
      </template>
    </v-list>
    <NoSessionsFound hideAddNew="true" v-if="!tagged.length"/>
    <Loading/>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

import { Session } from '@/types';
import ProposedListItem from '@/components/ProposedListItem.vue';
import NoSessionsFound from '@/components/NoSessionsFound.vue';
import Loading from '@/components/Loading.vue';

@Component({
  components: {
    ProposedListItem,
    NoSessionsFound,
    Loading
  }
})
export default class TaggedList extends Vue {
  private tagged: Session[] = [];

  @Prop({ required: true })
  private name!: string;

  @Getter
  private getSessionsByTagName!: (tagName: string) => Session[];

  private created() {
    this.tagged = this.getSessionsByTagName(this.name) || [];
  }
}
</script>

<style lang="stylus">
.tag-name {
  color: var(--v-primary-base);
}
</style>