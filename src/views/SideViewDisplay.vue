
<template>
    <div id="list-child" class="list-child list">
        <div class="card">
            <div class="card-header">
                الصورة الجانبية
                <router-link to="/side-view">
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
                        <template v-slot:[`item.basal_age`]="{ item }">
                            {{ item.basal_age }} سنة
                        </template>
                        <template v-slot:[`item.additional_age`]="{ item }">
                            {{ item.additional_age }} شهر
                        </template>
                        <template v-slot:[`item.portage`]="{ item }">
                            <div class="row justify-content-center">
                                <div @click="get_portage(item)">
                                    <i class="fa fa-eye"></i>
                                </div>
                            </div>
                        </template>
                    </v-data-table>
                    <v-dialog v-model="dialog" max-width="700px" persistent>
                        <v-card v-if="load_portage">
                            <v-spacer></v-spacer>
                            <v-card-title class="justify-content-start"
                                style="border-bottom: 1px solid #aeaeae;padding-top: 30px;font-weight: bold;margin-bottom: 40px;">
                                جدول البورتج
                            </v-card-title>
                            <div>
                                <v-simple-table
                                    style="margin: 10px 30px 30px; padding: 0px;">
                                    <template v-slot:default>
                                        <tbody>
                                            <tr>
                                                <td>مستوى الاداء </td>
                                                <td>{{ portage.performance }}</td>
                                            </tr>
                                            <tr>
                                                <td>نسبة الاداء</td>
                                                <td>{{ portage.performance_ratio }}</td>
                                            </tr>
                                            <tr>
                                                <td> العمر النمائي (السنوات) </td>
                                                <td>{{ portage.year }}</td>
                                            </tr>
                                            <tr>
                                                <td> العمر النمائي (الاشهر) </td>
                                                <td>{{ portage.month }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </div>
                            <v-card-actions style="justify-content: end; padding-bottom: 30px;margin-left: 20px;">
                                <v-btn color="primary" @click="close_portage()">اغلاق
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
    name: 'SideViewDisplay',
    components: {

    },
    data: () => ({
        headers: [
            { text: 'اسم الطفل', value: 'child_nam', align: "center" },
            { text: 'تاريخ الاختبار', value: 'date', align: "center" },
            { text: 'البعد', value: 'dim', align: "center" },
            { text: 'العمر القاعدي', value: 'basal_age', align: "center" },
            { text: 'العمر الاضافي', value: 'additional_age', align: "center" },
            { text: 'نتيجة الاختبار', value: 'portage', align: "center" },

        ],
        search: '',
        data: [],
        load: false,
        load_portage: false,
        dialog: false,
        portage: []
    }),
    methods: {
        getData() {
            this.axios.get(this.$store.state.url + "/api/Portage_result_all")
                .then(res => {
                    console.log(res)
                    this.load = true
                    this.data = res.data.result
                    // console.log(this.data)
                });
        },
        changeFormat(date) {
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        },
        get_portage(item){
            this.dialog = true
            this.axios.post(this.$store.state.url + "/api/portage_table", {
                child_id: item.child_id,
                dim_id: item.dim_id,
            })
                .then((res) => {
                    this.load_portage = true
                    console.log(res.data)
                    this.portage = res.data
                })
        },
        close_portage(){
            this.dialog = false
            this.load_portage = false
            this.portage = []
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
