class MoveFile
{
    constructor(fs) {
        this.fs = fs;
    }

    execute(request) {
        const source = this.fs.getFile(request.sourcePath);
        const destination = this.fs.getFile(request.destinationPath);
        const parent = source.getParent();
        destination.addFile(source);
        parent.deleteFile(source.getName());
        source.setParent(destination);
    }
}

module.exports = MoveFile;