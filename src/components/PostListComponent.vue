<script setup lang="ts">
//component to display a list of posts in a thread

import { findById } from "@/middleware/HelperFunctions";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { usePostsStore } from "@/stores/PostsStore";
import { useUsersStore } from "@/stores/UsersStore";
import type Post from "@/types/Post";
import type User from "@/types/User";
import { ref, type PropType } from "vue";
import AppAvatar from "./AppAvatar.vue";
import PostEditor from "./PostEditorComponent.vue";
import PostText from "./PostTextComponent.vue";

//props
const props = defineProps({
    posts: {
        type: Array as PropType<Post[]>,
        required: true
    }
});

//store
const userStore = useUsersStore();
const postStore = usePostsStore();
const currentUserStore = useCurrentUserStore();

//refs
const editing = ref<string | null>(null); //id of post to be edited

/**
 * returns users based on their id
 * @param userId
 */
const userById = (userId: string) => {
    return findById(userStore.users, userId);
};

/**
 * toggle the editing option
 * @param id post id
 */
const toggleEditMode = (id: string) => {
    editing.value = id === editing.value ? null : id;
};

/**
 * updates a post using event data
 * @param eventData event data
 */
const updatePost = (eventData: any) => {
    //postStore.updatePost(eventData.id, eventData.text)
    postStore.updatePost(eventData as Post);
    editing.value = null;
};
</script>

<template>
    <div class="post-list">
        <div class="post" v-for="post in props.posts" :key="post.id">
            <div v-if="userById(post.userId)" class="user-info">
                <router-link
                    :to="{ name: 'ProfileUsers', params: { id: userById(post.userId)?.id } }"
                >
                    <p class="user-name">{{ (userById(post.userId) as User)!.name }}</p>
                    <AppAvatar
                        class="avatar-large"
                        :src="(userById(post.userId) as User)!.avatar as string"
                        alt="User Profile Image"
                        :title="(userById(post.userId) as User).name + '\'s avatar'"
                    />
                </router-link>
                <!--<p class="desktop-only text-small">{{ getUser(post.userId).threadsCount }} threads</p><p class="desktop-only text-small">{{ getUser(post.userId).postsCount }} posts</p>-->
            </div>
            <div class="post-content">
                <div class="col-full">
                    <PostEditor v-if="editing === post.id" @savePost="updatePost" :post="post"
                        >Edit Mode</PostEditor
                    >
                    <p v-else>
                        <PostText :text="post.text"> </PostText>
                    </p>
                </div>
                <a
                    v-if="currentUserStore.isSignedIn && post.userId === currentUserStore.authId"
                    @click.prevent="toggleEditMode(post.id)"
                    href="#"
                    style="margin-left: auto; padding-left: 10px"
                    class="link-unstyled"
                    title="Make a change"
                >
                    <fa icon="pencil-alt" />
                </a>
            </div>
            <div class="post-date text-faded">
                <AppDate :timestamp="post.publishedAt" />
            </div>
        </div>
    </div>
</template>
