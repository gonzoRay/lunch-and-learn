<template>
  <v-tabs class="flex-fix" v-model="currentTabId">
    <v-tab v-for="tab in tabs" :key="tab.id">
      <v-icon class="hidden-xs-only pa-2">{{ tab.icon }}</v-icon>
      {{ tab.name }}
    </v-tab>
    <v-tab-item>
      <v-list three-line v-if="!isLoading">
        <template v-for="(item, index) in proposedOrdered">
          <ProposedListItem :key="item.id" :item="item"/>
          <v-divider v-if="index + 1 < proposed.length" :key="`proposed-${index}`"></v-divider>
        </template>
      </v-list>
      <Loading/>
      <NoSessionsFound v-if="!proposed.length"/>
    </v-tab-item>
    <v-tab-item>
      <v-list three-line v-if="!isLoading">
        <template v-for="(item, index) in accepted">
          <AcceptedListItem :key="item.id" :item="item"/>
          <v-divider v-if="index + 1 < accepted.length" :key="`accepted-${index}`"></v-divider>
        </template>
      </v-list>
      <Loading/>
      <NoSessionsFound hideAddNew="true" v-if="!accepted.length"/>
    </v-tab-item>
    <v-tab-item>
      <v-list three-line>
        <template v-for="(item, index) in pastOrdered">
          <PastListItem :key="item.id" :item="item"/>
          <v-divider v-if="index + 1 < past.length" :key="`past-${index}`"></v-divider>
        </template>
      </v-list>
      <NoSessionsFound hideAddNew="true" v-if="!past.length"/>
      <Loading/>
    </v-tab-item>
  </v-tabs>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter, Mutation, Action } from 'vuex-class';

import orderBy from 'lodash.orderby';

import { Session } from '@/types';
import ProposedListItem from '@/components/ProposedListItem.vue';
import AcceptedListItem from '@/components/AcceptedListItem.vue';
import PastListItem from '@/components/PastListItem.vue';
import NoSessionsFound from '@/components/NoSessionsFound.vue';
import Loading from '@/components/Loading.vue';

@Component({
  components: {
    ProposedListItem,
    AcceptedListItem,
    PastListItem,
    NoSessionsFound,
    Loading
  }
})
export default class SessionList extends Vue {
  @Prop()
  title!: string;

  tabs = [
    { id: 0, name: 'Proposed', icon: 'event' },
    { id: 1, name: 'Accepted', icon: 'schedule' },
    { id: 2, name: 'Past', icon: 'check_circle' }
  ];

  currentTabId = 0;

  @Getter
  isLoading!: boolean;

  @Getter
  private proposed!: Session[];

  @Getter
  private accepted!: Session[];

  @Getter
  private past!: Session[];

  protected mounted(): void {
    this.loadTabFromRouteParams();
  }

  get proposedOrdered(): Session[] {
    return orderBy(this.proposed, 'datetime');
  }

  get acceptedOrdered(): Session[] {
    return orderBy(this.accepted, 'datetime');
  }

  get pastOrdered(): Session[] {
    return orderBy(this.past, 'datetime');
  }

  private loadTabFromRouteParams(): void {
    const targetViewParam = this.$router.currentRoute.params.view || 'Proposed';
    const foundTab = this.tabs.find(t => t.name.toLowerCase() === targetViewParam.toLowerCase());
    this.currentTabId = foundTab ? foundTab.id : 0;
  }
}
</script>

<style lang="stylus">
.v-tabs__item .v-icon {
  color: var(--v-info-base);
}

.v-tabs__item--active .v-icon {
  color: var(--v-primary-base);
}
</style>
