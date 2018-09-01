const Folder = require('./folder');
class Drive extends Folder
{
    getPath() {
        return this.getName();
    }
}

module.exports = Drive;