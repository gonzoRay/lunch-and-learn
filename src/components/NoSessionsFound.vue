<template>
  <div class="empty-list" v-if="!isLoading">
    <span :class="[$vuetify.breakpoint.mdAndUp ? 'display-1' : 'title']" v-t="'emptyList'"></span>
    <p
      v-if="!!hideAddNew === false"
      :class="['button-link', $vuetify.breakpoint.mdAndUp ? 'headline' : 'subheading']"
      @click="showAddSessionModal()"
    >{{ getAddNewButtonText() }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Mutation, Getter } from 'vuex-class';

@Component
export default class NoSessionsFound extends Vue {
  @Prop()
  private hideAddNew?: boolean;

  @Mutation
  private showAddSessionModal!: void;

  @Getter
  private isLoading!: boolean;

  getAddNewButtonText(): string {
    const sessionResource = this.$i18n.tc('session').toString().toLowerCase();
    return this.$i18n.t('addNew', [sessionResource]).toString();
  }
}
</script>

<style lang="stylus">
.empty-list {
  .display-1 {
    padding-bottom: 5px;
  }

  padding: 20px;
}
</style>

<i18n>
{
  "en": {
    "emptyList": "Nothing here!"
  }
}
</i18n>