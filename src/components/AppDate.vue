<script setup lang="ts">
//time formatters

import { diffForHumans, humanFriendlyDate } from "@/middleware/HelperFunctions";
import { computed } from "vue";

//props
const props = defineProps(["timestamp"]);

const normalizedTimestamp = computed(() => props.timestamp?.seconds || props.timestamp);

const n1 = computed(() => humanFriendlyDate(normalizedTimestamp.value));
const d1 = computed(() => diffForHumans(normalizedTimestamp.value));
</script>

<template>
    <span :title="n1">
        {{ d1 }}
    </span>
</template>
