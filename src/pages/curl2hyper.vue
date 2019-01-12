<template>
  <q-page class="">
<div class="row">
<div class="col-12 q-pa-lg">
  <h5>curl Input</h5>
<q-input
  v-model="convertThis"
  type="textarea"
  float-label="curl"
/>
</div>
<div class="col-12 q-pa-lg">
<q-btn color="primary" @click="convert2json" label="Convert" />
</div>
<div class="col-6 col-md-12 q-pa-lg">
  <h5>hyper</h5>
  <pre>
{{json2hyper}}
  </pre>
</div>
<!-- <div class="col-6  col-md-12 q-pa-lg">
  <h5>JSON</h5>
  <pre>
{{curl2json}}
  </pre>
</div> -->
</div>
  </q-page>
</template>

<style>
</style>

<script>
import { parse } from 'parse-curl'
export default {
  name: 'PageIndex',
  data () {
    return {
      'convertThis1': 'curl "https://api.digitalocean.com/v2/domains"',
      'convertThis': 'curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $DIGITALOCEAN_API_TOKEN"  -d \'{"name":"example.com"}\' "https://api.digitalocean.com/v2/domains"',
      'curl2json': {},
      'curl2hyper': {}
    }
  },
  methods: {
    convert2json: function (selected) {
      this.curl2json = parse(this.convertThis)
    },
    convert2hyper: function (data) {
      if (!Object.keys(data).length) {
        return null
      }
      let hyper = 'hyper'
      hyper = hyper + '.setMethod( "' + data.method + '" )'
      hyper = hyper + '\n .setURL( "' + data.url + '" )'
      if (data.header) {
        Object.keys(data.header).forEach(function (key) {
          hyper = hyper + '\n .withHeaders( {"' + key + '" = "' + data.header[key] + '"} )'
        })
      }
      if (data.body) {
        hyper = hyper + '\n .setBody( ' + JSON.stringify(data.body) + ' )'
      }
      hyper = hyper + '\n .send();'
      return hyper
    }
  },
  computed: {
    json2hyper () {
      return this.convert2hyper(this.curl2json)
    }
  }
}
</script>
