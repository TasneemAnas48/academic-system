<template>
    <div id="delisting-listt" class="delisting-list add">
        <div class="card">
            <div class="card-header">
                اختبار قائمة الشطب
            </div>
            <div class="card-body">
                <v-form v-if="!response">
                    <v-select outlined v-model="child_id" :reverse="true" :items="child_list" item-text="name"
                        item-value="id" label="اسم الطفل" :error-messages="childErrors"></v-select>
                    <v-select outlined v-model="dim_id" :reverse="true" :items="dim_list" label="البعد "
                        :error-messages="dimErrors" :disabled="dim_disabled"></v-select>
                    <v-select outlined v-model="sub_id" :reverse="true" :items="subFiltered" item-text="title"
                        item-value="id" label="عنوان فرعي " :error-messages="subErrors" :disabled="sub_disabled"></v-select>
                    <v-btn @click="submit" :disabled="isSubmit && !response" color="primary" light style="margin-top: 15px">
                        بدء الاختبار
                        <v-progress-circular :size="20" v-if="isSubmit && !response" indeterminate
                            color="white"></v-progress-circular>
                    </v-btn>
                </v-form>
                <list-box :result="result" :child_id="child_id" :subTitle_id="sub_id" :sub_name="sub_name"
                    :dim_name="dim_name" v-if="response" />
            </div>
        </div>
        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-card-text style="padding: 25px 30px; font-size: 18px; color: #484848;">
                    لا يمكنك القيام باختيار قائمة الشطب، الرجاء القيام باختبار الصورة الجانبية اولا </v-card-text>
                <!-- <v-divider></v-divider> -->
                <v-card-actions style="padding-bottom: 15px;">
                    <v-btn color="green darken-1" text @click="ok()">
                        موافق
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import ListBox from "@/components/ListBox.vue"

export default {
    name: 'SideView',
    components: {
        ListBox
    },
    mixins: [validationMixin],
    data: () => ({
        child_list: [],
        dim_list: [],
        sub_list: [],
        child_id: null,
        dim_id: null,
        sub_id: null,
        disability: null,
        response: false,
        isSubmit: false,
        result: null,
        dialog: false,
        // box_id: [],
        dim_name: null,
        sub_name: null,
        get_dim: false,
        dim_list_final: []
    }),
    validations: {
        child_id: { required },
        dim_id: { required },
        sub_id: { required },
    },
    watch: {
        child_id() {
            this.axios.get(this.$store.state.url + "/api/available_dim/" + this.child_id, { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then(res => {
                    this.get_dim = true
                    console.log(res.data.dim)
                    this.dim_list = res.data.dim
                });
        },
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
        subErrors() {
            const errors = []
            if (!this.$v.sub_id.$dirty) return errors
            !this.$v.sub_id.required && errors.push('هذا الحقل مطلوب')
            return errors
        },
        dim_disabled() {
            if (this.get_dim)
                return false
            else
                return true
        },
        subFiltered() {
            return this.sub_list.filter(item => item.dim_id == this.dim_id)
        },
        sub_disabled() {
            if (this.dim_id != null)
                return false
            else
                return true
        },
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
            this.dim_list.forEach(item => {
                if (this.dim_id == item.id)
                    this.dim_name = item.title
            })
            console.log(this.dim_name)
            this.sub_list.forEach(item => {
                if (this.sub_id == item.id)
                    this.sub_name = item.title
            })
            console.log(this.sub_name)
            console.log("child_id: " + this.child_id)
            console.log("dim_id: " + this.dim_id)
            console.log("subTitle_id: " + this.sub_id)
            this.axios.post(this.$store.state.url + "/api/first_box_list", {
                child_id: this.child_id,
                dim_id: this.dim_id,
                subTitle_id: this.sub_id
            }, { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then((res) => {
                    // this.result = res.data
                    // this.response = true
                    console.log(res.data)
                    if (res.data.result == "false")
                        this.dialog = true
                    else {
                        this.result = res.data
                        this.response = true
                    }
                })
                .catch((error) => {
                    console.log(error)
                });
        },
        getChild() {
            this.axios.get(this.$store.state.url + "/api/show_child", { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then(res => {
                    this.child_list = res.data.child
                    // console.log(res.data.child)
                });
        },
        getSub() {
            this.axios.get(this.$store.state.url + "/api/sub_title", { headers: { 'Authorization': `Bearer ${this.$store.state.token}` } })
                .then(res => {
                    this.sub_list = res.data.title
                    // console.log(this.sub_list)
                });
        },
        ok() {
            this.$router.replace({ name: 'side-view' })
        }
    },
    mounted() {
        this.getChild()
        this.getSub()
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
