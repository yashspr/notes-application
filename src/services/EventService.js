import axios from 'axios';

axios.defaults.withCredentials = true;

const apiClient = axios.create({
	baseURL: 'http://localhost:4000',
});

export default {
	isUserLoggedIn() {
		return apiClient.get('/auth/isuserloggedin');
	},
	signout() {
		return apiClient.get('/auth/logout');
	},
	fetchNotes() {
		return apiClient.get('/drive/metadata');
	},
	fetchDescription(fileID) {
		return apiClient.get(`/drive/view/${fileID}`);
	},
	uploadNote(note) {
		return apiClient.post('/drive/upload', note);
	},
	deleteNotes(fileIDs) {
		return apiClient.post('/drive/delete', fileIDs);
	},
	sendNewNotes(newNotes) {
		return apiClient.post('/drive/upload', newNotes);
	},
	sendUpdateNotes(updateNotes) {
		return apiClient.post('/drive/update', updateNotes);
	},
};
