<script setup lang="ts">
import { defineProps, reactive } from 'vue'

import { useUsersStore } from '@/stores/UsersStore'
import { usePostsStore } from '@/stores/PostsStore'

const usersStore = useUsersStore()
const postsStore = usePostsStore()
const posts = reactive(postsStore.posts)
const users = reactive(usersStore.users)

const props = defineProps({
  threads: {
    type: Array,
    required: true
  }
})

function postById(postId) {
  return posts.find((p) => p.id === postId)
}
function userById(userId) {
  return users.find((p) => p.id === userId)
}
</script>

<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <div v-for="thread in threads" :key="thread.id" class="thread">
        <div>
          <p>
            <router-link
              :to="{
                name: 'ThreadShow',
                params: { id: thread.id, slug: thread.slug }
              }"
              >{{ thread.title }}</router-link
            >
          </p>
          <p class="text-faded text-xsmall">
            By <a href="#">{{ userById(thread.userId).name }}</a
            >, <AppDate :timestamp="thread.publishedAt" />.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">{{ thread.posts.length }} replies</p>

          <img class="avatar-medium" :src="userById(thread.userId).avatar" alt="" />

          <div>
            <p class="text-xsmall">
              <a href="#">{{ userById(thread.userId).name }}</a>
            </p>
            <p class="text-xsmall text-faded">
              <AppDate :timestamp="thread.publishedAt" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
