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
                <side-box :result="result" :child_id="child_id" :start_age="start_age" :end_age="end_age" :dim_id="dim_id"
                    :dim_name="dim_name" v-if="response" />
            </div>
        </div>
        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-card-text style="padding: 25px 30px; font-size: 18px; color: #484848;">
                    لا يمكنك القيام باختبار الصورة الجانبية، لأن عمر الطفل اكبر من 6 سنوات </v-card-text>
                <!-- <v-divider></v-divider> -->
                <v-card-actions style="padding-bottom: 15px;">
                    <v-btn color="green darken-1" text @click="dialog = false">
                        موافق
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
// import Breadcrumbs from "@/components/Breadcrumbs.vue"

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import SideBox from "@/components/SideBox.vue"

export default {
    name: 'SideView',
    components: {
        SideBox
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
        dialog: false,
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
            this.dim_list.forEach(item => {
                if (this.dim_id == item.id)
                    this.dim_name = item.title
            })
            console.log(this.dim_name)
            this.axios.post(this.$store.state.url + "/api/first_box", {
                child_id: this.child_id,
                dim_id: this.dim_id,
                disability: this.disability
            },)
                .then((res) => {
                    if (res.data.massege != "the age is not valid") {
                        this.result = res.data
                        this.start_age = res.data.start_age
                        this.end_age = res.data.end_age
                        this.response = true
                    }
                    else
                    {
                        this.response = false
                        this.dialog = true
                        this.isSubmit = false
                    }
                    console.log(res.data.massege)
                })
                .catch((error) => {
                    console.log(error)
                });
        },
        getChild() {
            this.axios.get(this.$store.state.url + "/api/show_child",)
                .then(res => {
                    this.child_list = res.data.child
                    console.log(res.data.child)
                });
        },
        getDim() {
            this.axios.get(this.$store.state.url + "/api/show_dimantion",)
                .then(res => {
                    this.dim_list = res.data.dmantion
                    console.log(res.data.dmantion)
                });
        },
    },
    mounted() {
        this.getChild()
        this.getDim()
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
