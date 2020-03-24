const express = require("express");
const router = express.Router();
const uid = require("uid");
const {
	constructClient,
	constructDriveClient
} = require("../middleware/general");
const { allowLoggedIn } = require("../middleware/auth");
const {
	getMetaDataFile,
	saveMetaDataFile,
	getFile,
	uploadFile,
	updateFile,
	deleteFile
} = require("../helpers/drive");
const MetaDataHandler = require("../helpers/MetadataHandler");

router.use(allowLoggedIn);
router.use(constructClient);
router.use(constructDriveClient);

router.get("/", (req, res) => {
	res.render("index");
});

router.get("/metadata", (req, res) => {
	getMetaDataFile(req)
		.then(metadata => {
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(metadata));
		})
		.catch(err => {
			console.log(err);
			res.end("unable to fetch metadata");
		});
});

// To get a list of files in the google drive
router.get("/list", (req, res) => {
	/* 
		Response will be a JSON of the form:

		[
            {
                "id": "1uypjfC5vBvL10TEmDgrJpvi7bpJvXSIeg4_4S-LBnmjN1lCpfQ",
                "name": "metadata.json"
            },
            {
                "id": "1ePeMQDujJ4sAx1r_iLxkZf0QK7oBkxgQKdFwcI89KaJccm0qMw",
                "name": "file-3w1tckvidpi"
            }
        ]
	*/
	req.drive.files.list(
		{
			spaces: "appDataFolder",
			/* pageSize: 10, */
			/* fields: "nextPageToken, files(id, name)" */
			fields: "files(id, name)"
		},
		(err, resp) => {
			if (err) return console.log("The API returned an error: " + err);
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(resp.data.files, null, 4));
		}
	);
});

// View a single file
router.get("/view/:fileid", (req, res) => {
	let fileId = req.params.fileid;
	if (!fileId || fileId == "") {
		res.end("invalid");
		return;
	}
	getFile(req, fileId)
		.then(data => res.end(data))
		.catch(() => res.end("error"));
});

// To retrieve more than one files at a time.
router.post("/view", async (req, res) => {
	/* 
		The request for this end point must be in the format:

		[
			fileId1,
			fileId2
		]

		The response will be in the form:

		{
			fileId1: "Note body",
			fileId2: "Note body",
			errors: [fileIdx]
		}
	
	*/
	if (
		req.body.length == 0 ||
		req.body.length == undefined ||
		!Array.isArray(req.body)
	) {
		res.end("invalid");
	} else {
		let data = {};
		let fileIds = req.body;
		let erroredFileIds = [];
		for (let i = 0; i < fileIds.length; i++) {
			try {
				let noteBody = await getFile(req, fileIds[i]);
				data[fileIds[i]] = noteBody;
			} catch (err) {
				console.log(err);
				erroredFileIds.push(fileIds[i]);
			}
		}
		data["errors"] = erroredFileIds;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify(data));
	}
});

// To upload multiple notes at a time
router.post("/upload", async (req, res) => {
	/* A json oject must be sent to this endpoint in the format below. 

		[
			{
				title: note1
				body: note1 body
				tags: [tag1, tag2, etc] Pass empty array is no tags
			},
			{
				title: note2.
				body: note2 body
				tags: [tag1, tag2, etc] Pass empty array is no tags
			}
		]

		Response will be an array of errored file object:

		[
			{
				title: note2,
				body: note2 body,
				tags: [tag1, tag2, etc]
			}
		]

	*/
	if (
		req.body.length == 0 ||
		req.body.length == undefined ||
		!Array.isArray(req.body)
	) {
		res.end("invalid");
	} else {
		const files = req.body;
		let metadata = null;
		let metadataHandler = null;
		try {
			metadata = await getMetaDataFile(req);
			metadataHandler = new MetaDataHandler(metadata);
		} catch (err) {
			console.log(err);
		}
		if (metadata) {
			let erroredFiles = [];
			for (let i = 0; i < files.length; i++) {
				try {
					let filename = "file-" + uid() + ".md";
					let fileId = await uploadFile(req, files[i].body);
					metadataHandler.newFile({
						fileId,
						filename,
						title: files[i].title,
						createdDate: Date.now(),
						tags: files[i].tags
					});
				} catch (err) {
					console.log(err);
					erroredFiles.push(files[i]);
				}
			}
			try {
				await saveMetaDataFile(req, metadataHandler.metadata);
			} catch (err) {
				console.log(err);
			}
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(erroredFiles));
		} else {
			res.end("unable to fetch metadata");
		}
	}
});

// To update multiple notes a time
router.post("/update", async (req, res) => {
	/* A json oject must be sent to this endpoint in the format below.

		[
			{
				fileId: file id of file saved in drive
				title: note1
				body: note1 body
				tags: [tag1, tag2, etc] Pass empty array is no tags
			},
			{
				fileId: file id of file saved in drive
				title: note2.
				body: note2 body
				tags: [tag1, tag2, etc] Pass empty array is no tags
			}
		]

		Response will be an array of errored file objects:

		[
			{
				title: note2,
				body: note2 body,
				tags: [tag1, tag2, etc]
			}
		]

	*/

	if (
		req.body.length == 0 ||
		req.body.length == undefined ||
		!Array.isArray(req.body)
	) {
		res.end("invalid");
	} else {
		const files = req.body;
		let metadata = null;
		let metadataHandler = null;
		try {
			metadata = await getMetaDataFile(req);
			metadataHandler = new MetaDataHandler(metadata);
		} catch (err) {
			console.log(err);
		}
		if (metadata) {
			let erroredFiles = [];
			for (let i = 0; i < files.length; i++) {
				try {
					let fileId = await updateFile(
						req,
						files[i].body,
						files[i].fileId
					);
					metadataHandler.updateFile({
						fileId: files[i].fileId,
						title: files[i].title,
						lastModified: Date.now(),
						tags: files[i].tags
					});
				} catch (err) {
					console.log(err);
					erroredFiles.push(files[i]);
				}
			}

			try {
				await saveMetaDataFile(req, metadataHandler.metadata);
			} catch (err) {
				console.log(err);
			}
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(erroredFiles));
		} else {
			res.end("unable to fetch metadata");
		}
	}
});

// To delete multiple notes at a time
router.post("/delete", async (req, res) => {
	/* 
		The request for this is an array of fileIds:
		[
			fileId1,
			fileId2,
		]

		Response will be an array of errored file ids:

		[
			fileId2
		]
	*/

	if (
		req.body.length == 0 ||
		req.body.length == undefined ||
		!Array.isArray(req.body)
	) {
		res.end("invalid");
	} else {
		const fileIds = req.body;
		let metadata = null;
		let metadataHandler = null;
		try {
			metadata = await getMetaDataFile(req);
			metadataHandler = new MetaDataHandler(metadata);
		} catch (err) {
			console.log(err);
		}
		if (metadata) {
			let erroredFileIds = [];
			for (let i = 0; i < fileIds.length; i++) {
				try {
					await deleteFile(req, fileIds[i]);
					metadataHandler.removeFile(fileIds[i]);
				} catch (err) {
					console.log(err);
					erroredFileIds.push(fileIds[i]);
				}
			}

			try {
				await saveMetaDataFile(req, metadataHandler.metadata);
			} catch (err) {
				console.log(err);
			}
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(erroredFileIds));
		} else {
			res.end("unable to fetch metadata");
		}
	}
});

module.exports = router;
