<template>
  <TaggedList :name="name"/>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import TaggedList from '@/components/TaggedList.vue';

@Component({
  components: {
    TaggedList
  }
})
export default class Tagged extends Vue {
  @Prop({ required: true })
  private name!: string;
}
</script>
