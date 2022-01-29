<template lang="pug">
 div
    .container-fluid#uploading-file(v-if="showUpload") 
      vue-clip(:options="options" :on-added-file="uploadFile") 
        .container.drop-files.text-center(slot="clip-uploader-action") 
          form.form.container-fluid(role="form" onsubmit="return false;") 
            .row 
              img.img-fluid.col-md-2.offset-md-5.upload-files-img(src="images/svg/spotFileUpload.svg") 
            .row.dz-message 
              h6.font-weight-bold.col-md-12 Drag and drop your Zip file here
            .row
              .col-md-8.offset-md-2 
                small
                  i.text-muted or
                i.upload-link#upload-file(@click="triggerUpload")  click to add file
                input#file.form-control(type="file" accept=".zip, .rar, .7z" v-on:change="uploadFile" ref="uploadButton")
            p.text-center.col-md-8.offset-md-2 
              small.text-muted You can add .rar, .zip or .7z format
      div(v-if="saveClose")
        .file-name-box.row.justify-content-between 
          div
            i.fa.fa-paperclip
            span#file-name-text  {{fileName}}
          i.fa.fa-trash.delete-file#delete-file(@click="deleteFile") 
        .row 
          button#upload.btn.btn-def.btn-upload(type="button" @click="onSubmit") Upload

    div(v-else) 
      div(v-if="animated") 
        .progress-box
          .container.inside-blue.row.justify-content-between 
            div
              span.in-progress.col-md-1 
                span.fa.fa-circle-o-notch.loading-gif 
              span.col-md-3  {{this.formData.filePath}}
            span.in-progress.col-md-2  Uploading... 
          .progress.animated-progress 
            .progress-bar.bg-in-progress(role="progressbar" v-bind:aria-valuenow="percentLoad" :style="{ width:percentLoad + '%' }" aria-valuemin="0" aria-valuemax="100")

      div(v-if="failed") 
        .progress-box 
          .inside-red.row.justify-content-between
            .col-md-8 
              span.fa.fa-times-circle.failed-upload 
              span.col-md-12  {{this.formData.filePath}}
            .col-md-4
              span.failed-upload.col-md-3 {{errorStatus}} 
              span.try-again.col-md-1(@click="refresh") 
                i.fa.fa-refresh.sync#retry
          .progress.failed-progress
            .progress-bar.bg-failed-upload(role="progressbar" aria-valuenow="100" aria-valuemin="0" style="width:100%")
              p.error-message  {{errorMessage}}

      div(v-if="success") 
        .progress-box
          .inside-green.container.row.justify-content-between
            span  
              i.fa.fa-check-circle.upload-success.success-icon 
              span  {{this.formData.filePath}}
            span.upload-success Success! 
        .text-center
          p.text-success.upload-success-text#success-text Your file has been successfully uploaded. 
</template>

<script lang="ts">
import * as moment from "moment";
import { Vue, Component, Prop } from "vue-property-decorator";
import VueClip from "vue-clip";
import axios from "axios";
Vue.use(VueClip);
@Component
export default class upload extends Vue {
  @Prop() ["id"];
  public http = axios;
  public errorStatus: String = "";
  public errorMessage: String = "";
  public message: String = "";
  public fileName: String = "";
  public uploadUrl: String = "";
  public formData: any = {};
  public files: any = [];
  public saveClose: boolean = false;
  public animated: boolean = false;
  public failed: boolean = false;
  public success: boolean = false;
  public showUpload: boolean = false;
  public event: any = {};
  public percentLoad: number = 0;
  public options: any = {
    url: "/link/upload/" + this.id
  };
  constructor() {
    super();
  }

  async created() {
    this.showUpload = true;
    const url = "/link/" + this.id;
    try {
      const response = await this.http.get(url);
      //if the link is older than 7 days or already used go on expired
      if (response.data.expiredForUser) {
        this.$router.push("/expired");
      }
    } catch (err) {
      this.$router.push("/notFound");
    }
  }
  deleteFile() {
    delete this.event;
    this.saveClose = false;
  }
  refresh() {
    location.reload(true);
  }
  failedToLoad() {
    this.animated = false;
    this.failed = true;
  }
  loaded() {
    this.animated = false;
    this.success = true;
  }
  isLoading() {
    //change the view from upload to loading progress-bar
    this.showUpload = false;
    this.animated = true;
  }
  triggerUpload() {
    const elem = <HTMLInputElement>this.$refs.uploadButton;
    //the value of add file input is set to default
    (<HTMLInputElement>this.$refs.uploadButton).value = (<HTMLInputElement>this
      .$refs.uploadButton).defaultValue;
    //when the link is clicked it triggers the hidden add files input
    elem.click();
  }
  uploadFile(event) {
    this.event = event;
    if (event.name) {
      //if the file is dragged and dropped save the name
      this.fileName = event.name;
    } else {
      //if the file is selected save the name of that file
      this.fileName = event.target.files[0].name;
    }
    this.saveClose = true;
  }
  async onSubmit() {
    this.isLoading();
    var file;
    try {
      //if the file is dragged and dropped
      const files = this.event.target.files || this.event.dataTransfer.files;
      this.formData.filePath = files[0].name;
      file = files[0];
    } catch (err) {
       //if the file is selected
      file = this.event._file;
      this.formData.filePath = this.event.name;
    }
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("updateDate", moment().toString());
    formdata.append("filePath", this.formData.filePath);

    const url = "/link/upload/" + this.id;
    try {
      const response = await this.http.post(url, formdata, {
        //progress-bar
        onUploadProgress: progressEvent => {
          if (progressEvent.lengthComputable) {
            const totalLength = progressEvent.lengthComputable
              ? progressEvent.total
              : progressEvent.target.getResponseHeader("content-length") ||
                progressEvent.target.getResponseHeader(
                  "x-decompressed-content-length"
                );
            this.percentLoad = Math.round(
              progressEvent.loaded * 100 / totalLength
            );
          }
        }
      });
      this.loaded();
    } catch (error) {
      if (error.response.status === 400) {
        this.errorStatus = "Upload Failed!";
        this.errorMessage =
          "File format not compatible. Try a different format.";
      } else {
        this.errorStatus = "Upload interrupted!";
        this.errorMessage =
          "There was a problem with the conection. Please try again.";
      }
        console.log(error);
        this.failedToLoad();
    }
  }
}
</script>

<style lang="stylus" scoped src="./upload.styl"></style>
