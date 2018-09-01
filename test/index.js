const assert = require('chai').assert;
const File = require('../entities/file');
const Folder = require('../entities/folder');
const ZipFile = require('../entities/zipfile');
const Drive = require('../entities/drive');
const FileSystem = require('../entities/filesystem');
const CreateFile = require('../interactors/createfile');
const MoveFile = require('../interactors/movefile');
const DeleteFile = require('../interactors/deletefile');

describe('File', () => {
    const drive = new Drive("C", new FileSystem);
    it('Calculates path on drive', function() {
        const file = new File("TestFile", drive);
        assert.equal(file.getPath(), 'C\\TestFile');
    });
    it('Calculates path on inner folder', function() {
        const folder = new Folder("folderA", drive);
        const file = new File("TestFile", folder);
        assert.equal(file.getPath(), 'C\\folderA\\TestFile');
    });
    it('Calculates path on zip folder', function() {
        const zip = new ZipFile("zipA", drive);
        const file = new File("TestFile", zip);
        assert.equal(file.getPath(), 'C\\zipA\\TestFile');
    });
    it('Does not have size', function() {
        const folder = new Folder("folderA", drive);
        const file = new File("TestFile", folder);
        assert.throws(file.getSize, Error, 'Implement the method "getSize"');
    });
});

describe('Drive', () => {
    it('Calculates size on drive', function() {
        const fs = new FileSystem;
        const create = new CreateFile(fs);
        create.execute({
            "type" : "Drive",
            "name" : "C",
            "parentPath" : null
        });
        create.execute({
            "type" : "TextFile",
            "name" : "file.txt",
            "parentPath" : "C"
        });
        const file = fs.getFile("C\\file.txt");
        file.write("This is a text file");
        const drive = fs.getFile("C");
        assert.equal(drive.getSize(), 19);
    });
});

describe('Folder', () => {
    it('Calculates size on folder', function() {
        const fs = new FileSystem;
        const create = new CreateFile(fs);
        create.execute({
            "type" : "Drive",
            "name" : "C",
            "parentPath" : null
        });
        create.execute({
            "type" : "Folder",
            "name" : "FolderA",
            "parentPath" : "C"
        });
        create.execute({
            "type" : "TextFile",
            "name" : "file.txt",
            "parentPath" : "C\\FolderA"
        });
        let file = fs.getFile("C\\FolderA\\file.txt");
        file.write("This is a text file");
        const folder = fs.getFile("C\\FolderA");
        assert.equal(folder.getSize(), 19);
        create.execute({
            "type" : "TextFile",
            "name" : "file2.txt",
            "parentPath" : "C\\FolderA"
        });
        file = fs.getFile("C\\FolderA\\file2.txt");
        file.write("This is a text file");
        assert.equal(folder.getSize(), 38);
    });
});

describe('ZipFile', () => {
    it('Calculates size on zip', function() {
        const fs = new FileSystem;
        const create = new CreateFile(fs);
        create.execute({
            "type" : "Drive",
            "name" : "C",
            "parentPath" : null
        });
        create.execute({
            "type" : "ZipFile",
            "name" : "container.zip",
            "parentPath" : "C"
        });
        create.execute({
            "type" : "TextFile",
            "name" : "file.txt",
            "parentPath" : "C\\container.zip"
        });
        const file = fs.getFile("C\\container.zip\\file.txt");
        file.write("This is a text file");
        const zip = fs.getFile("C\\container.zip");
        assert.equal(zip.getSize(), 9);
    });
});

describe('CreateFile', () => {

    it('Creates text file "file.txt" in zip file "file.zip" in folder "FolderA" in C drive', function() {
        const fs = new FileSystem;
        const create = new CreateFile(fs);
        create.execute({
            "type" : "Drive",
            "name" : "C",
            "parentPath" : null
        });
        create.execute({
            "type" : "Folder",
            "name" : "FolderA",
            "parentPath" : "C"
        });
        create.execute({
            "type" : "ZipFile",
            "name" : "file.zip",
            "parentPath" : "C\\FolderA"
        });
        create.execute({
            "type" : "TextFile",
            "name" : "file.txt",
            "parentPath" : "C\\FolderA\\file.zip"
        });
        assert.isTrue(fs
            .drives["C"]
            .files["FolderA"]
            .files["file.zip"]
            .files.hasOwnProperty("file.txt"));
    });

    it('Throws an error when filename exists', function() {
        const fs = new FileSystem;
        const create = new CreateFile(fs);
        create.execute({
            "type" : "Drive",
            "name" : "C",
            "parentPath" : null
        });
        create.execute({
            "type" : "Folder",
            "name" : "FolderA",
            "parentPath" : "C"
        });
        assert.throws(() => create.execute({
            "type" : "Folder",
            "name" : "FolderA",
            "parentPath" : "C"
        }), Error, 'FolderA already exists');
    });

    it('Throws an error when path does not exist', function() {
        const fs = new FileSystem;
        const create = new CreateFile(fs);
        create.execute({
            "type" : "Drive",
            "name" : "C",
            "parentPath" : null
        });
        assert.throws(() => create.execute({
            "type" : "File",
            "name" : "file.txt",
            "parentPath" : "C\\FolderA"
        }), Error, 'Path not found');
    });

    it('Throws an error when creating file in text file', function() {
        const fs = new FileSystem;
        const create = new CreateFile(fs);
        create.execute({
            "type" : "Drive",
            "name" : "C",
            "parentPath" : null
        });
        create.execute({
            "type" : "TextFile",
            "name" : "file.txt",
            "parentPath" : "C"
        });
        assert.throws(() => create.execute({
            "type" : "TextFile",
            "name" : "fail.txt",
            "parentPath" : "C\\file.txt"
        }), Error, 'Text file does not contain any other entity');
    });

    it('Throws an error when adding drive to an entity', function() {
        const fs = new FileSystem;
        const create = new CreateFile(fs);
        create.execute({
            "type" : "Drive",
            "name" : "C",
            "parentPath" : null
        });
        assert.throws(() => create.execute({
            "type" : "Drive",
            "name" : "FailDrive",
            "parentPath" : "C"
        }), Error, 'Drive can not be contained in any entity');
    });

    it('Throws an error when adding entity without parent', function() {
        const fs = new FileSystem;
        const create = new CreateFile(fs);
        assert.throws(() => create.execute({
            "type" : "TextFile",
            "name" : "file.txt",
            "parentPath" : null
        }), Error, 'Non-drive entity must be contained in another entity');
    });
});

describe('MoveFile', () => {
    it('Moves file from source to destination', function() {
        const fs = new FileSystem;
        const move = new MoveFile(fs);
        const create = new CreateFile(fs);
        create.execute({
            "type" : "Drive",
            "name" : "C",
            "parentPath" : null
        });
        create.execute({
            "type" : "Folder",
            "name" : "FolderA",
            "parentPath" : "C"
        });
        create.execute({
            "type" : "TextFile",
            "name" : "file.txt",
            "parentPath" : "C"
        });

        assert.isTrue(fs
            .drives["C"]
            .files.hasOwnProperty("file.txt"));
        assert.isFalse(fs
            .drives["C"]
            .files["FolderA"]
            .files.hasOwnProperty("file.txt"));

        move.execute({
            "sourcePath" : "C\\file.txt",
            "destinationPath" : "C\\FolderA"
        });

        assert.isFalse(fs
            .drives["C"]
            .files.hasOwnProperty("file.txt"));
        assert.isTrue(fs
            .drives["C"]
            .files["FolderA"]
            .files.hasOwnProperty("file.txt"));
    });
});

describe('DeleteFile', () => {
    it('deletes file in path', function() {
        const fs = new FileSystem;
        const deleteFile = new DeleteFile(fs);
        const create = new CreateFile(fs);
        create.execute({
            "type" : "Drive",
            "name" : "C",
            "parentPath" : null
        });
        create.execute({
            "type" : "TextFile",
            "name" : "file.txt",
            "parentPath" : "C"
        });

        assert.isTrue(fs
            .drives["C"]
            .files.hasOwnProperty("file.txt"));

        deleteFile.execute({
            "path" : "C\\file.txt"
        });

        assert.isFalse(fs
            .drives["C"]
            .files.hasOwnProperty("file.txt"));
    });
});