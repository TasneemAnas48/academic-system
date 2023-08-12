<template>
    <div id="add-child" class="add-child add">
        <div class="card">
            <div class="card-header">
                إضافة طفل
                <router-link to="/child/list">
                    <v-btn color="primary" outlined>
                        عرض الاطفال
                    </v-btn>
                </router-link>
            </div>
            <div class="card-body">
                <v-form>
                    <v-text-field outlined :reverse="true" v-model="name" :error-messages="nameErrors"
                        label="اسم الطفل "></v-text-field>
                    <!-- <v-text-field outlined :reverse="true" v-model="age" :error-messages="ageErrors"
                        label=" تاريخ الميلاد "></v-text-field> -->
                    <div class="my-date">
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="age" persistent width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field  outlined v-model="age" :reverse="true" label=" تاريخ الميلاد "
                                    append-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" :error-messages="ageErrors"></v-text-field>
                            </template>
                            <v-date-picker v-model="age" scrollable :allowed-dates="allowedDates">
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal = false">
                                    إلغاء
                                </v-btn>
                                <v-btn text color="primary" @click="$refs.dialog.save(age)">
                                    موافق
                                </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </div>
                    <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light style="margin-top: 15px">
                        إضافة
                        <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate
                            color="white"></v-progress-circular>
                    </v-btn>
                </v-form>
                <v-snackbar left bottom color="red" text v-model="snackbar" timeout="3000">
                    حدث خطأ غير متوقع، الرجاء اعادة المحاولة
                    <template v-slot:action="{ attrs }">
                        <v-btn color="red " text v-bind="attrs" @click="snackbar = false">
                            اغلاق
                        </v-btn>
                    </template>
                </v-snackbar>
            </div>
        </div>
    </div>
</template>

<script>

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'SideView',

    mixins: [validationMixin],
    data: () => ({
        name: null,
        age: null,
        response: false,
        isSubmit: false,
        user_id: null,
        snackbar: false,
        modal: false,
        send_age: null
    }),
    validations: {
        name: { required },
        age: { required },
    },
    computed: {
        nameErrors() {
            const errors = []
            if (!this.$v.name.$dirty) return errors
            !this.$v.name.required && errors.push('هذا الحقل مطلوب')
            return errors
        },
        ageErrors() {
            const errors = []
            if (!this.$v.age.$dirty) return errors
            !this.$v.age.required && errors.push('هذا الحقل مطلوب')
            return errors
        },
    },
    methods: {
        allowedDates: val => val < new Date().toJSON().slice(0,10),

        submit() {
            this.$v.$touch()
            if (!this.$v.$error) {
                this.isSubmit = true
                this.send()
            }
        },
        send() {
            let dateStr = this.age;
            let parts = dateStr.split('-');
            this.send_age = parts.reverse().join('/');
            console.log(this.$store.state.user_id)
            console.log(this.name)
            console.log(this.send_age)

            this.axios.post(this.$store.state.url + "/api/stor_child", {
                name: this.name,
                age: this.send_age,
                user_id: this.$store.state.user_id
            }, { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then((res) => {
                    this.response = true
                    console.log(res.data)
                    if (res.data.message == "Store child successfully")
                        this.$router.replace({ name: "list-child" })
                    else {
                        this.response = false
                        this.isSubmit = false
                        this.snackbar = true
                        this.$v.$reset()
                        this.name = ''
                        this.age = ''
                    }
                })
                .catch((error) => {
                    console.log(error)
                    this.snackbar = true
                });
        },

    },
    mounted() {
        // this.user_id = localStorage.getItem("id")
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

.add .card-header {
    display: flex;
    justify-content: space-between;
}

.my-date .v-label--active {
    right: -30px !important
}
</style>
