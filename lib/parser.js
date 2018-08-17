'use strict';

const cheerio = require("cheerio");
const Torrent = require("./torrent");

class Parser {
    constructor() {
        this.host = "http://rutracker.org";
    }

    parseSearch(rawHtml) {
        const $       = cheerio.load(rawHtml, {decodeEntities: false});
        const results = [];

        let tracks = $(".forumline").last().find("tr");
        tracks     = tracks.next();

        const {length} = tracks;

        for (let i = 1; i < length; i += 1) {
            const checkbox     = tracks.find("td");
            const category     = checkbox.next();
            const title        = category.next();
            const author       = title.next();
            const checked      = author.next();
            const downloadLink = checked.next();
            const size         = downloadLink.next();
            const status       = size.next();
            const downloaded   = status.next();
            const seeds        = downloaded.next();
            const leeches      = seeds.next();
            const replies      = leeches.next();
            const added        = replies.next();

            const torrent = new Torrent({
                categoryId: Number(category.find("a").attr('href').replace(/.*?f=([0-9]*)$/g, '$1')),
                category:   category.find("a").html(),
                id:         Number(title.find("a").attr("href").replace(/.*?t([0-9]*)$/g, '$1')),
                title:      title.find("b").html(),
                authorName: author.find("a").html(),
                authorId:   Number(author.find("a").attr("href").replace(/.*?pid=([0-9]*)$/g, '$1')),
                checked:    checked.find("span").html() === "+",
                downloadId: Number(downloadLink.find("a").attr("href").replace(/.*?id=([0-9]*)$/g, '$1')),
                size:       size.html(),
                seeds:      Number(seeds.find("b").html()),
                leeches:    Number(leeches.find("b").html()),
                registered: new Date(added.html()),
                host:       this.host
            });

            results.push(torrent);

            tracks = tracks.next();
        }

        return results;
    }

    parsePage(rawHtml) {
        const $ = cheerio.load(rawHtml, {decodeEntities: false});

        const category     = $('.nav').first().find('a').last();
        const title        = $('.maintitle');
        const author       = $('.forumline').eq(1).find('a.txtb');
        const checked      = rawHtml.includes('misc/pics/perevireno.gif2');
        const downloadLink = $('a.piwik_download');
        const detailTable  = $('table.btTbl').find('tr');

        return new Torrent({
            categoryId: Number(category.attr('href').replace(/.*?f([0-9]*)$/g, '$1')),
            category:   category.html(),
            id:         Number(title.attr("href").replace(/.*?t([0-9]*)$/g, '$1')),
            title:      title.html(),
            authorName: author.html(),
            authorId:   Number(author.attr('href').replace(/.*?u([0-9]*)$/g, '$1')),
            checked:    checked,
            downloadId: Number(downloadLink.attr("href").replace(/.*?id=([0-9]*)$/g, '$1')),
            size:       detailTable.eq(3).find('span').html().trim(),
            seeds:      Number($('.seed').last().find('b').html()),
            leeches:    Number($('.leech').last().find('b').html()),
            registered: new Date(detailTable.eq(2).find('td').last().html().trim()),
            host:       this.host
        });
    }
}

module.exports = Parser;
