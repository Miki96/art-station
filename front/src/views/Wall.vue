<template>
    <div class="wall">
        <v-container fluid class="pa-0">
            <div class="layout" id="macy-container">
                <tile v-for="draw in all" :key="'w' + draw" v-bind:id="Number(draw)" class="tile"></tile>
            </div>
        </v-container>
        <v-btn dark to="draw" fab color="#ff1744" fixed bottom right>
            <v-icon>brush</v-icon>
        </v-btn>
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
          macy: null
      }
  },
  methods: {
      loadDrawings() {
        // get all drawings
        ajax.get('/drawings')
        .then(res => {
            // save to component
            this.all = res.data;
        })
        .catch(e => {
            console.log(e);
        });
      },
      recalc() {
          console.log('recalculation');
          this.macy.recalculate(true);
      },
      createMacy() {
        // layout
        this.macy = Macy({
            container: '#macy-container',
            trueOrder: false,
            waitForImages: true,
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
    this.loadDrawings();
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
/* Images Wall */
.layout {
    display: block;
}

.tile {
    padding: 6px;
}

/* Responsive */
@media (max-width: 500px) {
  .wall {
      padding: 10px;
  }
}
</style>
