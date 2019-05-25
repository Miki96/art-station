<template>
  <v-container ref="page" fluid fill-height align-center justify-center class="page">
    <v-form v-if="!startDraw" class="form">
      <v-text-field class="rotIcon"
        append-icon="unfold_more"
        v-model="width"
        type="number"
        label="Width"
        solo
        color="#ff1744" 
      ></v-text-field>
      <v-text-field
        append-icon="unfold_more"
        v-model="height"
        type="number"
        label="Height"
        solo
        color="#ff1744" 
      ></v-text-field>
      <v-btn dark v-on:click="createArt" fab large color="#ff1744" class="start">
        <v-icon>brush</v-icon>
      </v-btn>
    </v-form>

    <div id="container" ref="table"></div>

    <v-toolbar v-if="startDraw" :value="true" color="secondary" fixed class="tools">
      <!-- Background Picker -->
      <input type="color" v-model="bgColor" id="color">  
      <label for="color" class="colorLabel elevation-5" v-bind:style="{ backgroundColor: bgColor }">
        <v-icon :light="!dark">color_lens</v-icon>
      </label>

      <div class="slider">
        <v-slider v-model="slider" color="#eee" min="1" max="90"></v-slider>
      </div>
      <v-spacer></v-spacer>
      <v-btn flat icon v-on:click="clear" class="hidden-xs-only"><v-icon>delete</v-icon></v-btn>
      <v-btn flat icon v-on:click="undo"><v-icon>undo</v-icon></v-btn>
      <v-btn flat icon v-on:click="redo"><v-icon>redo</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-btn flat icon v-on:click="close"><v-icon>close</v-icon></v-btn>
      <v-btn flat icon @click="dialog = true"><v-icon>save</v-icon></v-btn>
      <v-spacer></v-spacer>
      <!-- Color Picker -->
      <input type="color" v-model="brushColor" id="colorBr">  
      <label for="colorBr" class="colorLabel elevation-5" v-bind:style="{ backgroundColor: brushColor }">
        <v-icon :light="!darkBrush">brush</v-icon>
      </label>
      <!-- Colors -->
      <v-btn class="hidden-sm-and-down" v-for="(val,k) in pallete" :key="k" fab dark small v-bind:color="val"
        v-on:click="changeColor(val)" active-class=""
      ></v-btn>
    </v-toolbar>

    <!-- Dialog -->

    <v-dialog v-model="dialog" max-width="300">
      <v-card class="formSave">
        <v-card-title class="subheading">Save your artwork?</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="title"
              label="Title"
              color="#ff1744" 
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red accent-3" flat @click="dialog = false">Close</v-btn>
          <v-btn :disabled="!title" color="red accent-3" flat @click="dialog = false; save()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import ajax from '../http-common.js';

export default {
  data: function () {
    return {
      slider: 10,
      startDraw: false,
      width: 800,
      height: 600,
      color: '#333',
      sketch: null,
      pallete: ['#f44336', '#ffeb3b', '#4caf50', '#2196f3', '#202020', '#efefef'],
      bgColor: '#ffffff',
      brushColor: '#222222',
      dialog: false,
      title: null
    }
  },
  computed: {
    dark: function () {
      return this.calcDark(this.bgColor);
    },
    darkBrush: function () {
      return this.calcDark(this.brushColor);
    }
  },
  watch: {
    slider: function (val) {
      this.sketch.setLineSize(val);
    },
    bgColor: function (val) {
      if (this.sketch) {
        console.log('background');
        this.sketch.opts.backgroundColor = val;
        this.sketch.redraw();
      }
    },
    brushColor: function (val) {
      if (this.sketch) {
        console.log('brush');
        this.sketch.setLineColor(val);
      }
    }
  },
  methods: {
    close () {
      this.sketch = null;
      this.$refs.table.innerHTML = '';
      this.startDraw = false;
      this.bgColor = '#ffffff';
      this.brushColor = '#222222';
    },
    changeColor(c) {
      this.sketch.setLineColor(c);
    },
    clear() {
      this.sketch.clear();
    },
    undo() {
      this.sketch.undo();
    },
    redo() {
      this.sketch.redo();
    },
    resize() {
      if (this.sketch && this.$refs.table) {
        console.log('resize');
        console.log(this.$refs.table.offsetWidth);
        this.sketch.resize(this.$refs.table.offsetWidth);
      }
      this.fixSize();
    },
    fixSize() {
      if (this.$refs.page) {
        this.width = this.$refs.page.offsetWidth;
        this.height = this.$refs.page.offsetHeight - 70;
      }
    },
    createArt() {
      this.startDraw = true;
      var Sketchpad = require('responsive-sketchpad');
      var el = document.getElementById('container');

      this.sketch = new Sketchpad(el);
      this.sketch.opts.aspectRatio= this.height/this.width;
      // this.sketch.opts.width = this.$refs.table.offsetWidth;
      this.sketch.opts.backgroundColor = '#eeeeee';
      this.sketch.setLineColor('#222222');
      this.sketch.setLineSize(10);
      this.resize();
    },
    save() {
      // Save image to server
      console.log('save');
      let that = this;
      // var image = this.sketch.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      // window.location.href=image;
      this.sketch.canvas.toBlob(function (blob) {
        let formData = new FormData();
        formData.append('drawing', blob);
        formData.append('title', that.title ? that.title : 'My Drawing');

        ajax.post('/drawing',
          formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          console.log(res.data);
          // go to wall
          that.$router.push('wall');
        })
        .catch(e => {
          console.log(e);
        });
      }, 'image/png');
    },
    calcDark(col) {
      var c = col.substring(1);      // strip #
      var rgb = parseInt(c, 16);   // convert rrggbb to decimal
      var r = (rgb >> 16) & 0xff;  // extract red
      var g = (rgb >>  8) & 0xff;  // extract green
      var b = (rgb >>  0) & 0xff;  // extract blue

      var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

      if (luma < 128) {
        console.log("true dark");
        return true;
      } else {
        console.log("false dark");
        return false;
      }
    }
  },
  mounted: function () {
    // mount
    window.addEventListener('resize', this.resize);
    // set initial width and height
    this.fixSize();
  },
  destroyed() {
    window.removeEventListener("resize", this.resize);
  }
}
</script>

<style scoped>
#container {
  width: 100%;
}
.tools {
  bottom: 0;
  top: auto !important;
  z-index: 10 !important;
  padding-right: 20px !important;
}
.slider {
  margin-top: 15px !important;
  width: 340px;
  flex-grow: none;
  padding-left: 20px;
}
.colorLabel {
  width: 40px;
  height: 40px;
  background-color: #eee;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 5px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
#color, #colorBr {
  visibility: hidden;
  width: 0 !important;
}
#save {
  right: 20px;
  top: 80px;
}
.page {
  padding-bottom: 70px;
}
.form {
  width: 300px;
  position: fixed;
  right: calc(50% - 150px);
  top: calc(50% - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.formSave {
  padding: 10px;
}

/* Responsive */
@media (max-width: 500px) {
  .slider {
    position: fixed;
    bottom: 55px;
    left: 0;
    right: 0;

    height: 30px;
    width: 100%;
    margin: 0 !important;
    padding: 0 10px !important;
    background-color: #424242;
  }
  .page {
    padding-bottom: 85px;
    padding-top: 0;
  }
  .colorLabel {
    margin-right: 0;
  }
}


</style>
