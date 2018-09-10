<template>
  <v-container fluid
               fill-height>
    <v-layout justify-center
              align-center>
      <v-card class="mb-2">
        <v-toolbar color="warning"
                   dark>
          <v-btn icon>
            <v-icon>fiber_new</v-icon>
          </v-btn>
          <v-toolbar-title>Liste des demandes à valider</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-data-table :headers="headers"
                      :items="items"
                      hide-actions
                      v-bind:pagination.sync="pagination"
                      class="elevation-1">
          <template slot="items"
                    slot-scope="props">
            <td class="text-xs-center pa-1">{{ props.item.num }}</td>
            <td class="text-xs-center pa-1">{{ props.item.nom }}</td>
            <td class="text-xs-center pa-1">{{ props.item.prenom }}</td>
            <td class="text-xs-center pa-1">{{ props.item.gid }}</td>
            <td class="text-xs-center pa-1">{{ props.item.resume }}</td>
            <td class="text-xs-center pa-1">{{ props.item.profiles }}</td>
            <td class="text-xs-center pa-1">{{ props.item.date }}</td>
            <td class="text-xs-center pa-0">
              <v-icon small
                      class="mr-2"
                      color="green"
                      @click="validate(props.item.num)">
                check_circle
              </v-icon>
            </td>
            <td class="text-xs-center pa-0">
              <v-icon small
                      color="red"
                      @click="dialog=true;id=props.item.num">
                cancel
              </v-icon>
            </td>
          </template>
        </v-data-table>
        <!-- server request notif -->
        <v-snackbar v-model="success"
                    :right="true"
                    :top="true"
                    color="green">
          Request was sent successfully
          <v-btn flat
                 fab
                 @click="success = false">
            <v-icon>cancel</v-icon>
          </v-btn>
        </v-snackbar>
        <!-- reason for refusal dialog -->
        <v-dialog v-model="dialog"
                  width="50%">
          <v-card>
            <v-card-title class="headline red lighten-2 subheading"
                          color="white"
                          style="color : white">
              Motif de Refus
            </v-card-title>

            <v-divider></v-divider>
            <v-form ref="form"
                    v-model="valid"
                    lazy-validation
                    class="pb-2 pt-3 pr-4 pl-4">
              <!-- desc text field -->
              <v-textarea solo
                          name="refusalReason"
                          label=""
                          required
                          rows="8"
                          :rules="descRules"
                          v-model="refusalReason"></v-textarea>
              <v-layout align-center
                        justify-center
                        row
                        fill-height>
                <v-btn :disabled="!valid"
                       @click="dialog=false; refused(id)"
                       color="red lighten-2" style="color : white">
                  Confirmer
                </v-btn>
                <v-btn @click="dialog=false">Annuler</v-btn>
              </v-layout>
            </v-form>
          </v-card>
        </v-dialog>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
import services from '@/service_api/ServiceApiExtern/task';

export default {
  name: 'Validation',
  data() {
    return {
      id: null,
      success: false,
      refusalReason: '',
      valid: false,
      dialog: false,
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
        { text: 'Profiles', value: 'profiles' },
        { text: "Date D'envoie", value: 'date' },
        { text: 'Valider', value: 'name', sortable: false },
        { text: 'Refuser', value: 'name', sortable: false },
      ],
      items: [],
      pagination : {'sortBy': 'date', 'descending': true, 'rowsPerPage': -1},
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
    async validate(id) {
      const data = {};
      data.variables = {};
      data.variables.status = { value: 'ACCEPTED' };
      const request = await services.completeTask(id, data);
      if (request) {
        this.success = true;
        this.getTaskList();
      }
    },
    async refused(id) {
      const data = {};
      data.variables = {};
      data.variables.status = { value: 'REFUSED' };
      data.variables.refusalReason = { value: this.refusalReason };
      const request = await services.completeTask(id, data);
      if (request) {
        this.success = true;
        this.getTaskList();
      }
    },
    async getTaskList() {
      this.items = [];
      const list = await services.getTaskList('Habilitation Request Validation');
      const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      // eslint-disable-next-line
      list.forEach(async function(element) {
        const task = await services.getTask(element.id);
        try {
          this.items.push({
            num: element.id,
            nom: 'Ameur',
            prenom: 'Anas',
            gid: task.uid.value,
            resume: task.desc.value,
            profiles: task.profiles.value,
            date: new Date(element.created).toLocaleString(
              'fr-FR',
              dateOptions
            ),
          });
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
