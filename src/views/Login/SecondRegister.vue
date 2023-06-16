<template>
    <div class="login">
        <div class="container">
            <v-card class="login-card " style="align-items: center;">

                <h3 class="my-title">تسجيل حساب</h3>

                <v-form style="margin-top: 30px">
                    <div class="row">
                        <div class="col-lg-6">
                            <v-text-field outlined :reverse="true" v-model="name" :error-messages="nameErrors"
                                label="اسم المستخدم "></v-text-field>
                            <v-text-field type="password" outlined :reverse="true" v-model="password"
                                :error-messages="passwordErrors" label="كلمة المرور"></v-text-field>
                            <v-text-field outlined :reverse="true" v-model="code" :error-messages="codeErrors"
                                label="رمز التحقق  "></v-text-field>
                        </div>
                        <div class="col-lg-6">
                            <v-text-field type="email" outlined :reverse="true" v-model="email"
                                :error-messages="emailErrors" label="البريد الالكتروني"></v-text-field>

                            <v-text-field type="password" outlined :reverse="true" v-model="confrim_password"
                                :error-messages="confrimErrors" label="تأكيد كلمة المرور"></v-text-field>
                        </div>
                    </div>
                    <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light style="margin-top: 15px">
                        إرسال
                        <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate
                            style="margin-right: 10px" color="white"></v-progress-circular>
                    </v-btn>

                    <v-snackbar left bottom color="red" text v-model="snackbar" timeout="3000">
                        حدث خطأ غير متوقع، الرجاء اعادة المحاولة
                        <template v-slot:action="{ attrs }">
                            <v-btn color="red " text v-bind="attrs" @click="snackbar = false">
                                اغلاق
                            </v-btn>
                        </template>
                    </v-snackbar>
                </v-form>

            </v-card>
            <v-dialog v-model="dialog" max-width="500">
                <v-card>
                    <v-card-title style="font-weight: bold;">
                        تسجيل حساب
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="padding: 25px 30px; font-size: 18px; color: #484848;text-align: center;">
                        لقد تم إنشاء الحساب بنجاح
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
    </div>
</template>


<script>

import { validationMixin } from 'vuelidate'
import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
    name: 'Login',
    components: {
    },
    mixins: [validationMixin],
    validations: {
        email: { required, email },
        name: { required },
        password: { required, minLength: minLength(8) },
        confrim_password: { required, sameAs: sameAs('password') },
        code: { required },
    },

    data: () => ({
        response: false,
        isSubmit: false,
        snackbar: false,
        email: null,
        name: null,
        password: null,
        confrim_password: null,
        code: null,
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
        },
        passwordErrors() {
            const errors = []
            if (!this.$v.password.$dirty) return errors
            !this.$v.password.required && errors.push('هذا الحقل مطلوب')
            !this.$v.password.minLength && errors.push('الرجاء ادخال 8 رموز على الأقل')
            return errors
        },
        confrimErrors() {
            const errors = []
            if (!this.$v.confrim_password.$dirty) return errors
            !this.$v.confrim_password.required && errors.push('هذا الحقل مطلوب')
            !this.$v.confrim_password.sameAs && errors.push('الرجاء ادخال كلمة مرور متطابقة')
            return errors
        },
        codeErrors() {
            const errors = []
            if (!this.$v.code.$dirty) return errors
            !this.$v.code.required && errors.push('هذا الحقل مطلوب')
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
            console.log(this.email)
            console.log(this.name)
            console.log(this.password)
            console.log(this.code)
            console.log(this.id)
            this.axios.post(this.$store.state.url + "/api/verification", {
                email: this.email,
                name: this.name,
                password: this.password,
                id: this.id,
                code: this.code
            }).then(res => {
                this.response = true
                this.dialog = true
                console.log(res.data)
                this.storeData(res.data)
            });
        },
        storeData(data) {
            this.$store.state.token = data.token
            this.$store.state.id = data.user.id
            this.$store.state.name = data.user.name
            this.$store.state.email = data.user.email

            localStorage.setItem("token", data.token)
            localStorage.setItem("id", data.user.id)
            localStorage.setItem("name", data.user.name)
            localStorage.setItem("email", data.user.email)
            localStorage.setItem("auth", true)
        },
        resume_register() {
            this.$router.replace({ name: 'dashboard' })
        }
    },
    mounted() {
        this.id = localStorage.getItem("c_id")
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
