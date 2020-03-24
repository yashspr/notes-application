const { Readable } = require("stream");
const uid = require("uid");

function createMetaDataFile(drive) {
	return new Promise((resolve, reject) => {
		let filename = "metadata.json";

		var fileMetadata = {
			name: filename,
			parents: ["appDataFolder"]
		};

		var media = {
			mimeType: "application/json",
			body: Readable.from("{}")
		};

		drive.files.create(
			{
				resource: fileMetadata,
				media,
				fields: "id"
			},
			(err, file) => {
				if (err) {
					reject(err);
				} else {
					resolve(file.data.id);
				}
			}
		);
	});
}

function getMetaDataFileId(req) {
	return new Promise((resolve, reject) => {
		if (!req.session.metadataId || req.session.metadataId == "") {
			req.drive.files.list(
				{
					q: "name='metadata.json'",
					spaces: "appDataFolder",
					fields: "files(id, name)"
				},
				(err, resp) => {
					if (err) {
						reject("The API returned an error: " + err);
					}
					if (resp.data.files.length == 0) {
						createMetaDataFile(req.drive)
							.then(id => {
								console.log("Metadata file created");
								req.session.metadataId = id;
								resolve(id);
							})
							.catch(err => {
								console.log("Unable to create metadata file.");
								reject(err);
							});
					} else {
						req.session.metadataId = resp.data.files[0].id;
						resolve(req.session.metadataId);
					}
				}
			);
		} else {
			resolve(req.session.metadataId);
		}
	});
}

function getMetaDataFile(req) {
	new Promise((resolve, reject) => {
		getMetaDataFileId(req)
			.then(id => {
				req.drive.files
					.get({
						fileId: id,
						alt: "media",
						parents: ["appDataFolder"]
					})
					.then(resp => {
						// res.setHeader("Content-Type", "application/json");
						// res.end(JSON.stringify(resp.data, null, 4));
						resolve(resp.data); // resp.data will be a javascript object and not a string
					})
					.catch(err => {
						// Catch block is called when the the given ID is invalid and a file couldnt be found.
						console.log("Error: " + err);
						reject(err);
					});
			})
			.catch(err => {
				console.log(err);
				reject(err);
			});
	});
}

function saveMetaDataFile(req, metadata) {
	return new Promise((resolve, reject) => {
		getMetaDataFileId(req)
			.then(id => {
				var media = {
					mimeType: "text/plain",
					body: Readable.from(JSON.stringify(metadata, null, 4))
				};

				req.drive.files.update(
					{
						media,
						fields: "id",
						fileId: id
					},
					(err, file) => {
						if (err) {
							// Handle error
							console.error(err);
							reject(err);
						} else {
							console.log("Updated File Successfully");
							resolve();
						}
					}
				);
			})
			.catch(err => {
				reject(err);
			});
	});
}

function getFile(req, fileId) {
	return new Promise((resolve, reject) => {
		req.drive.files
			.get({
				fileId: fileId,
				alt: "media",
				parents: ["appDataFolder"]
			})
			.then(resp => {
				resolve(resp.data);
			})
			.catch(err => {
				// Catch block is called when the the given ID is invalid and a file couldnt be found.
				console.log("Error: " + err);
				reject(err);
			});
	});
}

function uploadFile(req, text, filename) {
	return new Promise((resolve, reject) => {
		var fileMetadata = {
			name: filename,
			parents: ["appDataFolder"]
		};

		var media = {
			mimeType: "text/plain",
			body: Readable.from(text)
		};

		req.drive.files.create(
			{
				resource: fileMetadata,
				media,
				fields: "id"
			},
			(err, file) => {
				if (err) {
					// Handle error
					console.error("Error uploading file" + err);
					reject(err);
				} else {
					console.log("File Id:", file.data.id);
					resolve(file.data.id);
				}
			}
		);
	});
}

function updateFile(req, text, fileId) {
	return new Promise((resolve, reject) => {
		var media = {
			mimeType: "text/plain",
			body: Readable.from(text)
		};

		req.drive.files.update(
			{
				media,
				fields: "id",
				fileId: fileId
			},
			(err, file) => {
				if (err) {
					// Handle error
					console.error("Error updating file" + err);
					reject(err);
				} else {
					console.log("Updated File Successfully");
					resolve(file.data.id);
				}
			}
		);
	});
}

function deleteFile(req, fileId) {
	return new Promise((resolve, reject) => {
		req.drive.files.delete(
			{
				fields: "trashed",
				fileId: fileId
			},
			(err, file) => {
				if (err) {
					// Handle error
					console.error("Error. Unable to delete" + err);
					reject(err);
				} else {
					console.log("Deleted successfully.");
					resolve();
				}
			}
		);
	});
}

module.exports = {
	getMetaDataFile,
	saveMetaDataFile,
	getFile,
	uploadFile,
	updateFile,
	deleteFile
};
