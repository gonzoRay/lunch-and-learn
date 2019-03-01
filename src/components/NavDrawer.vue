<template>
  <v-navigation-drawer
    :clipped="$vuetify.breakpoint.lgAndUp"
    :value="drawer"
    @input="onChange($event)"
    fixed
    app
  >
    <v-list dense>
      <template v-for="item in items">
        <v-layout v-if="item.heading" :key="item.heading" row align-center>
          <v-flex xs6>
            <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
          </v-flex>
        </v-layout>
        <v-list-group
          v-else-if="item.children"
          v-model="item.model"
          :key="item.text"
          :prepend-icon="item.model ? item.icon : item['icon-alt']"
          append-icon
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="(tag, i) in getTags()" :key="i" class="indent-tags">
            <v-list-tile-action v-if="tag.icon">
              <v-icon>{{ tag.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-if="tag.route">
                <router-link
                  tag="li"
                  v-bind:class="{'on-dark-text': useDarkTheme}"
                  :to="{name: 'tag', params: {name: tag.text }}"
                >{{ tag.text }}</router-link>
              </v-list-tile-title>
              <v-list-tile-title v-else>{{ tag.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile v-else :key="item.text">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <router-link
                v-if="item.i18nText"
                tag="li"
                v-bind:class="{'on-dark-text': useDarkTheme}"
                :to="item.route"
                v-t="item.i18nText"
              ></router-link>
              <router-link
                tag="li"
                v-bind:class="{'on-dark-text': useDarkTheme}"
                :to="item.route"
              >{{ item.text }}</router-link>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
      <v-list-tile class="clickable">
        <v-list-tile-action>
          <v-icon>logout</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title @click="logout()">{{ 'logOut' | t }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

@Component
export default class NavDrawer extends Vue {
  private items: any[];
  private tagsKey = 'Tags';

  @Prop()
  private drawer!: any;

  @Getter
  private allTags!: string[];

  @Getter
  private useDarkTheme!: boolean;

  constructor() {
    super();

    this.items = [
      { icon: 'event', i18nText: 'proposedSessions', route: '/sessions/proposed' },
      { icon: 'schedule', i18nText: 'acceptedSessions', route: '/sessions/accepted' },
      { icon: 'check_circle', i18nText: 'pastSessions', route: '/sessions/past' },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: this.tagsKey,
        model: true,
        route: '/tags'
      },
      { icon: 'person', i18nText: 'mySessions', route: '/mysessions' },
      { icon: 'timeline', i18nText: 'timelineView', route: '/timeline' },
      { icon: 'view_agenda', i18nText: 'calendarView', route: '/calendar' }
    ];
  }

  logout() {
    this.$store.dispatch('logout')
      .catch(err => alert(err.message || err))
      .finally(() => {
        this.onChange(false);
        this.$router.replace('/login');
      });
  }

  private onChange(event) {
    this.$emit('change', event);
  }

  private mounted() {
    this.insertTagsSubmenu();
  }

  private insertTagsSubmenu() {
    const tagNodeIndex = this.items.findIndex(
      (i: any) => i.text === this.tagsKey
    ) as any;
    this.items[tagNodeIndex].children = this.getTags();
  }

  private getTags() {
    return this.allTags.map(tag => {
      return {
        icon: 'label',
        text: tag,
        route: `/tag/${tag.toLowerCase()}`
      };
    });
  }
}
</script>

<style>
</style>
