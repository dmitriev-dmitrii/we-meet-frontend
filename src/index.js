import  "webrtc-adapter";
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory} from "vue-router";
import {routes} from "./router";
import './css/index.scss'

const app = createApp(App)
const router = createRouter({
    history: createWebHistory(),
    routes
})
app.use(router)
app.mount('#app')

// window.onbeforeunload = function( event) {
//
//     if (meetStore.meetId) {
//         event.preventDefault();
//         event.returnValue = true;
//         return  event.returnValue;
//     }
//
// };
//
// window.onunload = function( event) {
//     if (meetStore.meetId) {
//         meetStore.leaveMeet()
//     }
// };