<template>
  <div id="link">
    <navigation v-bind:loggedin="loggedin"></navigation>
     <main class="container">
      <router-view></router-view>
    </main>
  </div>
</template>
<script>
import navigation from "./components/navigation/navigation";
export default {
  components: {
    navigation: navigation
  },
  data: function(){
    return{
    loggedin: false
    }
  },
  mounted: function() {
    const token = window.localStorage.getItem("token");
    if (token) {
      this.loggedin = true;
    }
    this.$on("loggedin",() =>  {
      this.loggedin = true;
    });
  }
};
</script>
<style lang="stylus">
body 
  font-family: 'Roboto', 'Arial', 'Helvetica', sans-serif
  background-color: #FCFCFC

@media(min-width : 768px) 
  section 
    margin: 10% 30% 0 30%

h2 
  margin-bottom: 10%
  color: #404249

h3
  margin-bottom: 1%
  color: #404249

.title 
  margin-top: 10%

.input 
  border-radius: 10rem

.btn-def 
  align-content: center
  background-color: #5FC2FF
  color: #FFFFFF
  border: none
  border-radius: 10rem
  box-shadow: 0 0.1rem 1rem 0 rgba(95, 194, 255, 0.4)
  transition-property: box-shadow
  transition-duration: 0.3s
  transition-timing-function: ease-in
  transition-delay: initial
  font-size: 1.2rem
  font-weight: 30
  font-style: normal
  text-decoration: none
  
</style>

