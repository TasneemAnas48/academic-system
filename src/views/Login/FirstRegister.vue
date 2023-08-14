<template>
    <div class="login">
        <div class="container">
            <v-card class="login-card row" style="align-items: center;">
                <div class="col-lg-6">
                    <h3 class="my-title">تسجيل حساب</h3>
                    <v-form style="margin-top: 70px">
                        <v-text-field outlined :reverse="true" v-model="name" :error-messages="nameErrors"
                            label="اسم المستخدم "></v-text-field>
                        <v-text-field type="email" outlined :reverse="true" v-model="email" :error-messages="emailErrors"
                            label="البريد الالكتروني"></v-text-field>
                        <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light
                            style="margin-top: 15px">
                            إرسال
                            <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate
                                style="margin-right: 10px" color="white"></v-progress-circular>
                        </v-btn>

                        <v-snackbar left bottom color="red" text v-model="snackbar" timeout="3000">
                            هذا الايميل مستخدم مسبقا، الرجاء اعادة المحاولة
                            <template v-slot:action="{ attrs }">
                                <v-btn color="red " text v-bind="attrs" @click="snackbar = false">
                                    اغلاق
                                </v-btn>
                            </template>
                        </v-snackbar>
                    </v-form>
                    <v-dialog v-model="dialog" max-width="500">
                        <v-card>
                            <v-card-title style="font-weight: bold;">
                                تسجيل حساب
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text style="padding: 25px 30px; font-size: 18px; color: #484848;">
                                لقد تم إرسال رمز التحقق إلى بريدك الالكتروني، الرجاء تفقد البريد لاستكمال عملية تسجيل الحساب
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions style="padding-bottom: 15px;">
                                <v-btn color="green darken-1" text @click="resume_register()">
                                    موافق
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>
                <div class="col-lg-6 img-container">
                    <img src="@/assets/img/reg1.svg" style="width: 80%; margin-right: 50px;" />
                </div>
            </v-card>
        </div>
    </div>
</template>


<script>

import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

export default {
    name: 'Login',
    components: {
    },
    mixins: [validationMixin],
    validations: {
        email: { required, email },
        name: { required },
    },

    data: () => ({
        response: false,
        isSubmit: false,
        snackbar: false,
        email: null,
        name: null,
        code: null,
        code_id: null,
        dialog: false,
    }),

    computed: {
        emailErrors() {
            const errors = []
            if (!this.$v.email.$dirty) return errors
            !this.$v.email.required && errors.push('هذا الحقل مطلوب')
            !this.$v.email.email && errors.push('الرجاء ادخال بريد الكتروني صالح')
            return errors
        },
        nameErrors() {
            const errors = []
            if (!this.$v.name.$dirty) return errors
            !this.$v.name.required && errors.push('هذا الحقل مطلوب')
            return errors
        }
    },
    methods: {
        submit() {
            this.$v.$touch()
            if (!this.$v.$error) {
                this.isSubmit = true
                this.getCode()
            }
        },
        getCode() {
            this.axios.get(this.$store.state.url + "/api/make_code")
                .then(res => {
                    console.log(res.data)
                    this.code = res.data.code
                    this.code_id = res.data.id
                    localStorage.setItem("c_id", this.code_id)
                    this.sendData()
                });
        },
        sendData() {
            console.log(this.email)
            console.log(this.name)
            console.log(this.code)
            this.axios.post(this.$store.state.url + "/api/send", {
                mail: this.email,
                name: this.name,
                code: this.code
            }).then(res => {
                this.response = true
                if (res.data.message == 'the email already exists'){
                    this.response = false
                    this.isSubmit = false
                    this.snackbar = true
                }
                else
                    this.dialog = true
            });
        },
        resume_register() {
            localStorage.setItem("register_name", this.name)
            localStorage.setItem("register_email", this.email)
            this.$router.replace({ name: 'second-register' })
        }
    },
    mounted() {

    }
};
</script>

<style lang="scss">
.login .my-title {
    color: var(--v-primary-base);
    font-weight: bold;
}

.login .login-card {
    border: none;
    border-radius: 20px;
    padding: 80px;
    margin: 60px 0px 50px;
    box-shadow: 0 0 10px #c5c5c5 !important;
}

.login .left {
    display: flex;
    justify-content: center;
    align-items: center;
}

.login .v-messages__message {
    text-align: justify;
}

@media (max-width: 992px) {
    .login .img-container {
        display: none
    }
}
</style>
