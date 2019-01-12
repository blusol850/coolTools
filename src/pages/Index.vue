<template>
  <q-page class="">
<div class="row">
<div class="col-12 q-pa-lg">
    <h5>{{info.title}}</h5>
  <div v-html="info.content"></div>

</div>
</div>
  </q-page>
</template>

<style>
</style>

<script>
import { axiosInstance } from 'plugins/axios'
export default {
  name: 'PageIndex',
  data () {
    return {
      info: {
        'title': 'coolTools',
        'content': 'loading'
      }
    }
  },
  mounted () {
    axiosInstance
      .get('https://blusol.io/blog/cooltools.json')
      .then(response => (this.info = response.data))
  }
}
</script>
