'use strict';

class Torrent {
    constructor(
        {
            categoryId = null,
            category = null,
            id = null,
            title = null,
            authorName = null,
            authorId = null,
            checked = null,
            downloadId = null,
            size = null,
            seeds = null,
            leeches = null,
            registered = null,
            host = null,
        }
    ) {
        this.categoryId = categoryId;
        this.category   = category;
        this.id         = id;
        this.title      = title;
        this.authorName = authorName;
        this.authorId   = authorId;
        this.checked    = checked;
        this.downloadId = downloadId;
        this.size       = size;
        this.seeds      = seeds;
        this.leeches    = leeches;
        this.registered = registered;
        this.host       = host;
    }
}

module.exports = Torrent;
