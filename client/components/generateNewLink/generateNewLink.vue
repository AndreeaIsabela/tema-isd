<template lang="pug">
  section.row
    .white-box.col-md-8.offset-md-2
      h2#title.text-center.font-weight-bold New Link :
      .input-group.col-md-10.offset-md-1
        input#link-input.form-control.input(type="email" v-model="link.email" aria-describedby="emailHelp" v-on:keyup.enter="onGenerate()" placeholder="email")
        button#generate.btn.btn-def.in-field-button(@click="onGenerate()") Generate
      p.text-danger.invalid-email {{link.message}}
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import * as moment from "moment";
import axios from "axios";
Vue.prototype.http = axios;

@Component
export default class generateNewLink extends Vue {
  public http = Vue.prototype.http;
  public link: any = {
    email: "",
    generated: "",
    message: ""
  };

  async onGenerate() {
    await this.verifyEmail();
    try {
      const response = await this.http.post("/link", {
        email: this.link.email,
        date: moment()
      });
      const url = "/generated/" + response.data._id;
      this.$router.push(url);
    } catch (error) {
        console.log(error);
      };
    }
  verifyEmail() {
    if (this.link.email === "") {
      this.link.message = "No email has been provided.";
      return;
    }
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(this.link.email).toLowerCase())) {
      this.link.message = "Please provide a valid email address.";
    }
  }
}
</script>
<style lang="stylus" scoped>
.white-box 
  background-color: white
  border-radius: 5%
  padding: 5% 0 5% 0

.in-field-button
  z-index: 3
  position: absolute
  right: -3px
  top: -3px

.invalid-email 
  margin-top: 3%
  margin-left: 35%


</style>
