<template>
	<div class="notification-bar" :class="notificationTypeClass">
		<p>{{ notification.message }}</p>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	props: {
		notification: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			timeout: null,
		};
	},
	mounted() {
		this.timeout = setTimeout(() => this.remove(this.notification), 1000);
	},
	beforeDestroy() {
		clearTimeout(this.timeout);
	},
	computed: {
		notificationTypeClass() {
			return `notification-container--text-${this.notification.type}`;
		},
	},
	methods: mapActions('notification', ['remove']),
};
</script>

<style scoped lang="scss">
.notification-bar {
	margin: 1em 0 1em;
	padding: 3rem;
	border-radius: 1rem;
	font-size: 2rem;
}
.notification-container {
	&--text-success {
		background-color: #39b982;
	}
	&--text-error {
		background-color: #b94139;
	}
}
</style>
