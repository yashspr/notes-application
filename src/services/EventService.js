import axios from 'axios';

const apiClient = axios.create({
	baseURL: 'http://localhost:4000'
});

export default {
	signin() {
		return apiClient.get('/auth/login');
	},
	signout() {
		return apiClient.get('/auth/logout');
	}
};
