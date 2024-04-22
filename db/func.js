const fs = require('fs');
const util = require('util');
const uuid = require('uuid').v1;
const asyncreadfile = util.promisify(fs.readFile);
const asyncwritefile = util.promisify(fs.writeFile);

class Store {
    /**
     * 
     * @returns {Promise<Array>} 
     */
    async read() {
        return asyncreadfile('db/db.json', 'utf8')
            .then((data) => JSON.parse(data) || [])
            .catch((error) => {
                console.error('Read operation failed:', error);
                throw new Error('Could not read from file');
            });
    }

    /**
     * 
     * @param {Array} notes 
     * @returns {Promise<void>}
     */
    async write(notes) {
        return asyncwritefile('db/db.json', JSON.stringify(notes, null, 4))
            .then(() => console.info('Data written to db/db.json'))
            .catch((error) => {
             console.error('Write operation failed:', error);
             throw new Error('Could not write to file');
            });
    }

    /**
     * 
     * @param {Object} note 
     * @returns {Promise<Object>} 
     */
    async addnotes(note) {
        const { title, text } = note;
        if (!title || !text) {
            throw new Error('Title and text cannot be blank.');
        }

        const newnotes = { title, text, id: uuid() };
        return this.getnotes()
            .then((notes) => [...notes, newnotes])
            .then((updatenotes) => this.write(updatenotes))
            .then(() => newnotes)
            .catch((error) => {
                console.error('Add note operation failed:', error);
                throw new Error('Failed to add a new note');
            });
    }

    /**
     * 
     * @returns {Promise<Array>}
     */
    async getnotes() {
        return this.read();
    }

    /**
     * 
     * @param {string} id 
     * @returns {Promise<void>}
     */
    async removenotes(id) {
        return this.getnotes()
            .then((notes) => notes.filter(note => note.id !== id))
            .then((keepnotes) => this.write(keepnotes))
            .catch((error) => {
                console.error('Remove note fail', error);
                throw new Error('Failed to remove note'); });
    }
}
module.exports = new Store();