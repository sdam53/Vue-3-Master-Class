//pinia store to contain user agent data

import { useWindowSize } from "@vueuse/core";
import { acceptHMRUpdate, defineStore } from "pinia";
import UAParser from "ua-parser-js";
import { computed, ref } from "vue";
const { width, height } = useWindowSize();

/**
 * user agent store
 */
export const useUAStore = defineStore("UAStore", () => {
    //ref
    const parser = ref(new UAParser());

    //computed props
    /**
     * possible device types
     * console, mobile, tablet, smarttv, wearable, embedded
     */
    const mobileDeviceTypes = ["console", "mobile", "tablet", "smarttv", "wearable", "embedded"];
    const isMobile = computed<boolean>(
        () =>
            mobileDeviceTypes.includes(parser.value.getDevice().type as string) || width.value < 960
    );
    const isDesktop = computed<boolean>(() => !isMobile.value);

    return { isMobile, isDesktop };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUAStore, import.meta.hot));
}
