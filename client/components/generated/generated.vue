<template lang="pug">
  section.row
    .white-box.col-md-9.offset-md-1.text-center
      h2#title-generated.font-weight-bold Link generated :
      .col-md-10.offset-md-1
        a#copy-url-link.generated-link(href="#" v-clipboard:copy="origin +'/#/upload/' + id" @click="copy")
          i.fa.fa-link
          span#page-link {{ origin + '/#/upload/' + id}}
      small.text-muted {{statusMessage}}
</template>

<script lang="ts">
import Vue from 'vue'
import * as VueClipboard from 'vue-clipboard2'
import {Component, Prop } from "vue-property-decorator";
Vue.use(VueClipboard)
@Component
export default class generated extends Vue{
  @Prop() ["id"];
  
  public statusMessage:String = "Click on this link to copy it to your clipboard";
  public origin:any = window.location.origin;
  copy() {
    this.statusMessage = "The link has been copied to clipboard";
  }
};
</script>

<style lang="stylus" scoped>
.white-box 
  background-color: white
  border-radius: 5%
  padding: 5% 0 5% 0

.generated-link
  color: #0A78C9
  word-wrap:break-word;

</style>
