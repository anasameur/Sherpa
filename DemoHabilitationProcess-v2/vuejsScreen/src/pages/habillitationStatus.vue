<template>
    <v-container fluid
                 fill-height>
        <v-layout justify-center
                  align-center>
            <v-card class="mb-2">
                <v-toolbar color="secondary"
                           dark>
                    <v-btn icon>
                        <v-icon>fiber_new</v-icon>
                    </v-btn>
                    <v-toolbar-title>Liste des demandes traitées</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-data-table :headers="headers"
                              :items="items"
                              hide-actions
                              v-bind:pagination.sync="pagination"
                              item-key="num">
                    <template slot="items"
                              slot-scope="props">
                        <tr @click="props.expanded = !props.expanded">
                            <td class="text-xs-center pa-1">{{ props.item.num }}</td>
                            <td class="text-xs-center pa-1">{{ props.item.nom }}</td>
                            <td class="text-xs-center pa-1">{{ props.item.prenom }}</td>
                            <td class="text-xs-center pa-1">{{ props.item.gid }}</td>
                            <td class="text-xs-center pa-1">{{ props.item.resume }}</td>
                            <td class="text-xs-center pa-1"
                                :style="(props.item.status=='REFUSED')?'color:red':'color:green'">
                                {{ props.item.status }}</td>
                            <td class="text-xs-center pa-1">{{ props.item.date }}</td>
                        </tr>
                    </template>
                    <template slot="expand"
                              slot-scope="props">
                        <v-layout row
                                  v-if="props.item.status == 'REFUSED'">
                            <v-flex xs2>
                                <v-subheader>
                                    <b>Motifs de refus :</b>
                                </v-subheader>
                            </v-flex>
                            <v-flex xs6>
                                <v-subheader>{{ props.item.refusalReason }}</v-subheader>
                            </v-flex>
                        </v-layout>
                        <v-layout row
                                  v-else
                                  v-for="(v , k , i) in props.item.habilitationProfilesStatus"
                                  :key="i">
                            <v-flex xs3>
                                <v-subheader>
                                    <b>{{k}} :</b>
                                </v-subheader>
                            </v-flex>
                            <v-flex xs3>
                                <v-subheader>
                                    {{v}}
                                </v-subheader>
                            </v-flex>
                        </v-layout>
                    </template>
                </v-data-table>
            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
/* eslint-disable */
import services from '@/service_api/ServiceApiExtern/task';

export default {
  name: 'Satus',
  data() {
    return {
      id: null,
      headers: [
        {
          text: 'Numéro',
          align: 'left',
          sortable: false,
          value: 'num',
          width: '20%',
        },
        { text: 'Nom', value: 'nom' },
        { text: 'Prénom', value: 'prenom' },
        { text: 'Gid', value: 'gid' },
        { text: 'Résumé', value: 'resume' },
        { text: 'Status', value: 'status' },
        { text: "Date D'envoie", value: 'date' },
      ],
      items: [],
      pagination: { sortBy: 'date', descending: true, rowsPerPage: -1 },
      descRules: [
        (v) => !!v || 'Motifs de refus obligatoire',
        (v) =>
          (v && v.length <= 1000) ||
          'Le motifs de refus doit comporter moins de 1000 caractères',
      ],
    };
  },
  async created() {
    this.getTaskList();
  },
  computed: {},
  methods: {
    async getTaskList() {
      this.items = [];
      const list = await services.getTaskList(' Show Habilitation Status');
      const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      list.forEach(async function(element) {
        const task = await services.getTask(element.id);
        try {
          if (task.status.value == 'REFUSED') {
            this.items.push({
              num: element.id,
              nom: 'Ameur',
              prenom: 'Anas',
              gid: task.uid.value,
              resume: task.desc.value,
              status: task.status.value,
              refusalReason: task.refusalReason
                ? task.refusalReason.value
                : 'No refusal reason',
              date: new Date(element.created).toLocaleString(
                'fr-FR',
                dateOptions
              ),
            });
          } else {
            var habilitationProfilesStatus = {};
            for (var key in task) {
              if (key.includes('Status')) {
                habilitationProfilesStatus[key] = task[key].value;
              }
            }
            this.items.push({
              num: element.id,
              nom: 'Ameur',
              prenom: 'Anas',
              gid: task.uid.value,
              resume: task.desc.value,
              status: task.status.value,
              habilitationProfilesStatus: habilitationProfilesStatus,
              date: new Date(element.created).toLocaleString(
                'fr-FR',
                dateOptions
              ),
            });
          }
        } catch (error) {
          // eslint-disable-next-line
          console.log(error);
        }
      }, this);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
