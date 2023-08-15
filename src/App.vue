<template>
  <v-app>
    <div :class="[isCollapsed ? 'collapsed' : 'not-collapsed']"
      v-if="!['first-register', 'second-register', 'login'].includes($route.name)">
      <v-main class="internal-main">
        <sidebar />
        <navbar />
        <router-view />
      </v-main>
    </div>
    <div v-else>
      <v-main class="external-main">
        <router-view />
      </v-main>
    </div>
  </v-app>
</template>

<script>
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar.vue';
export default {
  name: 'App',
  components: {
    Sidebar,
    Navbar
  },
  data: () => ({
  }),
  computed: {

    isCollapsed() {
      return this.$store.state.isCollapsed
    }
  },
  created() {
    const token = localStorage.getItem("token")
    console.log(token)
    this.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  },


};
</script>

<style lang="scss">
* {
  letter-spacing: normal !important;
}

#app {
  font-family: 'Almarai', sans-serif !important;
  direction: rtl;
  text-align: justify !important;
}

.v-application {
  background-color: #f5f7fc !important;
}

@media (max-width: 767px) {
  .internal-main {
    padding-right: 65px !important;
  }
}

@media (min-width: 767px) {
  .collapsed {
    padding-right: 65px;
    transition: 0.3s padding-right ease;
  }

  .not-collapsed {
    padding-right: 300px;
    transition: 0.3s padding-right ease;
  }
}


@font-face {
  font-family: "Almarai";
  src: local("Almarai"),
    url(assets/font/Almarai-Regular.ttf) format("truetype");
  font-display: swap
}
</style>
