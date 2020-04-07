import Vue from 'vue';
import Vuex from 'vuex';
import * as notesModule from '@/store/modules/notes.js';
import * as notification from '@/store/modules/notification.js';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		notesModule,
		notification,
	},
});
