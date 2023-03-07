<script setup lang="ts">
//time formatters

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedDate from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedDate);

//props
const props = defineProps(["timestamp"]);

/**
 * returns time relative to us
 */
const diffForHumans = () => {
    return dayjs.unix(props.timestamp).fromNow();
};

/**
 * returns a readable date and time
 */
const humanFriendlyDate = () => {
    return dayjs.unix(props.timestamp).format("llll");
};
</script>

<template>
    <span :title="humanFriendlyDate()">
        {{ diffForHumans() }}
    </span>
</template>
