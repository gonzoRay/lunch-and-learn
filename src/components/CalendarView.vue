<template>
  <vue-cal
    :disable-views="['years', 'year']"
    :time-from="8 * 60"
    :time-to="18 * 60"
    hide-weekends
    :events="calendarEvents"
    @event-focus="gotoSession"
  />
</template>

<script>
import { mapGetters } from 'vuex';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';


export default {
  components: {
    VueCal
  },
  computed: {
    ...mapGetters(['calendarEvents'])
  },
  methods: {
    gotoSession(calendarEvent) {
      this.$router.replace(`/sessions/${calendarEvent.sessionId}/detail`);
    }
  }
};
</script>

<style>
</style>
