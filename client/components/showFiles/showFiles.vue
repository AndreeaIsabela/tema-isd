<template lang="pug">
    #showFiles(v-if="linkVector.length")
      h3#showFilesTitle.font-weight-bold.title Recent Links
      .table-responsive
        table.table(v-if="linkVector.length")
          thead
            tr
              th(scope="col") Mail
              th(scope="col") Updated
              th(scope="col") Download 
          tbody.tr-blue
            tr(v-for="(link,index) in linkVector" v-bind:key="index")
              td.text-truncate(v-if="link.filePath") {{link.email}}
              td.expired.text-truncate(v-else-if="link.expiredForUser") {{link.email}}
              td.text-muted.text-truncate(v-else) {{link.email}}
              td(v-if="link.filePath") {{link.updateDate}}
              td.text-muted(v-else) -
              td.font-weight-bold.default(v-if="link.filePath")
                a#download-file(href="#" v-on:click="download(link._id)") Download 
              td.font-weight-bold.default.text-muted(v-else-if="link.expiredForUser") Expired
              td.font-weight-bold.default.text-muted(v-else) Download
              <!-- button.btn.btn-danger(v-on:click="onDelete(link._id, index)") Delete -->
      b-pagination(align="center" :total-rows="totalRows" v-model="currentPage" :per-page="20")
    .show-files(v-else-if="this.loaded && !linkVector.length")
          img.img-fluid(src="images/svg/spotListEmpty.svg")
          h6.font-weight-bold.text-center No new links were added.
</template>

<script lang="ts">
import * as moment from "moment";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import axios from "axios";
Vue.prototype.http = axios;
import bPagination from "bootstrap-vue/es/components/pagination/pagination";

Vue.component("b-pagination", bPagination);

@Component
export default class showFiles extends Vue {
  public linkVector: any = [];
  public http: any = Vue.prototype.http;
  public currentPage: number = 1;
  public totalRows: number;
  public rows: any;
  public rowsPerPage: number = 20;
  public loaded: boolean = false;

  constructor() {
    super();
  }

  async download(id) {
    const link = "link/download/" + id;
    axios({
      url: link,
      method: "GET",
      responseType: "blob" // important
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const contentHeader = response.headers["content-disposition"];
      const match = new RegExp('\=(.*)$').exec(contentHeader);
      const fileName =match[1].toString();
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    });
    //const response = await this.http.get(link);
  }

  async created() {
    try {
      //get first 20 items
      const response = await this.http.get("/link/page/1");
      //get  total number of items
      const totalRowsObj = await this.http.get("/link/totalPages");
      this.totalRows = totalRowsObj.data;
      this.rows = response.data;
      var index = 0;
      for (var link in response.data) {
        index++;
        if (index == this.rowsPerPage - 1) {
          break;
        }
        //put the first 20 items in linkVector,to be displayed
        this.linkVector.push({
          _id: response.data[link]._id,
          email: response.data[link].email,
          date: response.data[link].date,
          filePath: response.data[link].filePath,
          expiredForUser: response.data[link].expiredForUser,
          updateDate: moment(response.data[link].updateDate).format(
            "D MMMM YYYY"
          )
        });
      }
      this.loaded = true;
    } catch (err) {
      console.log(err);
    }
  }

  @Watch("currentPage")
  async onPropertyChanged(newPageNumber: number, oldPageNumber: number) {
    const link = "/link/page/" + newPageNumber;
    const response = await this.http.get(link);

    this.linkVector = [];
    var index = 0;
    while (index < response.data.length && index < 20) {
      this.linkVector.push({
        _id: response.data[index]._id,
        email: response.data[index].email,
        date: response.data[index].date,
        filePath: response.data[index].filePath,
        expiredForUser: response.data[index].expiredForUser,
        updateDate: moment(response.data[index].updateDate).format(
          "D MMMM YYYY"
        )
      });
      ++index;
    }
  }

  async onDelete(id, index) {
    const url = "/link/" + id;
    try {
      const response = await this.http.delete(url);
      this.linkVector.splice(index, 1);
    } catch (err) {
      console.log(err);
    }
  }
}
</script>

<style lang="stylus"  scoped src="./showFiles.styl"></style>
