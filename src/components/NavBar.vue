<template>
	<div id="nav">
		<NavItem routeName="home" displayName="Simple Note" />
		<a v-if="!successfulsignin" @click="signin">signin</a>
		<a @click="signout">signout</a>
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
			window.open(
				'http://localhost:4000/auth/login',
				'login',
				'width=452,height=633,menubar=no,toolbar=no,location=no'
			);
			window.addEventListener('message', function(event) {
				if (event.origin != 'http://localhost:4000') {
					return;
				}
				console.log(event.data);
				if (event.data == 'success') this.successfulsignin = true;
			});
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
