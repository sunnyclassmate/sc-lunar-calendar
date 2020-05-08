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
<!--      <v-container-->
<!--              class="fill-height"-->
<!--              fluid-->
<!--      >-->
      <v-container
              fluid
      >
        <Saju :value="searchDtm"></Saju>
<!--        <v-row-->
<!--                align="center"-->
<!--                justify="center"-->
<!--        >-->
<!--          <span>{{moment(date).format('YYYY-MM-DD')}}</span>-->
<!--          <span>{{JSON.stringify(lunar.solar2Lunar('19720126'))}}</span>-->
<!--        </v-row>-->
      </v-container>
    </v-content>
    <v-snackbar
            v-model="snackbar.visible"
            :timeout="snackbar.timeout"
            color="error"
    >
      {{ snackbar.message }}
      <v-btn
              dark
              color="black"
              text
              @click="snackbar.visible = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-footer
            padless
            app

    >
      <v-card
              class="flex"
              flat
              tile
              color="red darken-3"
      >
        <v-card-title>
<!--          <strong class="subheading">Get connected with us on social networks!</strong>-->

          <v-spacer></v-spacer>

<!--          <v-btn-->
<!--                  v-for="icon in footerIcons"-->
<!--                  :key="icon"-->
<!--                  class="mx-4"-->
<!--                  dark-->
<!--                  icon-->
<!--          >-->
<!--            <v-icon size="24px">{{ icon }}</v-icon>-->
<!--          </v-btn>-->
        </v-card-title>

<!--        <v-card-text class="py-2 white&#45;&#45;text text-center">-->
<!--          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>-->
<!--        </v-card-text>-->
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
  // import HelloWorld from "@/components/HelloWorld";
  import Saju from "@/components/Saju";

  export default {
    props: {
      source: String,
    },
    data: () => ({
      dialog: false,
      drawer: null,
      items: [
        { icon: 'mdi-home-variant', text: 'Home' },
        // { icon: 'mdi-calendar-clock', text: 'Home' },
        // { icon: 'mdi-account-network', text: 'Contacts' },
        // { icon: 'mdi-contacts', text: 'Contacts' },
        { icon: 'mdi-wrench', text: 'Settings' },
        // { icon: 'mdi-server-network', text: '인명 DB' },
        // { icon: 'mdi-settings', text: 'Settings' },
      ],
      footerIcons: [
        'mdi-facebook',
        // 'mdi-twitter',
        // 'mdi-linkedin',
        // 'mdi-instagram',
      ],
      searchText: '',
      snackbar:{ visible:false, message:'알맞은 검색어가 아닙니다.', timeout: 1000},
      // snackbar: false,
      // snackbarMessage: '알맞은 검색어가 아닙니다.',
      // snackbarTimeout: 1000
      // { icon: 'mdi-view-dashboard', text: 'Dashboard' },: '',
      searchDtm: '',
      searchName: '',
      searchIlju: '',
    }),
    created () {
      // this.$vuetify.theme.dark = true
      this.$vuetify.theme.light = true
      this.searchText = this.moment(new Date()).format('YYYYMMDDHHmm')
      this.searchDtm = this.searchText

      console.log(this.lunar.solar2Lunar('197201261130'))
    },
    components:{
      // HelloWorld
      Saju
    },
    methods: {
      onEnter: function() {
        const regexNumber = /\d{8,12}/g;
        this.searchDtm = (this.searchText.match(regexNumber) || [])[0]
        console.log(this.searchDtm)
        if(!this.searchDtm ){
          this.snackbar.visible = true
        }
      },

    }
  }
</script>