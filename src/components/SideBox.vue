<template>
    <div class="side-box add" v-if="side_result == 'not end'">
        <div class="row" v-for="(ques, index) in getQuestion" :key="index">
            <div class="col-lg-3 ques-title">
                {{ ques.title }}
            </div>
            <div class="col-lg-9">
                <p style="font-size: 18px;">{{ ques.question }}</p>
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
    <div class="side-box add" v-else>
        <h5>نتيجة الاختبار</h5>
        <v-simple-table style="margin: 30px 0px; padding: 0px;">
            <template v-slot:default>
                <tbody>
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
    </div>
</template>

<script>

import { validationMixin } from 'vuelidate'

export default {
    name: 'SideBox',
    props: ['result', 'child_id'],
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
        age: null
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
                    if (this.side_result == 'not end') {
                        this.question = res.data.question
                        this.box_id = this.question[0].box_id
                        this.initAnswer()
                    }
                    else {
                        this.age = res.data.age
                    }
                })
                .catch((error) => {
                    console.log(error)
                });
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
        }
    },
    mounted() {
        this.question = this.result.question
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