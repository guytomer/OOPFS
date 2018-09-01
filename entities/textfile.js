const File = require('./file');
class TextFile extends File
{
    getSize() {
        return this.content.length;
    }

    write(content) {
        this.content = content;
    }
}

module.exports = TextFile;