import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import sourceData from "@/data.json";

export const useCurrentUserStore = defineStore("CurrentUserStore", () => {
    const authId = ref("Miej9zSGMRZKDvMXzfxjVOyv3RF3");
    const authUser = computed(() => sourceData.users.find((user) => user.id === authId.value));

    const name = computed(() => authUser.value?.name);
    const avatar = computed(() => authUser.value?.avatar);
    const username = computed(() => authUser.value?.username);
    const bio = computed(() => authUser.value?.bio);
    const website = computed(() => authUser.value?.website);

    const isSignedIn = computed(() => authUser.value != null);

    return { authId, authUser, isSignedIn, name, avatar, username, bio, website };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCurrentUserStore, import.meta.hot));
}
