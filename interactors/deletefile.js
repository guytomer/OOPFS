class DeleteFile
{
    constructor(fs) {
        this.fs = fs;
    }

    execute(request) {
        const source = this.fs.getFile(request.path);
        const parent = source.getParent();
        parent.deleteFile(source.getName());
    }
}

module.exports = DeleteFile;