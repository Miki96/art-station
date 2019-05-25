<template>
  <div class="wrap">
    <v-layout justify-center align-center class="profile">
      <v-avatar color="lighten-4" size="300" class="avVue">
        <label v-if="show" for="avatar" class="avLabel">
          <div class="uploadText title">
            <v-icon x-large>edit</v-icon>
          </div>
          <input type="file" id="avatar" ref="file" v-on:change="handleAvatar()"/>
        </label>
        <img ref="avatar" :src="image" class="avatar">
      </v-avatar>
      <div class="infoTab">
        <div class="infoSide">
          <div>First Name</div>
          <div>Last Name</div>
          <div>Email</div>
          <div>Username</div>
          <div>Date of birth</div>
        </div>
        <div class="infoValues">
          <div>{{fname}}</div>
          <div>{{lname}}</div>
          <div>{{email}}</div>
          <div>{{user}}</div>
          <div>{{date}}</div>
        </div>
      </div>
    </v-layout>
    <v-divider class="divider"></v-divider>
    <v-container grid-list-lg fluid class="pa-0">
      <div class="layoutTiles" id="macy-container">
        <tile v-for="draw in all" :key="'p' + draw" v-bind:id="Number(draw)" :canDelete="true" class="tile"></tile>
      </div>
    </v-container>

    <!-- Empty profile -->
    <div v-if="empty" class="emptyProfile">
      Click on brush
      <v-btn dark to="/draw" fab color="#ff1744">
        <v-icon>brush</v-icon>
      </v-btn>
      to create some Art.
    </div>

    <!-- Dialog for deleting -->
    <v-dialog v-model="dialog" max-width="300">
      <v-card class="pa-2">
        <v-card-title class="title">Delete {{imgTitle}} drawing?</v-card-title>
        <v-card-text>This will remove drawing from your profile, wall and everyones favourites.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red accent-3" flat @click="dialog = false">Cancel</v-btn>
          <v-btn color="red accent-3" flat @click="deleteImage(imgID)">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import Tile from '@/components/Tile.vue'
import ajax from '../http-common.js';
import Macy from 'macy';

export default {
  components: {
    Tile
  },
  data: function () {
    return {
      idp: this.$route.params.idp,
      fname : '',
      lname : '',
      email : '',
      user : '',
      date : '',
      avatar : '',
      image : null,
      show : null,
      all : null,
      dialog : false,
      imgID : null,
      imgTitle : null,
      macy : null,
      empty : false
    }
  },
  watch: {
    '$route.params.idp': function (idp) {
      this.idp = idp;
      this.show = (this.idp == this.$root.user['id']);
      this.loadUser();
      this.loadDrawings();
    },
    all: function (val) {
        console.log('from watch');
        this.createMacy();
    }
  },
  methods: {
    loadUser () {
      // get user info
      ajax.get('user/' + this.idp)
      .then(res => {
        // load data
        this.fname = res.data['fname'];
        this.lname = res.data['lname'];
        this.email = res.data['email'];
        this.user = res.data['username'];
        this.date = res.data['date'];
        this.avatar = res.data['avatar'];
        if (!this.avatar) this.avatar = 'images/avatars/def.jpg';
        // set image
        this.loadImage();
        // set to mainnav
        this.$root.$emit('profile', this.avatar);
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
    handleAvatar () {
      console.log('file');
      let file = this.$refs.file.files[0];

      let formData = new FormData();
      formData.append('avatar', file);

      ajax.post('/avatar',
        formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        console.log(res.data);
        this.loadUser();
      })
      .catch(e => {
        console.log('FAILURE!!' + e);
      });
    },
    loadDrawings() {
      // get all drawings by user
      ajax.get('/author/' + this.idp)
      .then(res => {
          // save to component
          if (res.data.length > 0) {
            this.all = res.data;
            this.empty = false;
          } else {
            this.empty = true;
          }
      })
      .catch(e => {
          console.log(e);
      });
    },
    promptDelete(imageID, title) {
      this.imgID = imageID;
      this.imgTitle = title;
      this.dialog = true;
    },
    deleteImage(imageID) {
      console.log('deleting ' + imageID);
      this.dialog = false;
      // remove image from page
      let index = this.all.indexOf(imageID + '');
      if (index > -1) {
        this.all.splice(index, 1);
      }
      // remove image from database
      ajax.delete('drawing/' + imageID)
      .then(res => {
        console.log(res.data);
      })
      .catch(e => {
        console.log(e);
      });
    },
    recalc() {
        console.log('recalculation fav');
        this.macy.recalculate(true);
    },
    createMacy() {
      // layout
      console.log('created');
      this.macy = Macy({
          container: '#macy-container',
          trueOrder: false,
          waitForImages: false,
          margin: 4,
          columns: 4,
          breakAt: {
              1400: 3,
              1000: 2,
              800: 1
          }
      });
    }
  },
  mounted() {
    this.show = (this.idp == this.$root.user['id']);
    this.loadUser();
    this.createMacy();
    this.loadDrawings();
  },
}
</script>

<style scoped>
.wrap {
  padding: 20px;
}

.avatar {
  border: 2px solid #efefef22;
}

.divider {
  margin: 30px 0 !important;
}

.infoTab {
  display: flex;
  justify-content: space-evenly;
  margin-left: 60px;
}

.infoTab > div > div {
  margin-bottom: 10px;
  font-size: 20px;
}

.infoSide {
  width: 130px;
  margin-right: 20px;
}

.infoSide > div {
  font-weight: 400;
}

.infoValues > div {
  font-weight: 100;
}

/* Avatar Upload */
#avatar {
  display: none;
}

.avVue {
  position: relative;
}

.avLabel {
  cursor: pointer;
  position: absolute;
  bottom: 1px;
  top: 1px;
  left: 1px;
  right: 1px;
}

.uploadText {
  background-color: #333;
  opacity: 0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  transition: opacity 0.3s;
  width: 100%;
  height: 100%;
}

.avLabel:hover .uploadText {
  opacity: 0.9;
}

.layoutTiles {
    display: block;
}

.tile {
    padding: 6px;
}

/* Empty */

.emptyProfile {
  text-align: center;
  font-size: 2em;
  font-weight: 100;
  padding: 20px 0;
}

/* Responsive */
@media (max-width: 800px) {
  .profile {
    flex-direction: column;
  }
  .infoTab {
    margin: 0;
    padding-top: 20px;
  }
  .wrap {
    padding: 10px;
  }
}

</style>
