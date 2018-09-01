const File = require('./file');
class Folder extends File
{
    constructor(name, parent) {
        super(name, parent);
        this.files = {};
    }

    getSize() {
        return Object.values(this.files)
            .map(file => file.getSize())
            .reduce((directorySize, fileSize) => directorySize + fileSize);
    }

    addFile(file) {
        this.validateFileInexistence(file);
        this.files[file.getName()] = file;
    }

    validateFileInexistence(file) {
        if (this.files[file.getName()] !== undefined) {
            throw new Error(file.getName() + ' already exists');
        }
    }

    deleteFile(name) {
        delete this.files[name];
    }

    getFile(path)
    {
        if (!path) {
            return this;
        }
        return this.files[path] !== undefined ?
            this.files[path] :
            this.getFileInChildren(path);
    }

    getFileInChildren(path)
    {
        const pathParts = path.split("\\");
        const file = this.files[pathParts.shift()];
        const childPath = pathParts.join("\\");
        this.validateFileExistence(file);
        return file.getFile(childPath);
    }

    validateFileExistence(file) {
        if (file === undefined) {
            throw new Error('Path not found');
        }
    }
}

module.exports = Folder;