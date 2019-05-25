<template>
  <v-container class="account" fluid fill-height align-center justify-center>
    <div class="accWrap">
      <div class="accSide accLogo">
        <div class="moon"></div>
        <div class="divider"></div>
        <h1 id="h1">Art Station</h1>
      </div>
      <div class="divider short"></div>
      <div class="accSide">
        <v-card class="elevation-6 card" color="#333333dd">
          <v-tabs grow fixed-tabs v-model="tabs" dark color="#dd2c2c" slider-color="red lighten-1">
            <v-tab :key="1">Login</v-tab>
            <v-tab :key="2">Sign Up</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tabs" class="wrapper" color="transparent">
            <v-tab-item :key="1">
              <login/>
            </v-tab-item>
            <v-tab-item :key="2">
              <signup/>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import Login from '@/components/Login.vue'
import Signup from '@/components/Signup.vue'
import ajax from '../http-common.js';

export default {
  name: 'account',
  props: ['tab'],
  data () {
      return {
        tabs: this.tab
      }
  },
  watch: {
    tabs: function (val) {
      if (val == "0")
        this.$router.push('login');
      else
        this.$router.push('signup');
    },
    tab: function (val) {
      this.tabs = val;
    }
  },
  methods: {
    // log user out
    logout() {
      if (localStorage.getItem('token')) {
        console.log('Logging out');
        // remove from redis database
        ajax.get('logout')
        .then(res => {
          // remove from storage
          localStorage.clear();
        });
      }
    }
  },
  created() {
    this.logout();
  },
  components: {
    Login,
    Signup
  }

}
</script>

<style scoped>
.account {
  background-color: #170420;
  padding: 3px;
}

.card {
  width: 400px;
  max-width: 100%;
}

.wrapper {
  padding: 35px 30px 20px;
}

#h1 {
  font-family: Kano !important;
  font-weight: normal !important;
  text-align: center;
  /* margin-bottom: 10px; */
  letter-spacing: 0.05em !important;
  font-size: 70px !important;
  opacity: 0.9;
}

.divider {
  width: 100%;
  max-width: 550px;
  /* max-width: 90%; */
  /* margin-bottom: 35px; */
  height: 2px;
  margin: 20px 0 10px 0;
  background-color: #efefef33;
}

.short {
  display: none;
  margin: 30px auto;
  margin-top: 0;
  width: 90%;
  background-color: #efefef66;
}

.accSide {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.accWrap {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  max-width: 1400px;
  width: 100%;
  margin-bottom: 20px;
}

.accLogo {
  margin: 0 10px;
}

.moon {
  height: 300px;
  width: 100%;
  /* border: 1px solid #eee; */
  background-image: url('../assets/MiniRed.png');
  background-size: contain;
  background-position: center bottom;
}

@media only screen and (max-width: 1000px) {
  .accWrap {
    display: block;
  }
  .divider {
    display: none;
  }
  .short {
    display: block;
  }
  .account {
    /* display: block !important; */
    padding: 10px;
    padding-top: 37px;
  }
  .moon {
    width: 150px;
    height: 150px;
    background-size: 80%;
    background-position: center 20%;
    border: 3px solid #efefef66;
    border-radius: 50%;
  }
  #h1 {
    font-size: 40px !important;
    margin: 10px 0;
  }
}

</style>
