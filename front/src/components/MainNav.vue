<template>
  <v-toolbar dark color="#dd2c2c" fixed height="55" app class="myNav">
    <v-toolbar-side-icon @click.stop="$root.drawer = !$root.drawer" class="menuIcon"></v-toolbar-side-icon>
    <v-toolbar-title class="navTitle">Art Station</v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- User Info -->
    <v-menu offset-y left>
      <v-btn flat class="button" large slot="activator">
        <v-avatar v-if="image" size="43" class="avatar">
          <img :src="image">
        </v-avatar>
        <v-icon right dark class="iconUser">more_vert</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile :to="`/profile/${id}`" active-class="">
          <v-list-tile-title>Profile</v-list-tile-title>
        </v-list-tile>
        <v-list-tile to="/favourites" active-class="">
          <v-list-tile-title>Favourites</v-list-tile-title>
        </v-list-tile>
        <v-list-tile to="/login" active-class="">
          <v-list-tile-title>Log out</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import ajax from '../http-common.js';

export default {
  name: 'MainNav',
  data () {
    return {
      id : this.$root.user['id'],
      avatar : null,
      user : null,
      image : null,
    }
  },
  methods: {
    loadUser () {
      // get user info
      ajax.get('user/' + this.id)
      .then(res => {
        // load data
        this.user = res.data['username'];
        this.avatar = res.data['avatar'];
        if (!this.avatar) this.avatar = 'images/avatars/def.jpg';
        this.loadImage();
      })
      .catch(e => {
        console.log(e);
      });
    },
    loadImage () {
      ajax.get(this.avatar, { responseType: 'arraybuffer'} )
      .then(res => {
        // load image and show in img
        let img = new Buffer(res.data, 'binary').toString('base64');
        this.image = "data:;base64," + img;
      })
      .catch(e => {
        console.log(e);
      });
    },
  },
  mounted() {
    this.loadUser();
  }
}
</script>

<style scoped>
.button {
  text-transform: none !important;
  padding: 0 20px !important;
}
.avatar {
  margin-right: 0px;
}
.avatar img {
  border: 2px solid #efefef33;
  border-radius: 50%;
}
.iconUser {
  margin-left: 10px !important;
}
.myNav {
  padding-left: 0px !important;
}
.menuIcon {
}
.navTitle {
  font-size: 16px !important;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: Kano;
  padding-left: 20px;
}
</style>

