const Folder = require('./folder');
class ZipFile extends Folder
{
    getSize() {
        return Math.floor(super.getSize() / 2);
    }
}

module.exports = ZipFile;