class FileSystem {
    constructor() {
        this.drives = {};
    }

    getFile(path) {
        const pathParts = path.split("\\");
        const drive = this.drives[pathParts.shift()];
        const childPath = pathParts.join("\\");
        return drive.getFile(childPath);
    }

    addFile(file) {
        this.drives[file.getName()] = file;
    }
}

module.exports = FileSystem;