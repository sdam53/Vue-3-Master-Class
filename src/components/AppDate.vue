<script setup lang="ts">
//time formatters
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedDate from 'dayjs/plugin/localizedFormat'
import { defineProps } from 'vue'
dayjs.extend(relativeTime)
dayjs.extend(localizedDate)

const props = defineProps(['timestamp'])

const diffForHumans = () => {
  return dayjs.unix(props.timestamp).fromNow()
}
const humanFriendlyDate = () => {
  return dayjs.unix(props.timestamp).format('llll')
}
</script>

<template>
  <span :title="humanFriendlyDate()">
    {{ diffForHumans() }}
  </span>
</template>
