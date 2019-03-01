<template>
  <TimelineView/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import TimelineView from '@/components/TimelineView.vue';

@Component({
  components: {
    TimelineView
  }
})
export default class Timeline extends Vue { }
</script>

<style>
</style>
