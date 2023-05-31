<template>
    <div class="list-box add" v-if="list_result == 'false'">
        <div class="row">
            <div class="col-lg-12">
                <p style="font-size: 18px;">{{ getQuestion.question }}</p>
                <v-radio-group v-model="answer" row  :error-messages="errors">
                    <v-radio label="نعم" value="true"></v-radio>
                    <v-radio label="لا" value="false"></v-radio>
                </v-radio-group>
            </div>
        </div>
        <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light style="margin-top: 15px">
            التالي
            <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate color="white"></v-progress-circular>
        </v-btn>

    </div>
    <div class="list-box add" v-else style=" display: flex; justify-content: center;">
        <h4>  انتهى الاختبار </h4>
    </div>
</template>

<script>

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'ListBox',
    props: ['result', 'child_id'],
    mixins: [validationMixin],
    data: () => ({
        question: [],
        ques_id: null,
        answer: null,
        isSubmit: false,
        response: false,
        ques_length: null,
        error_snackbar: false,
        list_result: 'false',
    }),
    validations: {
        answer: { required },
    },
    computed: {
        getQuestion() {
            return this.question
        },
        errors(){
            const errors = []
            if (!this.$v.answer.$dirty) return errors
            !this.$v.answer.required && errors.push('هذا الحقل مطلوب')
            return errors
        }
    },
    methods: {
        submit() {
            this.$v.$touch()
            if (!this.$v.$error) {
                this.isSubmit = true
                this.sendData()
            }
        },
        sendData() {
            this.axios.post(this.$store.state.url + "/api/store_list", {
                child_id: this.child_id,
                ques_id: this.ques_id,
                answer: this.answer
            }, { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then((res) => {
                    this.response = true
                    console.log(res.data)
                    this.list_result = res.data.end
                    if (this.list_result == 'false') {
                        this.question = res.data.question
                        this.ques_id = this.question.ques_number
                        this.isSubmit = false
                        this.response = false
                        this.answer = null
                        this.$v.$reset()
                    }
                })
                .catch((error) => {
                    console.log(error)
                });
        },

    },
    mounted() {
        this.question = this.result.question
        this.ques_id = this.question.ques_number
        console.log(this.question)
    }
};
</script>

<style lang="scss">
.list-box .ques-title {
    color: var(--v-secondary-base)
}
</style>