class MetadataHandler {
	constructor(metadata) {
		this.metadata = metadata;
	}

	newFile({ fileId, filename, title, createdDate, tags = [] }) {
		/* data {
			fileId: String,
			filename: String,
			title: String,
			createdDate: String,
			tags: Array[Strings]
		} */
		const newfile = {
			filename,
			title,
			createdDate,
			lastModified: createdDate,
			tags
		};

		this.metadata.files[fileId] = newfile;
	}

	removeFile(fileId) {
		this._validate(fileId);
		delete this.metadata.files[fileId];
	}

	updateFile({ fileId, title, lastModified, tags = [] }) {
		this._validate(fileId);
		this.updateTitle(fileId, title);
		this.updateLastModified(fileId, lastModified);
		this.updateTags(fileId, tags);
	}

	updateTitle(fileId, title) {
		this._validate(fileId);
		this.metadata.files[fileId].title = title;
	}

	updateLastModified(fileId, lastModified) {
		this._validate(fileId);
		this.metadata.files[fileId].lastModified = lastModified;
	}

	updateTags(fileId, tags) {
		this._validate(fileId);
		this.metadata.files[fileId].tags = tags;
	}

	_validate(fileId) {
		if (
			this.metadata.files[fileId] == undefined ||
			this.metadata.files[fileId] == null
		) {
			throw Error("Invalid FileId");
		}
	}

	get metadata() {
		return this.metadata;
	}
}

module.exports = MetadataHandler;
