<script setup lang="ts">
//time formatters

import { diffForHumans, humanFriendlyDate } from "@/middleware/HelperFunctions";

//props
const props = defineProps(["timestamp"]);
</script>

<template>
    <span :title="humanFriendlyDate(props.timestamp)">
        {{ diffForHumans(props.timestamp) }}
    </span>
</template>
