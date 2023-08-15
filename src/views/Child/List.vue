<template>
    <div id="list-child" class="list-child list">
        <div class="card">
            <div class="card-header">
                عرض الأطفال
                <router-link to="/child/add">
                    <v-btn color="primary" outlined>
                        إضافة طفل
                    </v-btn>
                </router-link>
            </div>
            <div class="card-body">
                <div v-if="load">
                    <v-card-title>
                        <v-text-field :reverse="true" v-model="search" append-icon="mdi-magnify" label="ابحث" single-line
                            hide-details></v-text-field>
                        <v-spacer></v-spacer><v-spacer></v-spacer><v-spacer></v-spacer>
                    </v-card-title>
                    <v-data-table :headers="headers" :items="data" :search="search" class="my-table">
                    </v-data-table>
                </div>
                <div class="progress-container" v-else>
                    <v-progress-circular indeterminate color="primary" :size="50"
                        style="margin-top: 100px"></v-progress-circular>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'childList',
    components: {
        
    },
    data: () => ({
        headers: [
            { text: 'id', value: 'id', align: "center" },
            { text: 'الاسم', value: 'name', align: "center" },
            { text: 'اسم الاب', value: 'father_name', align: "center" },
            { text: 'العمر (بالاشهر)', value: 'age', align: "center" },
        ],
        search: '',
        data: [],
        load: false,
        
    }),
    methods: {
        getData() {
            this.axios.get(this.$store.state.url + "/api/show_child", { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then(res => {
                    console.log(res.data.child)
                    this.load = true
                    this.data = res.data.child
                    console.log(this.data)
                });
        },
        
    },
    mounted() {
        this.getData()
    }
};
</script>

<style lang="scss">
@import url(@/assets/Css/main.css);

.list .card-header {
    display: flex;
    justify-content: space-between;
}
</style>
