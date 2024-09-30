<template>
    <div class="login">
        <div class="container">
            <v-card class="login-card row" style="align-items: center;">
                <div class="col-lg-6">
                    <h3 class="my-title">تسجيل الدخول</h3>
                    <v-form style="margin-top: 70px">

                        <v-text-field type="email" outlined :reverse="true" v-model="email" :error-messages="emailErrors"
                            label="البريد الالكتروني"></v-text-field>
                        <v-text-field type="password" outlined :reverse="true" v-model="password"
                            :error-messages="passwordErrors" label="كلمة المرور"></v-text-field>
                        <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light
                            style="margin-top: 15px">
                            إرسال
                            <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate
                                style="margin-right: 10px" color="white"></v-progress-circular>
                        </v-btn>
                        <div class="row" style="margin-top: 20px;margin-right: 0px">
                            <p>ليس لديك حساب</p> 
                            <a href="first-register" style="margin-right: 10px">إنشاء الان</a>
                        </div>

                        <v-snackbar left bottom color="red" text v-model="snackbar" timeout="3000">
                            المعلومات المدخلة غير صحيحة، الرجاء اعادة المحاولة
                            <template v-slot:action="{ attrs }">
                                <v-btn color="red " text v-bind="attrs" @click="snackbar = false">
                                    اغلاق
                                </v-btn>
                            </template>
                        </v-snackbar>
                    </v-form>
                </div>
                <div class="col-lg-6 img-container">
                    <img src="@/assets/img/login.svg" style="width: 80%; margin-right: 50px;" />
                </div>
            </v-card>
        </div>
    </div>
</template>


<script>

import { validationMixin } from 'vuelidate'
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
    name: 'Login',
    components: {
    },
    mixins: [validationMixin],
    validations: {
        email: { required, email },
        password: { required },
    },

    data: () => ({
        response: false,
        isSubmit: false,
        snackbar: false,
        email: null,
        password: null,
    }),

    computed: {
        emailErrors() {
            const errors = []
            if (!this.$v.email.$dirty) return errors
            !this.$v.email.required && errors.push('هذا الحقل مطلوب')
            !this.$v.email.email && errors.push('الرجاء ادخال بريد الكتروني صالح')
            return errors
        },
        passwordErrors() {
            const errors = []
            if (!this.$v.password.$dirty) return errors
            !this.$v.password.required && errors.push('هذا الحقل مطلوب')
            // !this.$v.password.minLength && errors.push('الرجاء ادخال 8 رموز على الأقل')
            return errors
        },

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
            console.log(this.password)
            this.axios.post(this.$store.state.url + "/api/login", {
                email: this.email,
                password: this.password,
            }).then(res => {
                console.log(res)
                this.response = true
                if (res.data.message == "successfully") {
                    this.storeData(res.data)
                }
                else {
                    this.snackbar = true
                    this.response = false
                    this.isSubmit = false
                    this.$v.$reset()
                    this.password = ''
                    this.email = ''
                }

            }).catch(error => {
                this.snackbar = true
            })
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
            this.$router.push({ name: 'list-child' })

        },
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
