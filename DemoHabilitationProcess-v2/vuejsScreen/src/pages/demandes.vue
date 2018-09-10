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
                class="pb-2 pt-4 pr-5 pl-5">
          <!-- Application text field -->
          <v-text-field v-model="app_name"
                        background-color="#F5F5F5"
                        color="green"
                        clearable
                        solo
                        prepend-icon="apps"
                        :rules="app_nameRules"
                        :counter="10"
                        label="Application"
                        required
                        class="mb-0"></v-text-field>
          <!-- profil text field -->
          <v-text-field v-model="user_id"
                        solo
                        color="green"
                        clearable
                        prepend-icon="perm_identity"
                        :rules="user_idRules"
                        label="User GID"
                        required
                        class="mb-0"></v-text-field>
          <v-layout row>
            <v-flex xs6
                    class="mr-2">
              <v-select v-model="profiles"
                        solo
                        color="green"
                        prepend-icon="place"
                        :items="items"
                        chips
                        multiple
                        clearable
                        :rules="[v => !!v || 'Profile Sherpa is required']"
                        label="Profile Sherpa"
                        required
                        class="mb-0"></v-select>
            </v-flex>
            <v-flex xs6
                    class="ml-2">
              <v-select v-model="profiles"
                        solo
                        color="green"
                        prepend-icon="place"
                        :items="items"
                        chips
                        multiple
                        clearable
                        :rules="[v => !!v || 'Profile Sherpa is required']"
                        label="Profile Sherpa"
                        required
                        class="mb-0"></v-select>
            </v-flex>
          </v-layout>
          <!-- desc text field -->
          <v-textarea solo
                      name="desc"
                      label="Description"
                      v-model="desc"></v-textarea>
          <v-layout align-center
                    justify-center
                    row
                    fill-height>
            <v-btn :disabled="!valid"
                   @click="submit"
                   color="success">
              Valider
            </v-btn>
            <v-btn @click="clear">Annuler</v-btn>
          </v-layout>
        </v-form>
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
        <v-snackbar v-model="fail"
                    :right="true"
                    :top="true"
                    color="red">
          An error occured when sending request
          <v-btn flat
                 fab
                 @click="fail = false">
            <v-icon>cancel</v-icon>
          </v-btn>
        </v-snackbar>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
import uuidv1 from 'uuid/v1';
import services from '@/service_api/ServiceApiExtern/rabbitMQPublishMsg';

export default {
  name: 'Request',
  data() {
    return {
      success: false,
      fail: false,
      valid: true,
      app_name: '',
      app_nameRules: [
        (v) => !!v || 'Application Name is required',
        (v) =>
          (v && v.length <= 10) ||
          'Application Name must be less than 10 characters',
      ],
      desc: '',
      descRules: [
        (v) => !!v || 'Description is required',
        (v) =>
          (v && v.length <= 100) ||
          'Application Name must be less than 100 characters',
      ],
      user_id: '',
      user_idRules: [
        (v) => !!v || 'User GID is required',
        (v) =>
          (v && v.length <= 10) || 'User GID must be less than 10 characters',
      ],
      profiles: null,
      items: ['gtf_compta', 'gtf_admin', 'sap_compta', 'sap_admin'],
    };
  },
  created() {},
  computed: {},
  methods: {
    async submit() {
      var msg_payload = {};
      msg_payload.id = uuidv1();
      msg_payload.businessKey = uuidv1();
      msg_payload.payload = {};
      msg_payload.payload.orderId = uuidv1();
      msg_payload.payload.uid = this.user_id;
      msg_payload.payload.profiles = this.profiles.toString();
      msg_payload.payload.desc = this.desc;

      console.log(msg_payload);
      var rabbitMQMsg = {};
      rabbitMQMsg.properties = {};
      rabbitMQMsg.routing_key = 'order';
      rabbitMQMsg.payload = JSON.stringify(msg_payload);
      rabbitMQMsg.payload_encoding = 'string';

      var post_order = await services.postRequest(rabbitMQMsg);
      if (post_order) {
        this.success = true;
      } else {
        this.fail = true;
      }
      console.log(post_order);
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
