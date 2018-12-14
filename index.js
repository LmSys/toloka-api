'use strict';

const Parser       = require("./lib/parser");
const PageProvider = require("./lib/page-provider");

class TolokaApi {
    constructor() {
        this.parser       = new Parser();
        this.pageProvider = new PageProvider();
    }

    login({username, password}) {
        return this.pageProvider.login(username, password);
    }

    search(query) {
        return this.pageProvider
            .search(query)
            .then(html => this.parser.parseSearch(html));
    }

    download(downloadId) {
        return this.pageProvider.torrentFile(downloadId);
    }

    get(id) {
        return this.pageProvider
            .thread(id)
            .then(html => this.parser.parsePage(html));
    }

    url(url) {
        return this.pageProvider
            .url(url)
            .then(html => this.parser.parsePage(html));
    }

    // content(id) {
    //     return this.pageProvider
    //         .content(id)
    //         .then(html => this.parser.parseContent(html));
    // }
}

module.exports = TolokaApi;
