<template>
  <q-page class="">
<div class="row">
<div class="col-12 q-pa-lg">
  <h5>sql Input</h5>
<q-input
  v-model="convertThis"
  type="textarea"
  float-label="sql"
/>
</div>
<div class="col-12 q-pa-lg">
<q-btn color="primary" @click="convert2json" label="Convert" />
</div>
<div class="col-6 col-md-12 q-pa-lg">
  <h5>qb</h5>
  <pre>
{{json2qb}}
  </pre>
</div>
<div class="col-6  col-md-12 q-pa-lg">
  <h5>JSON</h5>
  <pre>
{{sql2json}}
  </pre>
</div>
</div>
  </q-page>
</template>

<style>
</style>

<script>
import { parse } from 'node-sqlparser'
export default {
  name: 'PageIndex',
  data () {
    return {
      'convertThis': 'select firstName,lastName,eMail from contacts where isActive = 0 group by category order by lastName',
      'sql2json': {},
      'sql2qb': {}
    }
  },
  methods: {
    convert2json: function (selected) {
      this.sql2json = parse(this.convertThis)
      // console.log(this.sql2json)
      // console.log(stringify(this.sql2json))
    },
    convert2qb: function (data) {
      if (!Object.keys(data).length) {
        return null
      }
      let qb = 'query'
      if (data.from) {
        Object.keys(data.from).forEach(function (key) {
          qb = qb + '.from("' + data.from[key].table + '")'
        })
      }
      if (data.where) {
        if (data.where.right.type === 'number2') {
          qb = qb + '\n .where("' + data.where.left.column + '","' + data.where.operator + '",' + data.where.right.value + ' )'
        } else {
          qb = qb + '\n .where("' + data.where.left.column + '","' + data.where.operator + '","' + data.where.right.value + '")'
        }

        console.log(data.where.left)
        // Object.keys(data.where).forEach(function (key) {
        //   // console.log(data.where[key])
        //   if ((typeof data.where[key] === 'object') && (data.where[key] !== null)) {
        //     console.log('object')
        //     console.log(data.where[key])
        //     // console.log(data.where[key].left.column)
        //     // Object.keys(data.where[key]).forEach(function (key2) {
        //     //   console.log(key2)
        //     // })
        //   }
        //   // console.log(data.where[key].left.column)
        //   // qb = qb + '\n .where( "' + data.where[key].left.column + '" )'
        // })
      }
      if (data.groupby) {
        Object.keys(data.groupby).forEach(function (key) {
          qb = qb + '\n .groupby("' + data.groupby[key].column + '")'
        })
      }
      if (data.orderby) {
        Object.keys(data.orderby).forEach(function (key) {
          qb = qb + '\n .orderBy("' + data.orderby[key].expr.column + '","' + data.orderby[key].type + '")'
        })
      }
      if (data.limit) {
        qb = qb + '\n .limit("' + data.limit[1].value + '")'
      }
      if ((typeof data.columns === 'object')) {
        let columns = []
        Object.keys(data.columns).forEach(function (key) {
          columns.push(data.columns[key].expr.column)
        })
        qb = qb + '\n .get("' + columns.join('","') + '");'
      } else {
        qb = qb + '\n .get();'
      }
      return qb
    }
  },
  computed: {
    json2qb () {
      return this.convert2qb(this.sql2json)
    }
  }
}
</script>
