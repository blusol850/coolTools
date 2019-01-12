<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          coolTools
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <img src="https://blusol.io/__media/blusolio.png" class="responsive q-pa-lg">
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Tools</q-list-header>
        <q-item to="/curl2hyper">
          <q-item-side icon="fas fa-globe" />
          <q-item-main label="curl2hyper" />
        </q-item>
        <q-item to="/sql2qb">
          <q-item-side icon="fas fa-database" />
          <q-item-main label="sql2qb" />
        </q-item>
        <q-list-header>Contact Me</q-list-header>
        <q-item @click.native="openURL('https://twitter.com/blusol850')">
          <q-item-side icon="ion-logo-twitter" />
          <q-item-main label="Twitter" sublabel="@blusol850" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
