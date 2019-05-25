<template>
  <div>
    <v-form v-model="valid" ref="form" @submit.prevent="submit">
      <v-text-field
        color="#eee" 
        v-model="email" 
        label="E-mail" 
        type="email"
        :rules="emailRules"
        autocomplete="off"
        outline 
        required
      ></v-text-field>
      <v-text-field
        color="#eee"
        v-model="password"
        :append-icon="show ? 'visibility_off' : 'visibility'"
        :type="show ? 'text' : 'password'"
        @click:append="show = !show"
        label="Password"
        :rules="passRules"
        outline 
        required
      ></v-text-field>
    <v-layout justify-end flex>
      <v-btn large block color="#dd2c2c" 
      :disabled="!valid"
      @click="submit"
      type="submit"
      >
        Login
      </v-btn>
    </v-layout>
    </v-form>
  </div>
</template>

<script>
import ajax from '../http-common.js';

export default {
  data: function () {
    return {
      valid: false,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail not valid'
      ],
      show: false,
      password: '',
      passRules: [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Password too short'
      ]
    }
  },

  methods: {
    submit () {
      
      if (this.$refs.form.validate()) {
        // Sending auth
        ajax.post('auth', {
          email: this.email,
          password: this.password
        })
        .then(res => {
          // save token and ID
          localStorage.setItem('token', res.data['token']);
          localStorage.setItem('id', res.data['id']);
          this.$root.user['id'] = localStorage.getItem('id');
          this.$root.user['token'] = localStorage.getItem('token');
          console.log(res);
          // go to main page
          this.$router.push('wall');
        })
        .catch(e => {
          console.log(e.response.data);
          this.$root.$emit('showMsg', e.response.data);
        });
      }
    }
  }

}
</script>
