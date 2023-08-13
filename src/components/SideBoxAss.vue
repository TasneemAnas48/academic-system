<template>
    <div class="side-box add" v-if="side_result == 'not end'">
        <p class="ques-title" style="margin-bottom: 40px;font-size:19px">
            {{ dim_name }} :
            من عمر {{ my_start_age }} شهر إلى عمر {{ my_end_age }} شهر</p>
        <div class="row" v-for="(ques, index) in getQuestion" :key="index">
            <div class="col-lg-3 ques-title">
                {{ ques.title }}
            </div>
            <div class="col-lg-9">
                <p style="font-size: 18px;">
                    <span class=" ques-title" style="margin-left: 15px">{{ ques.ques_number }}</span>
                    {{ ques.question }}
                </p>
                <v-radio-group v-model="ans[index].ques_mark" row>
                    <v-radio label="نعم" value="true"></v-radio>
                    <v-radio label="لا" value="false"></v-radio>
                </v-radio-group>
            </div>
        </div>
        <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light style="margin-top: 15px">
            التالي
            <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate color="white"></v-progress-circular>
        </v-btn>
        <v-snackbar right bottom color="red" text v-model="error_snackbar" timeout="3000">
            الرجاء الاجابة على جميع الاسئلة
            <template v-slot:action="{ attrs }">
                <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
                    اغلاق
                </v-btn>
            </template>
        </v-snackbar>
    </div>
    <div class="side-box add" v-else-if="side_result != 'not end' && load">
        <h5>نتيجة الاختبار</h5>
        <v-simple-table style="margin: 30px 0px; padding: 0px;">
            <template v-slot:default>
                <tbody>
                    <tr>
                        <td>البعد </td>
                        <td>{{ dim_name }}</td>
                    </tr>
                    <tr>
                        <td>العمر الإضافي</td>
                        <td>{{ age.additional }}</td>
                    </tr>
                    <tr>
                        <td> العمر القاعدي </td>
                        <td>{{ age.basal }}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
        <v-simple-table style="margin: 30px 0px; padding: 0px;">
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
    <div class="progress-container" v-else>
        <v-progress-circular indeterminate color="primary" :size="50" style="margin-top: 100px"></v-progress-circular>
    </div>
</template>

<script>

import { validationMixin } from 'vuelidate'

export default {
    name: 'SideBox',
    props: ['result', 'child_id', 'start_age', 'end_age', 'dim_name', 'dim_id'],
    mixins: [validationMixin],
    data: () => ({
        question: [],
        box_id: null,
        ans: [],
        isSubmit: false,
        response: false,
        ques_length: null,
        error_snackbar: false,
        side_result: 'not end',
        age: null,
        my_start_age: '',
        my_end_age: '',
        portage: null,
        load: false,
    }),
    computed: {
        getQuestion() {
            return this.question
        }
    },
    methods: {
        submit() {
            console.log(this.ans)
            if (this.validation() == true) {
                this.isSubmit = true
                this.sendData()
            }
            else
                this.error_snackbar = true
        },
        validation() {
            const values = this.ans.map(item => item.ques_mark)
            if (values.includes(null))
                return false
            else
                return true
        },
        sendData() {
            this.axios.post(this.$store.state.url + "/api/continue_box", {
                child_id: this.child_id,
                box_id: this.box_id,
                ans: this.ans
            }, { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then((res) => {
                    this.response = true
                    console.log(res.data)
                    this.side_result = res.data.result
                    this.my_end_age = res.data.end_age
                    this.my_start_age = res.data.start_age
                    if (this.side_result == 'not end') {
                        this.question = res.data.question
                        this.box_id = this.question[0].box_id
                        this.initAnswer()
                    }
                    else {
                        this.age = res.data.age
                        this.get_portage_table()
                        this.store_in_ass()
                    }
                })
                .catch((error) => {
                    console.log(error)
                });
        },
        get_portage_table() {
            this.axios.post(this.$store.state.url + "/api/portage_table", {
                child_id: this.child_id,
                dim_id: this.dim_id,
            }, { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then((res) => {
                    this.load = true
                    console.log(res.data)
                    this.portage = res.data
                })
        },
        store_in_ass(){
            const my_child = JSON.parse(localStorage.getItem("my_child"))
            const my_dim = JSON.parse(localStorage.getItem("my_dim"))
            console.log(my_child)
            console.log(my_dim)

            console.log(my_child[0].father_name)
            console.log(my_child[0].name)

            console.log(this.age.basal)

            console.log(this.age.additional)

            console.log(my_dim[0].title)



            const formData = new FormData()
            formData.append('father_name', my_child[0].father_name)
            formData.append('child_name', my_child[0].name)
            formData.append('basal', this.age.basal)
            formData.append('additional', this.age.additional)
            formData.append('diminssion', my_dim[0].title)
            this.axios.post(this.$store.state.ass_url + "/api/connect/between/sys3", formData)
                .then(res => {
                    console.log(res.data)
                    // if (res.data.message == "false")
                    //     window.location.replace(this.$store.state.aca_url_front+"/first-register");
                    // if (res.data.message == "true")
                    //     window.location.replace(this.$store.state.aca_url_front+"/side-view-ass/"+ res.data.data.id);
                }).catch(error => {
                    this.error_snackbar = true
                })
        },
        initAnswer() {
            this.isSubmit = false
            this.response = false
            this.ans = []
            this.question.forEach(item => {
                this.ans.push({
                    ques_id: item.id,
                    ques_mark: null
                })
            })
        },
        dim() {

        }
    },
    mounted() {
        this.question = this.result.question
        this.my_start_age = this.start_age
        this.my_end_age = this.end_age
        this.box_id = this.question[0].box_id
        console.log(this.question)
        this.initAnswer()
    }
};
</script>

<style lang="scss">
.side-box .ques-title {
    color: var(--v-secondary-base)
}
</style>