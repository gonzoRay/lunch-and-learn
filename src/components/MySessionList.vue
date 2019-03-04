<template>
  <div class="flex-fix">
    <h5 :class="[$vuetify.breakpoint.smAndUp ? 'display-1' : 'headline']" v-t="'mySessions'"></h5>
    <v-list three-line>
      <template v-for="(item, index) in mySessions">
        <MySessionListItem :key="item.id" :item="item"/>
        <v-divider v-if="index + 1 < mySessions.length" :key="`mySessions-${index}`"></v-divider>
      </template>
    </v-list>
    <NoSessionsFound hideAddNew="true" v-if="!mySessions.length"/>
    <Loading/>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

import { Session } from '@/types';
import MySessionListItem from '@/components/MySessionListItem.vue';
import NoSessionsFound from '@/components/NoSessionsFound.vue';
import Loading from '@/components/Loading.vue';

@Component({
  components: {
    MySessionListItem,
    NoSessionsFound,
    Loading
  }
})
export default class MySessionList extends Vue {
  @Getter
  private mySessions!: Session[];
}
</script>

<style lang="stylus">
</style>

