<template>
	<div id="nav">
		<NavItem routeName="home" displayName="Simple Note" />
		<NavItem routeName="signin" displayName="sign-in" />
		<NavItem routeName="signout" displayName="sign-out" />
		<NavItem routeName="about" displayName="about" />
	</div>
</template>

<script>
import NavItem from '@/components/NavItem.vue';
export default {
	components: {
		NavItem
	}
};
</script>
