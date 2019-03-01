<template>
  <CalendarView/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import CalendarView from '@/components/CalendarView.vue';

@Component({
  components: {
    CalendarView
  }
})
export default class Calendar extends Vue { }
</script>

<style>
</style>
