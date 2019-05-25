<template>
  <v-app dark>
    <!-- All pages -->
    <router-view/>

    <!-- Main SnackBar -->
    <v-snackbar
      v-model="snackbar"
      :bottom="'bottom'"
      :timeout="timeout"
      :vertical="false"
    >
      {{ text }}
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  // el: '#app',
  data () {
    return {
      snackbar: false,
      timeout: 6000,
      text: 'Hello, I\'m a snackbar'
    }
  },
  methods: {
    showSnack: function (msg) {
      console.log('showing');
      this.text = msg;
      this.snackbar = true;
    }
  },
  mounted() {
    // snackbar listener
    this.$root.$on('showMsg', (msg) => {
      this.showSnack(msg);
    });
  }
}
</script>

<style>
@font-face {
  font-family: "Kano";
  src: url('assets/Kano.otf');
}

body, html {
  margin: 0;
  padding: 0;
}

html {
  overflow-y: auto !important;
}

canvas {
  display: block !important;
}

#app {
  background-color: #2c2c31;
}

/* Tile */
.mytile {
  /* border: 3px solid #662fd055 !important; */
  border: 2px solid #33333355 !important;

}

/* Width Icon override */
.rotIcon i {
  transform: rotate(90deg);
}

/* Side navigation */
.sideNav {
  height: 100%;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.v-toolbar__content {
  padding-left: 18px !important;
  padding-right: 3px !important;
}

.sideNav > a {
  margin-bottom: 30px !important;
}

/* Mobile drawing fix */

#app main {
  padding-top: 0 !important;
}

#app main > div {
  padding-top: 60px;
}

/* Scroll */
::-webkit-scrollbar{width: 0px;}
::-webkit-scrollbar-thumb{background-color:#ebebeb;}
::-webkit-scrollbar-thumb:hover{background-color:#ff1744;}
::-webkit-scrollbar-track{background-color:rgb(39, 39, 39);}
</style>
