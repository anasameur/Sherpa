<template>
  <v-container grid-list-xl
               text-xs-center>
    <v-layout row>
      <!-- Actu Sherpa Components -->
      <v-flex xs6>
        <v-card class="mb-2">
          <v-toolbar color="indigo"
                     dark>
            <v-btn icon>
              <v-icon>fiber_new</v-icon>
            </v-btn>
            <v-toolbar-title>Actualité Sherpa</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list three-line>
            <template v-for="(item, index) in items">
              <v-subheader v-if="item.header"
                           :key="item.header">
                {{ item.header }}
              </v-subheader>

              <v-divider v-else-if="item.divider"
                         :inset="item.inset"
                         :key="index"></v-divider>

              <v-list-tile v-else
                           :key="item.title"
                           avatar>
                <v-list-tile-avatar>
                  <img :src="item.avatar">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
        <!-- btn faire demande -->
        <v-btn large
               color="error">Faire une demande d'habilitation</v-btn>
      </v-flex>
      <!-- Right card -->
      <v-flex xs6>
        <!-- Applications -->
        <v-card class="mb-3">
          <v-toolbar color="green"
                     dark>
            <v-btn icon>
              <v-icon>apps</v-icon>
            </v-btn>
            <v-toolbar-title>Mes Applications</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list subheader>
            <v-list-tile v-for="item in items_apps"
                         :key="item.title"
                         avatar>
              <v-list-tile-avatar tile>
                <img :src="item.avatar">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon :color="item.active ? 'teal' : 'red'">
                  {{item.active ? 'check_circle' : 'cancel'}}
                </v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
        <!-- Perimetre -->
        <v-card>
          <v-toolbar color="orange"
                     dark>
            <v-btn icon>
              <v-icon>blur_circular</v-icon>
            </v-btn>
            <v-toolbar-title>Périmètre d'habilitation</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list subheader>
            <v-list-tile v-for="item in items_hab"
                         :key="item.title">
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon :color="item.active ? 'teal' : 'red'">
                  {{item.active ? 'check_circle' : 'cancel'}}
                </v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      items: [
        { header: 'Today' },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          subtitle:
            "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle:
            "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.",
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle:
            "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?",
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
          title: 'Birthday gift',
          subtitle:
            "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?",
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
          title: 'Recipe to try',
          subtitle:
            "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.",
        },
      ],
      items_apps: [
        {
          active: true,
          title: 'Sap',
          avatar:
            'https://upload.wikimedia.org/wikipedia/commons/8/8f/SAP-Logo.svg',
        },
        {
          active: true,
          title: 'SideTrade',
          avatar:
            'http://fr.sidetrade.com/wp-content/uploads/22050384_10213210110060640_1095182809_o-300x117.png',
        },
        {
          title: 'HR Access',
          avatar:
            'https://upload.wikimedia.org/wikipedia/commons/8/8f/SAP-Logo.svg',
        },
        {
          title: 'Genesis',
          avatar:
            'https://upload.wikimedia.org/wikipedia/commons/8/8f/SAP-Logo.svg',
        },
      ],
      items_hab: [
        {
          active: true,
          title: 'Agence Oise Collective',
        },
        {
          active: true,
          title: 'Compiègne Centre Nord',
        },
        {
          title: 'Hopital Beclere',
        },
        {
          title: 'Agence Cofely Region Centre-ouest',
        },
        {
          active: true,
          title: 'Agence Cofely Region Centre-Sud',
        },
        {
          title: 'Agence Cofely Region Est',
        },
      ],
    };
  },
  created() {},
  computed: {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
