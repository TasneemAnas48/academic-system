<template>
    <div id="side-viewt" class="side-view add">
        <div class="card">
            <div class="card-header">
                اختبار الصورة الجانبية
            </div>
            <div class="card-body">
                <v-form v-if="!response">
                    <v-select outlined v-model="child_id" :reverse="true" :items="child_list" item-text="name"
                        item-value="id" label="اسم الطفل" :error-messages="childErrors"></v-select>
                    <v-select outlined v-model="dim_id" :reverse="true" :items="dim_list" item-text="title" item-value="id"
                        label="البعد " :error-messages="dimErrors"></v-select>
                    <div class="row" style="margin-right: 5px">
                        <p style="font-size: 18px;">هل يوجد لدى الطفل إعاقة</p>
                        <v-radio-group v-model="disability" row :error-messages="disErrors">
                            <v-radio label="نعم" value="true"></v-radio>
                            <v-radio label="لا" value="false"></v-radio>
                        </v-radio-group>
                    </div>
                    <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light style="margin-top: 15px">
                        بدء الاختبار
                        <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate
                            color="white"></v-progress-circular>
                    </v-btn>
                </v-form>
                <side-box-ass :result="result" :child_id="child_id" :start_age="start_age" :end_age="end_age"
                    :dim_id="dim_id" :dim_name="dim_name" v-if="response" />
            </div>
        </div>
    </div>
</template>

<script>
// import Breadcrumbs from "@/components/Breadcrumbs.vue"

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import SideBoxAss from "@/components/SideBoxAss.vue"

export default {
    name: 'SideViewAss',
    components: {
        SideBoxAss
        // Breadcrumbs
    },
    mixins: [validationMixin],
    data: () => ({
        child_list: [],
        dim_list: [],
        child_id: null,
        dim_id: null,
        disability: null,
        response: false,
        isSubmit: false,
        result: null,
        start_age: null,
        end_age: null,
        dim_name: null,
        user_id: null
        // box_id: [],
    }),
    validations: {
        child_id: { required },
        dim_id: { required },
        disability: { required },
    },
    computed: {
        dimErrors() {
            const errors = []
            if (!this.$v.dim_id.$dirty) return errors
            !this.$v.dim_id.required && errors.push('هذا الحقل مطلوب')
            return errors
        },
        childErrors() {
            const errors = []
            if (!this.$v.child_id.$dirty) return errors
            !this.$v.child_id.required && errors.push('هذا الحقل مطلوب')
            return errors
        },
        disErrors() {
            const errors = []
            if (!this.$v.disability.$dirty) return errors
            !this.$v.disability.required && errors.push('هذا الحقل مطلوب')
            return errors
        }
    },
    methods: {
        submit() {
            this.$v.$touch()
            if (!this.$v.$error) {
                this.isSubmit = true
                this.send()
            }
        },
        send() {
            console.log(this.dim_id) // 2
            this.storeOnLocalStorage()
            this.dim_list.forEach(item => {
                if (this.dim_id == item.id)
                    this.dim_name = item.title
            })
            console.log(this.dim_name)
            this.axios.post(this.$store.state.url + "/api/first_box", {
                child_id: this.child_id,
                dim_id: this.dim_id,
                disability: this.disability
            }, { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then((res) => {
                    this.result = res.data
                    this.start_age = res.data.start_age
                    this.end_age = res.data.end_age
                    this.response = true
                    console.log(res.data)
                    // console.log(this.start_age)
                    // console.log(this.end_age)
                })
                .catch((error) => {
                    console.log(error)
                });
        },
        getChild() {
            this.axios.get(this.$store.state.url + "/api/show_child", { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then(res => {
                    this.child_list = res.data.child
                    console.log(res.data.child)
                    this.child_id = parseInt(this.$route.params.id)
                });
        },
        getDim() {
            this.axios.get(this.$store.state.url + "/api/show_dimantion", { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then(res => {
                    this.dim_list = res.data.dmantion
                    // console.log(res.data.dmantion)
                });
        },
        storeOnLocalStorage() {
            const my_child = this.child_list.filter(item => item.id == this.child_id)
            const my_dim = this.dim_list.filter(item => item.id == this.dim_id)

            console.log(my_child)
            console.log(my_dim)

            localStorage.setItem("my_child", JSON.stringify(my_child))
            localStorage.setItem("my_dim", JSON.stringify(my_dim))
        },
        login() {
            this.user_id = parseInt(this.$route.params.user_id)
            this.axios.post(this.$store.state.url + "/api/login_with_id", {
                id: this.user_id
            }).then(res => {
                this.$store.state.token = res.data.token
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("auth", true)
                console.log(res)
                this.getChild()
                this.getDim()
            })
        }
    },
    mounted() {
        this.login()
    }
};
</script>

<style lang="scss">
@import url(@/assets/Css/main.css);


.v-input--selection-controls {
    padding-top: 0px;
    margin-top: 0px;
}

.v-label {
    font-size: 18px;
}
</style>
