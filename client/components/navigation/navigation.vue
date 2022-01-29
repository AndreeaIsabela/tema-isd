<template lang="pug">
  nav.navbar.navbar-expand-sm.navigation
    .container
      router-link.navbar-brand(to="/files")
        span Home
    
      .justify-content-between(v-if="loggedin")
        router-link.nav-item.new-link(to="/generateNewLink")
          i.fa.fa-plus-circle 
          span.text-element  Add new link
          
        span.nav-item.log-out(@click="logOut")
          i.fa.fa-sign-out  
          span.text-element  Log Out
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class navigation extends Vue {
  @Prop() ["loggedin"];
  logOut() {
    localStorage.removeItem("token");
    this.$router.push("/login");
    location.reload(true);
  }
}
</script>

<style lang="stylus" scoped>
.navigation 
  background-color: #060813

.ai-logo-svg 
  height: 2.5rem
  margin-top: -.85rem
  shape-rendering: geometricPrecision

.new-link
  text-decoration: none
  color: #FF6161
  margin-right 30px
  &:hover
    color: @color
    text-decoration: none
    cursor: pointer

.log-out
  text-decoration: none
  color:#0a78c9
  margin-right 20px
  &:hover
    color: @color
    text-decoration: none
    cursor: pointer

@media (max-width : 768px) 
  .text-element
    display none
  
</style>
