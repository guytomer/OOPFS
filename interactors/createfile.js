const Drive = require('../entities/drive');
const Folder = require('../entities/folder');
const ZipFile = require('../entities/zipfile');
const TextFile = require('../entities/textfile');
const FileSystem = require('../entities/filesystem');

class CreateFile
{
    constructor(fs) {
        this.fs = fs;
    }

    execute(request) {
        const classes = {Drive, Folder, ZipFile, TextFile};
        const parent = !request.parentPath ? this.fs : this.fs.getFile(request.parentPath);
        const file = new classes[request.type](request.name, parent);
        this.validateFSOperation(file, parent, request.parentPath);
        parent.addFile(file);
    }

    validateFSOperation(file, parent, parentPath) {
        if (parent instanceof TextFile) {
            throw new Error("Text file does not contain any other entity");
        }
        if (file instanceof Drive && !(parent instanceof FileSystem)) {
            throw new Error("Drive can not be contained in any entity");
        }
        if (!(file instanceof Drive) && !parentPath) {
            throw new Error("Non-drive entity must be contained in another entity");
        }
    }
}

module.exports = CreateFile;