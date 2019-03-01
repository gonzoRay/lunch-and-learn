<template>
  <MySessionList/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import MySessionList from '@/components/MySessionList.vue';

@Component({
  components: {
    MySessionList
  }
})
export default class MySessions extends Vue { }
</script>
