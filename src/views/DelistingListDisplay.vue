
<template>
    <div id="list-child" class="list-child list">
        <div class="card">
            <div class="card-header">
                قائمة الشطب
                <router-link to="/delisting-list">
                    <v-btn color="primary" outlined>
                        اجراء الاختبار
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
                        <template v-slot:[`item.date`]="{ item }">
                            {{ item.date.substring(0, 10) }}
                        </template>
                        <template v-slot:[`item.plan`]="{ item }">
                            <div class="row justify-content-center">
                                <div @click="get_plan(item)">
                                    <i class="fa fa-eye"></i>
                                </div>
                            </div>
                        </template>
                    </v-data-table>
                    <v-dialog v-model="dialog" max-width="700px" persistent>
                        <v-card v-if="load_plan">
                            <v-spacer></v-spacer>
                            <v-card-title class="justify-content-start"
                                style="border-bottom: 1px solid #aeaeae;padding-top: 30px;font-weight: bold;margin-bottom: 40px;">
                                نتيجة الاختبار
                            </v-card-title>
                            <div>
                                <v-simple-table style="margin: 10px 30px 30px; padding: 0px;">
                                    <template v-slot:default>
                                        <tbody>
                                            <tr v-for="(item, index) in plan" :key="index">
                                                <td>{{ index + 1 }} </td>
                                                <td>{{ item.qus }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </div>
                            <v-card-actions style="justify-content: end; padding-bottom: 30px;margin-left: 20px;">
                                <v-btn color="primary" @click="close_plan()">اغلاق
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                        <v-card class="progress-container" v-else style="display: flex;">
                            <v-progress-circular indeterminate color="primary" :size="50"
                                style="margin-top: 100px;margin-bottom: 100px"></v-progress-circular>
                        </v-card>
                    </v-dialog>
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
            { text: 'اسم الطفل', value: 'child_nam', align: "center" },
            { text: 'تاريخ الاختبار', value: 'date', align: "center" },
            { text: 'البعد', value: 'dim', align: "center" },
            { text: 'البعد الفرعي', value: 'sub_title', align: "center" },
            { text: 'نتيجة الاختبار', value: 'plan', align: "center" },
        ],
        search: '',
        data: [],
        load: false,
        load_plan: false,
        dialog: false,
        plan: []
    }),
    methods: {
        getData() {
            this.axios.get(this.$store.state.url + "/api/list_result_all", { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then(res => {
                    console.log(res.data.result)
                    this.load = true
                    this.data = res.data.result
                    console.log(this.data)

                });
        },
        changeFormat(date) {
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        },
        get_plan(item) {
            this.dialog = true
            this.axios.post(this.$store.state.url + "/api/plan", {
                child_id: item.child_id,
                subTitle_id: item.sub_title_id,
            }, { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then((res) => {
                    this.load_plan = true
                    this.plan = res.data.result
                    console.log(res.data)
                })
                .catch((error) => {
                    console.log(error)
                });
        },
        close_plan() {
            this.dialog = false
            this.load_plan = false
            this.plan = []
        }

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
