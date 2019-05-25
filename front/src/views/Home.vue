<template>
  <v-container fluid fill-height class="main">
    <main-nav ref="mynav"/>

    <!-- Side Navigation -->
    <v-navigation-drawer
      fixed
      v-model="$root.drawer"
      app
      mobile-break-point="600"
      mini-variant
      mini-variant-width="60"
      clipped
      floating
    >
      <div class="sideNav">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" flat active-class="activeNav" icon to="/wall"><v-icon>dashboard</v-icon></v-btn>
          </template>
          <span>Dashboard</span>
        </v-tooltip>
        
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" flat active-class="activeNav" icon to="/draw"><v-icon>brush</v-icon></v-btn>
          </template>
          <span>Drawing</span>
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" flat active-class="activeNav" icon to="/favourites"><v-icon>favorite</v-icon></v-btn>
          </template>
          <span>Favourites</span>
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" flat active-class="activeNav" icon :to="`/profile/${id}`"><v-icon>face</v-icon></v-btn>
          </template>
          <span>Profile</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" flat active-class="activeNav" icon :to="`/profile/${id}`"><v-icon>settings</v-icon></v-btn>
          </template>
          <span>Settings</span>
        </v-tooltip>
      </div>
    </v-navigation-drawer>

    <v-content class="content">
      <router-view></router-view>
    </v-content>
    <!-- <v-footer app class="pa-3">
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }}</div>
    </v-footer> -->
  </v-container>
</template>

<script>
import MainNav from '@/components/MainNav.vue'

export default {
  components: {
    MainNav
  },
  data () {
    return {
      id : this.$root.user['id']
    }
  },
  methods: {
    profileChanged() {
      console.log('profileChange');
    }
  },
  mounted() {
    // listen for profile change
    let that = this;
    this.$root.$on('profile', (path) => {
      // set profile on mainnav
      that.$refs.mynav.loadUser();
    });
  }
}
</script>

<style scoped>
.main {
  align-items: flex-start !important;
}
.content {
  height: 100%;
  padding-top: 60px !important;
}
/* Responsive */
@media (max-width: 800px) {
  .main {
    padding: 0;
  }
}
</style>



