<template>
	<div id="nav">
		<NavItem routeName="home" displayName="Simple Note" />
		<a v-if="!successfulsignin" @click="signin">signin</a>
		<a v-else @click="signout">signout</a>
		<NavItem routeName="about" displayName="about" />
	</div>
</template>

<script>
import NavItem from '@/components/NavItem.vue';
import EventService from '@/services/EventService.js';

export default {
	data() {
		return {
			successfulsignin: false
		};
	},
	components: {
		NavItem
	},
	methods: {
		signin() {
			EventService.signin()
				.then(response => {
					console.log(response);
					this.successfulsignin = true;
				})
				.catch(err => console.log(err));
		},
		signout() {
			EventService.signout()
				.then(response => {
					console.log(response);
					this.successfulsignin = false;
				})
				.catch(err => console.log(err));
		}
	}
};
</script>
