<template lang="pug">
  section
    h2.font-weight-bold  Log In: 
    .form-group
      input.form-control.input#input-password(type="password" v-model="password" v-on:keyup.enter="login" v-on:change="message=''" placeholder="password" autofocus)
    .text-center
      p.text-danger.error-message(v-if="message") {{message}}
    .form-group.text-right
      button#login.btn.btn-def(@click="login") Continue
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios from "axios";

@Component
export default class login extends Vue {
  public password: String = "";
  public message: String = "";
  public http = axios;

  created() {
    if(localStorage.getItem('token')){
      this.$router.push("/files");
    }
  }
  async login() {
    try {
      const response = await this.http.post("/admin/login", {
        password: this.password
      });
      const token = response.data.token;
      window.localStorage.setItem("token", token);
      if (token) {
        const AUTH_TOKEN = "Bearer " + token;
        this.http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
        this.$parent.$emit("loggedin", true);
      }
      this.$router.push("/files");
    } catch (error) {
        if (error.response && error.response.status === 401) {
          this.message = "Invalid password.";
        }
        console.log(error);
      };
    }
  }
</script>

<style lang="stylus" scoped>
.error-message
  align-self: center
  color: #FFFFFF
  margin: 1%

</style>
