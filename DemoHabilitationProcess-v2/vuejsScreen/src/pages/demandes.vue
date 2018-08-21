<template>
  <v-container fluid
               fill-height>
    <v-layout justify-center
              align-center>
      <v-card class="mb-2"
              width="80%">
        <v-toolbar color="green"
                   dark>
          <v-btn icon>
            <v-icon>fiber_new</v-icon>
          </v-btn>
          <v-toolbar-title>Faire une demande d'habilitation</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form"
                v-model="valid"
                lazy-validation
                class="pa-5 pb-2">
          <!-- Application text field -->
          <v-text-field v-model="name"
                        background-color="#F5F5F5"
                        color="green"
                        clearable
                        solo
                        prepend-icon="apps"
                        :rules="nameRules"
                        :counter="10"
                        label="Application"
                        required
                        class="mb-4"></v-text-field>
          <!-- profil text field -->
          <v-text-field v-model="email"
                        solo
                        color="green"
                        clearable
                        prepend-icon="perm_identity"
                        :rules="emailRules"
                        label="Profil Sherpa"
                        required
                        class="mb-4"></v-text-field>
          <v-layout row>
            <v-flex xs6>
              <v-select v-model="select"
                        solo
                        color="green"
                        prepend-icon="place"
                        :items="items"
                        :rules="[v => !!v || 'Item is required']"
                        label="Item"
                        required
                        class="mb-4"></v-select>
            </v-flex>
            <v-flex xs6>
              <v-select v-model="select"
                        solo
                        color="green"
                        prepend-icon="place"
                        :items="items"
                        :rules="[v => !!v || 'Item is required']"
                        label="Item"
                        required
                        class="mb-4"></v-select>
            </v-flex>
          </v-layout>
          <v-checkbox v-model="checkbox"
                      :rules="[v => !!v || 'You must agree to continue!']"
                      label="Do you agree?"
                      required></v-checkbox>

          <v-btn :disabled="!valid"
                 @click="submit">
            submit
          </v-btn>
          <v-btn @click="clear">clear</v-btn>
        </v-form>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import { generateMessage } from '@/utils/i18n';
import services from '@/service_api/ServiceApiExtern/testing';

export default {
  name: 'Request',
  data() {
    return {};
  },
  created() {},
  computed: {},
  methods: {
    generateMessage,
    api_call: services.getDataFromServer,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
