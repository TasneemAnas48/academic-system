<template>
    <b-navbar>
        <b-collapse id="nav-collapse" is-nav>
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <!-- <b-icon icon="bell-fill"></b-icon> -->

                <b-nav-item-dropdown right>
                    <template #button-content>
                        <b-icon icon="bell-fill"></b-icon>
                        <!-- {{ display_lang }} -->
                    </template>
                    <b-dropdown-item>
                        <div class="title">
                            عنوان الاشعار
                        </div>
                        <div class="disc">
                            محتوى الاشعار الوارد من فلان
                        </div>
                    </b-dropdown-item>
                </b-nav-item-dropdown>

                <!-- <b-nav-item-dropdown right>
                    <template #button-content>
                        <b-icon icon="person-fill"></b-icon>
                    </template>
                    <b-dropdown-item @click="logout">تسجيل خروج</b-dropdown-item>
                </b-nav-item-dropdown> -->
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>

export default {
    name: 'Navbar',

    data: () => ({
    }),
    // computed: {
    //     isAr() {
    //         this.lang = localStorage.getItem("lang")
    //         console.log(this.lang)
    //         return this.lang
    //     },
    // },
    methods: {
        logout(){
            this.removeFromStore()
            this.removeFromlocalStorage()
            this.$router.replace({ name: 'welcome' })
        },
        removeFromStore(){
            this.$store.state.token = null
            this.$store.state.id = null
            this.$store.state.name = null
            this.$store.state.email = null
            this.$store.state.role = null
        },
        removeFromlocalStorage(){
            localStorage.setItem("token", '')
            localStorage.setItem("id", '')
            localStorage.setItem("name", '')
            localStorage.setItem("email", '')
            localStorage.setItem("role", '')
        }
    },
    mounted() {
    }
};
</script>

<style lang="scss">
.navbar {
    background-color: white;
    border-bottom: 1px solid #e6e6e6;
    box-shadow: 0 0 10px #e4e4e4;
    padding: 15px !important;
}

.navbar .bi-person-fill {
    font-size: 25px !important;
}


.navbar .bi-bell-fill {
    font-size: 25px !important;
}

.navbar-nav .nav-link {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 10px;
    font-size: 18px;
}

.navbar .nav-item {
    margin: 0px 10px;
}

.navbar-nav .nav-link {
    direction: rtl;
}

.navbar .dropdown-menu {
    padding: 10px 0px
}

.navbar .dropdown-toggle::after {
    display: none !important;
}

.navbar .nav-link {
    background-color: #e9e9e9;
    border-radius: 20px;
}

.navbar .dropdown-item {
    text-align: justify;
}

.navbar-light .navbar-nav .nav-link {
    color: var(--v-primary-base) !important;
}
.dropdown-item:active {
    color: #fff;
    text-decoration: none;
    background-color: var(--v-primary-base) !important;
}</style>