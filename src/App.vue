<template>
  <v-app id="inspire">
    <v-navigation-drawer
            v-model="drawer"
            :clipped="$vuetify.breakpoint.lgAndUp"
            app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row
                  v-if="item.heading"
                  :key="item.heading"
                  align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
                    cols="6"
                    class="text-center"
            >
              <a
                      href="#!"
                      class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
                  v-else-if="item.children"
                  :key="item.text"
                  v-model="item.model"
                  :prepend-icon="item.model ? item.icon : item['icon-alt']"
                  append-icon=""
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
                    v-for="(child, i) in item.children"
                    :key="i"
                    link
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
                  v-else
                  :key="item.text"
                  link
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            app
            color="red darken-3"
            dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
<!--      <v-text-field-->
<!--              flat-->
<!--              solo-inverted-->
<!--              hide-details-->
<!--              prepend-inner-icon="mdi-magnify"-->
<!--              label="Search"-->
<!--              @keyup.enter="onEnter"-->
<!--              v-model="searchText"-->
<!--      />-->
      <v-text-field
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-magnify"
              placeholder="Search"
              @keyup.enter="onEnter"
              v-model="searchText"
      />

    </v-app-bar>
    <v-content>
      <v-container
              class="fill-height"
              fluid
      >
        <v-row
                align="center"
                justify="center"
        >
          <HelloWorld></HelloWorld>
        </v-row>
      </v-container>
    </v-content>
    <v-snackbar
            v-model="snackbar"
            :timeout="snackbarTimeout"
            color="error"
    >
      {{ snackbarMessage }}
      <v-btn
              dark
              color="black"
              text
              @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
  import HelloWorld from "@/components/HelloWorld";

  export default {
    props: {
      source: String,
    },
    data: () => ({
      dialog: false,
      drawer: null,
      items: [
        { icon: 'mdi-clock', text: 'Home' },
        // { icon: 'mdi-contacts', text: 'Contacts' },
        // { icon: 'mdi-server-network', text: '인명 DB' },
        // { icon: 'mdi-settings', text: 'Settings' },
      ],
      searchText: '',
      snackbar: false,
      snackbarMessage: '알맞은 검색어가 아닙니다.',
      snackbarTimeout: 1000
      // { icon: 'mdi-view-dashboard', text: 'Dashboard' },: '',
    }),
    created () {
      // this.$vuetify.theme.dark = true
      this.$vuetify.theme.light = true
    },
    components:{
      HelloWorld
    },
    methods: {
      onEnter: function() {
        var integer = parseInt(this.searchText, 10);
        console.log(integer)
        this.snackbar = true
      }
    }
  }
</script>