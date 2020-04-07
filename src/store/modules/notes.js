import EventService from "@/services/EventService";

export const state = {
	notes: [],
	updateNotes: [],
	newNotes: [],
	deleteNotes: [],
};
export const mutations = {
	GET_NOTES(state, notes) {
		// converting object of objects into an array of Objects with the object key as fileID
		for (const fileID in notes) {
			notes[fileID].fileID = fileID;
			state.notes.push(notes[fileID]);
		}
	},
	WELCOME_NOTE(state, note) {
		for (const fileID in note) {
			note[fileID].fileID = fileID;
			state.notes.push(note[fileID]);
		}
	},
	ADD_TO_NEW_NOTES(state, note) {
		state.newNotes.push(note);
		state.notes.push(note);
	},
	ADD_DESCRIPTION(state, { fileID, description }) {
		state.notes.forEach((note) => {
			if (note.fileID === fileID) note.description = description;
		});
	},
	ADD_TO_UPDATE_NOTES(state, note) {
		state.updateNotes.push(note);
		state.notes = state.notes.filter(
			(tempnote) => tempnote.fileID !== note.fileID
		);
		state.notes.push(note);
	},
	DELETE_NOTES(state, fileID) {
		state.notes = state.notes.filter((note) => note.fileID !== fileID);
		state.updateNotes = state.updateNotes.filter(
			(updateNote) => updateNote.fileID !== fileID
		);
		if (!fileID.startsWith("temp")) state.deleteNotes.push(fileID);
	},
	CHANGE_FILE_IDS(state, newFileIDs) {
		state.notes.forEach((note) => {
			if (!note.fileID.startsWith("temp")) return;
			newFileIDs.forEach((IDobj) => {
				if (note.fileID === IDobj.oldID) note.fileID = IDobj.newID;
			});
		});
	},
	CLEAR_NOTES(state, of) {
		if (of === "deleteNotes") state.deleteNotes = [];
		else if (of === "updateNotes") state.updateNotes = [];
		else if (of === "newNotes") state.newNotes = [];
	},
	ORGANIZE_NOTES(state) {
		state.newNotes = state.updateNotes.filter((updateNote) =>
			updateNote.fileID.startsWith("temp")
		);
		state.updateNotes = state.updateNotes.filter(
			(updateNote) => !updateNote.fileID.startsWith("temp")
		);
	},
	REMOVE_SUCCESSFULL_NOTES(state, { from, fileIDs }) {
		if (from === "newNotes") {
			state.newNotes = state.updateNotes.filter(
				(updateNote) => updateNote.fileID in fileIDs
			);
		}
	},
};
export const actions = {
	fetchNotes({ commit, dispatch }) {
		EventService.fetchNotes()
			.then((response) => {
				response.data.status === "failed"
					? alert("cant access the data")
					: commit("GET_NOTES", response.data.files);
			})
			.catch((err) => {
				const notification = {
					type: "error",
					message: `unable to fetch notes ${err.message}`,
				};
				dispatch("notification/add", notification, { root: true });
			});
	},
	showDefaultNotes({ commit }) {
		const currentTime = Date.now();
		let welcomeNote = {
			tempwelcome: {
				title: "Welcome to the SimpleNote app",
				description: "you can write your notes here",
				createdDate: currentTime,
				lastModified: currentTime,
			},
		};
		commit("WELCOME_NOTE", welcomeNote);
	},
	addToUpdateNotes({ state, commit }, note) {
		state.newNotes = state.newNotes.filter(
			(newNote) => newNote.fileID !== note.fileID
		);
		state.updateNotes = state.updateNotes.filter(
			(updateNote) => updateNote.fileID !== note.fileID
		);
		if (note.createdDate === null) note.createdDate = Date.now();
		commit("ADD_TO_UPDATE_NOTES", note);
	},
	addToNewNotes({ commit }, note) {
		if (note.createdDate === null) note.createdDate = Date.now();
		commit("ADD_TO_NEW_NOTES", note);
	},
	deleteNote({ commit }, fileID) {
		commit("DELETE_NOTES", fileID);
	},
	fetchDescription({ commit, dispatch }, fileID) {
		EventService.fetchDescription(fileID)
			.then((response) => {
				if (response.data === "error") {
					const notification = {
						type: "error",
						message: "unable to fetch description:",
					};
					dispatch("notification/add", notification, { root: true });
				} else {
					commit("ADD_DESCRIPTION", { fileID, description: response.data });
				}
			})
			.catch((err) => {
				const notification = {
					type: "error",
					message: `unable to fetch description: ${err.message}`,
				};
				dispatch("notification/add", notification, { root: true });
			});
	},
	syncNotes({ commit, state, dispatch }) {
		if (
			state.updateNotes.length === 0 &&
			state.deleteNotes.length === 0 &&
			state.newNotes.length === 0
		) {
			const notification = {
				type: "success",
				message: "Nothing to sync",
			};
			dispatch("notification/add", notification, { root: true });
		} else {
			if (state.deleteNotes.length > 0) {
				EventService.deleteNotes(state.deleteNotes)
					.then((response) => {
						if (response.data.erroredFileIds.length === 0) {
							commit("CLEAR_NOTES", "deleteNotes");
							const notification = {
								type: "success",
								message: "successfully deleted notes",
							};
							dispatch("notification/add", notification, { root: true });
						} else {
							const notification = {
								type: "error",
								message: "unable to delete notes",
							};
							dispatch("notification/add", notification, { root: true });
						}
					})
					.catch((err) => {
						const notification = {
							type: "error",
							message: "unable to delete notes",
						};
						dispatch("notification/add", notification, { root: true });
					});
			}
			commit("ORGANIZE_NOTES");
			if (state.newNotes.length > 0) {
				EventService.sendNewNotes(state.newNotes)
					.then((response) => {
						console.log(response);
						if (response.data.newFileIDs.length !== 0) {
							commit("CHANGE_FILE_IDS", response.data.newFileIDs);
							commit("CLEAR_NOTES", "newNotes");
						}
						if (response.data.erroredFileIds.length === 0) {
							const notification = {
								type: "success",
								message: "successfully added new notes",
							};
							dispatch("notification/add", notification, { root: true });
							commit("CLEAR_NOTES", "deleteNotes");
						} else
							commit("REMOVE_SUCCESSFULL_NOTES", {
								from: "newNotes",
								fileIDs: response.data.erroredFileIds,
							});
					})
					.catch((err) => {
						console.log(err);

						const notification = {
							type: "error",
							message: "unable to add new notes",
						};
						dispatch("notification/add", notification, { root: true });
					});
			}
			if (state.updateNotes.length > 0) {
				EventService.sendUpdateNotes(state.updateNotes)
					.then((response) => {
						if (response.data.erroredFileIds.length === 0) {
							commit("CLEAR_NOTES", "updateNotes");
							const notification = {
								type: "success",
								message: "successfully updated notes",
							};
							dispatch("notification/add", notification, { root: true });
						} else {
							commit(
								"REMOVE_SUCCESSFULL_NOTES",
								"newNotes",
								response.data.erroredFileIds
							);
							const notification = {
								type: "error",
								message: "unable to add update notes",
							};
							dispatch("notification/add", notification, { root: true });
						}
					})
					.catch((err) => {
						const notification = {
							type: "error",
							message: "unable to add update notes",
						};
						dispatch("notification/add", notification, { root: true });
					});
			}
		}
	},
};
