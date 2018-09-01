class File {
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
    }

    getPath() {
        return this.parent.getPath() + "\\" + this.getName();
    }

    getSize() {
        throw new Error('Implement the method "getSize"');
    }

    getName() {
        return this.name;
    }

    getParent() {
        return this.parent;
    }

    setParent(file)
    {
        this.parent = file;
    }
}

module.exports = File;