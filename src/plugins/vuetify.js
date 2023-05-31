import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/lib/util/colors'
Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        defaultTheme: 'light',
        options: {
            customProperties: true,
        },
        themes: {
            light: {
                primary: '#0f2032',
                secondary: '#ee1d32',
                accent: '#0f2032',
            },
            
        },
    },
});
