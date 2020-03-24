<template>
	<router-link :to="{ name: routeName }">{{ displayName }}</router-link>
</template>

<script>
export default {
	props: ['routeName', 'displayName']
};
</script>
