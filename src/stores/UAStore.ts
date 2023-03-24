//pinia store to contain all data
//every other store will retrieve from this store to initialize

import { defineStore, acceptHMRUpdate } from "pinia";

import { computed, ref } from "vue";
import UAParser from "ua-parser-js";
import { useWindowSize } from "@vueuse/core";
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
    return { parser, isMobile, isDesktop };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUAStore, import.meta.hot));
}
