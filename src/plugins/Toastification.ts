//Toast plugin
//ideally in this kinda of app i wouldnt actually want to use toasts or any
//notification system for messages in global type chats

//https://github.com/Maronato/vue-toastification/tree/next
import Toast, { POSITION } from "vue-toastification";
import type { PluginOptions } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const ToastOptions: PluginOptions = {
    // You can set your default options here
    timeout: 1000,
    position: POSITION.BOTTOM_RIGHT //top center for mobile and bottom right for desktop
};

export { Toast, ToastOptions };
