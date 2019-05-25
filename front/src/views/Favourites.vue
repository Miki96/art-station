<template>
    <div class="wall">
        <v-container fluid class="pa-0">
            <div class="layout" id="macy-container">
                <tile v-for="draw in all" :key="'f' + draw" v-bind:id="Number(draw)" class="tile"></tile>
            </div>
        </v-container>

        <!-- Empty Favourites -->
        <div v-if="empty" class="emptyFav">
        Go to Artist's 
        <v-btn dark to="/wall" color="#ff1744">
            Wall
        </v-btn>
        to add some favourites.
        </div>
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
  data: () => {
      return {
          all: [],
          macy: null,
          empty: false
      }
  },
  watch: {
    all: function (val) {
        console.log('from watch');
        this.createMacy();
        if (val.length == 0) {
            this.empty = true;
        }
    }
  },
  methods: {
      loadFavourites() {
        // get all favourites
        ajax.get('/loves/' + this.$root.user['id'])
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
      this.loadFavourites();
      this.createMacy();
  }
}
</script>

<style scoped>
h2 {
    margin-bottom: 20px;
}
.divider {
    margin-bottom: 30px;
}
.wall {
  padding: 20px;
}

.layout {
    display: block;
}

.tile {
    padding: 6px;
}

/* Empty */

.emptyFav {
  text-align: center;
  font-size: 2em;
  font-weight: 100;
  padding: 20px 0;
}

/* Responsive */
@media (max-width: 500px) {
  .wall {
      padding: 10px;
  }
}

</style>
