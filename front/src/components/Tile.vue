<template>
<v-flex class="tile">
  <v-card  class="mytile">
    <v-img
      v-if="image"
      ref="mainImg"
      :src="image"
      class="lighten-2"
      @load="$parent.recalc()"
    >
    </v-img>
    <v-card-actions class="pa-1 px-2 actions">
      <v-btn flat icon class="pa-0 user" v-bind:to="`/profile/${author}`">
        <v-avatar class="avatar" :size="35">
          <img v-if="avatar" :src="avatar" alt="avatar" ref="avatarImg">
        </v-avatar>
      </v-btn>
      <span class="titleArt">{{this.title}}</span>
      <v-spacer></v-spacer>
      <v-btn v-if="canDelete" @click="deleteImage" icon flat><v-icon>delete</v-icon></v-btn>
      <v-btn @click="loveImage" icon flat :color="love ? 'red' : 'grey darken-2'" ><v-icon>favorite</v-icon></v-btn>
      <v-btn v-if="!profile" @click="likeImage" icon flat :color="like ? 'grey lighten-2' : 'grey darken-2'"><v-icon>thumb_up_alt</v-icon></v-btn>
      <v-btn v-if="!profile" @click="hateImage" icon flat :color="hate ? 'grey lighten-2' : 'grey darken-2'"><v-icon>thumb_down_alt</v-icon></v-btn>
    </v-card-actions>
  </v-card>
</v-flex>
</template>

<style scoped>
.user {
  text-transform: none !important;
}
.titleArt {
  margin-left: 10px;
}
.mytile {
  position: relative;
  cursor: pointer;
}
.actions {
  opacity: 0;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  transition: opacity 0.3s;
  background-color: #33333399;
}
.mytile:hover .actions {
  opacity: 1;
}

</style>

<script>
import ajax from '../http-common.js';

export default {
  props: {
    id: {
      default: -1
    },
    canDelete: {
      default: false
    }
  },
  data: () => {
    return {
      author: null,
      title: '',
      path: null,
      image: null,
      avatar: null,
      love: false,
      like: false,
      hate: false,
      profile: false,
    }
  },
  methods: {
    loadDrawInfo() {
      // get drawing by ID
        ajax.get('/drawing/' + this.id)
        .then(res => {
            console.log(res.data);
            // save values
            this.author = Number(res.data['author']);
            this.title =  res.data['title'];
            this.path = res.data['path'];
            this.love = res.data['love'];
            this.like = res.data['like'];
            this.hate = res.data['hate'];
            // load user avatar
            this.loadImage(1, 'images/avatars/av' + this.author + '.png');
            // load image
            this.loadImage(2, 'images/drawings/' + this.id + '.png');
            // disable some controls if users image
            this.profile = (this.author == this.$root.user['id']);
        })
        .catch(e => {
            console.log(e);
        });
    },
    loadImage (dest, path) {
      ajax.get(path, { responseType: 'arraybuffer'} )
      .then(res => {
        // load image to dest
        let img = new Buffer(res.data, 'binary').toString('base64');
        let image = "data:;base64," + img;
        if (dest == 1) {
          this.avatar = image;
        }
        else {
          this.image = image;
        }
      })
      .catch(e => {
        console.log(e);
        // default avatar
        if (dest == 1 && e.response.status == '404') {
          this.loadImage (1, 'images/avatars/def.jpg');
        }
      });
    },
    loveImage() {
      // add image to favourites
      ajax.post('/loves/' + this.id)
      .then(res => {
          console.log(res.data);
          // remove from page if on favourites
          if (this.love && this.$route.path == '/favourites') {
            console.log('unloving');
            // remove from parent
            let index = this.$parent.all.indexOf(this.id + '');
            if (index > -1) {
              this.$parent.all.splice(index, 1);
            }
          } else {
            // update drawing
            this.loadDrawInfo();
          }
      })
      .catch(e => {
          console.log(e);
      });
    },
    likeImage() {
      // add image to favourites
      ajax.post('/likes/' + this.id)
      .then(res => {
          console.log(res.data);
          this.loadDrawInfo();
      })
      .catch(e => {
          console.log(e);
      });
    },
    hateImage() {
      // add image to favourites
      ajax.post('/hates/' + this.id)
      .then(res => {
          console.log(res.data);
          this.loadDrawInfo();
      })
      .catch(e => {
          console.log(e);
      });
    },
    deleteImage() {
      // delete this image from database
      this.$parent.promptDelete(this.id, this.title);
    }
  },
  mounted() {
    this.loadDrawInfo();
  }
}
</script>

