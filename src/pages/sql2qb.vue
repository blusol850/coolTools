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
<!-- <div class="col-6  col-md-12 q-pa-lg">
  <h5>JSON</h5>
  <pre>
{{sql2json}}
  </pre>
</div> -->

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
      'convertThis2': 'select firstName,lastName,eMail from contacts where isActive = 0 group by category order by lastName',
      'convertThis3': 'select firstName,lastName,eMail from contacts where isActive = 0 and (lastName=\'Davis\' or firstName=\'Andrew\') group by category order by lastName',
      'convertThis4': 'SELECT StudentCourse.COURSE_ID, Student.NAME, Student.AGE FROM Student INNER JOIN StudentCourse ON Student.ROLL_NO = StudentCourse.ROLL_NO',
      'convertThis': 'SELECT users.name,blogs.title,blogs.ID as blogID FROM blogs INNER JOIN users ON users.ID = blogs.FK_usersID where users.name=\'Andrew\' limit 5',
      'convertThis5': 'SELECT users.name,blogs.title,blogs.ID as blogID FROM blogs INNER JOIN users ON users.ID = blogs.FK_usersID where users.name=\'Andrew\' and blog.title=\'test\' limit 5',
      'sql2json': {},
      'sql2qb': {}
    }
  },
  methods: {
    convert2json: function (selected) {
      this.sql2json = parse(this.convertThis)
    },
    buildOutWhere (data) {
      // console.log('buildOutWhere:')
      if (data.left) {
        // console.log('more')
        // console.log(data.left.type)
        // let newData = data
        // this.buildOutWhere(newData)
      }
      // console.log(data.left)
      // join('users', 'users.ID', '=', 'blogs.FK_usersID')
      // SELECT users.name,blogs.title,blogs.ID as blogID FROM `blogs` INNER JOIN `users` ON `users`.`ID` = `blogs`.`FK_usersID`
      if (data.left.table) {
        return data.left.table + '.' + data.left.column + '","' + data.operator + '","' + data.right.value
      }
      return data.left.column + '","' + data.operator + '","' + data.right.value
    },
    buildOutJoin (data) {
      return data.left.table + '","' + data.left.table + '.' + data.left.column + '","' + data.operator + '","' + data.right.table + '.' + data.right.column
    },
    processObject (data) {
      if ((typeof data === 'object') && (data !== null)) {
        // console.log(data)
        if (data.left) {
          return this.buildOutWhere(data)
        } else {
          // qb = qb + '.from("' + data.from[key].table + '")'
        }
      } else {
        // console.log(data)
      }
      return false
    },
    convert2qb: function (data) {
      var _this = this
      if (!Object.keys(data).length) {
        return null
      }
      let qb = 'query'
      if (data.from) {
        Object.keys(data.from).forEach(function (key) {
          if (data.from[key].join) {
            console.log(data.from[key].join)
            let r = _this.buildOutJoin(data.from[key].on)
            if (data.from[key].join.toLowerCase() === 'left join') {
              qb = qb + '\n .leftJoin("' + r + '")'
            } else {
              qb = qb + '\n .join("' + r + '")'
            }
          } else {
            qb = qb + '.from("' + data.from[key].table + '")'
          }
        })
      }
      if (data.where) {
        let r = _this.buildOutWhere(data.where)
        // console.log(data.where.left)
        qb = qb + '\n .where("' + r + '")'
        // Object.keys(data.where).forEach(function (key) {
        //   if ((typeof data.where[key] === 'object') && (data.where[key] !== null)) {
        //     if (data.where[key].left) {
        //       let r = _this.buildOutWhere(data.where[key])
        //       // console.log(data.where[key].left)
        //       qb = qb + '\n .where("' + r + '")'
        //     }
        //   } else {
        //     // let r = _this.buildOutWhere(data.where[key])
        //     // qb = qb + '\n .where("' + r + '")'
        //   }
        // })
      }
      if (data.groupby) {
        Object.keys(data.groupby).forEach(function (key) {
          qb = qb + '\n .groupBy("' + data.groupby[key].column + '")'
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
          let r = data.columns[key].expr.table + '.' + data.columns[key].expr.column
          if (data.columns[key].as) {
            r = r + ' AS ' + data.columns[key].as
          }
          columns.push(r)
        })
        qb = qb + '\n .get( columns = ["' + columns.join('","') + '"]);'
      } else {
        qb = qb + '\n .get();'
      }
      return qb
    }
  },
  computed: {
    json2qb () {
      console.clear()
      console.log(this.sql2json)
      return this.convert2qb(this.sql2json)
    }
  }
}
</script>
