<template lang="pug">
  .row.expired-link
    .col-md-4.offset-md-4
      img.img-fluid.col-md-4.offset-md-4(src="images/svg/spotLinkExpired.svg")
      br 
      br
      h5.font-weight-bold.text-center This link has expired. 
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class expired extends Vue {}
</script>

<style lang="stylus" scoped>
.expired-link
  margin-top: 20%

</style>
