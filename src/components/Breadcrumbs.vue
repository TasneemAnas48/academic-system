<template>
    <div class="breadcrumbs">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    </div>
</template>

<script>

export default {
    name: 'Breadcrumbs',
    props:["breadcrumbs"],
    data: () => ({
        // breadcrumbs: [
        //     {
        //         text: 'Dashboard',
        //         disabled: false,
        //         href: 'breadcrumbs_dashboard',
        //     },
        //     {
        //         text: 'Link 1',
        //         disabled: false,
        //         href: 'breadcrumbs_link_1',
        //     },
        //     {
        //         text: 'Link 2',
        //         disabled: true,
        //         href: 'breadcrumbs_link_2',
        //     },
        // ],
    }),

    methods: {

    },
    mounted() {

    }
};
</script>

<style lang="scss">
.v-breadcrumbs {
    background-color: white;
    margin: 40px 50px;
    border-radius: 18px;
    box-shadow: 0 0 10px #d0cbcb4d;
    text-align: justify;
    padding: 22px 24px;
}
</style>