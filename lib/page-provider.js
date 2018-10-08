const {AuthorizationError, NotAuthorizedError} = require("./errors");
const tough                                    = require('tough-cookie');
const request                                  = require('request');
const requestPromise                           = require('request-promise');

class PageProvider {
    constructor() {
        this.authorized  = false;
        this.jar         = null;
        this.host        = "https://toloka.to";
        this.loginUrl    = `${this.host}/login.php`;
        this.searchUrl   = `${this.host}/tracker.php`;
        this.downloadUrl = `${this.host}/download.php`;
    }

    async login(username, password) {
        const response = await requestPromise({
            url:                     this.loginUrl,
            method:                  'POST',
            form:                    {
                username:  username,
                password:  password,
                autologin: 'on',
                ssl:       'on',
                redirect:  'index.php?',
                login:     'Вхід'
            },
            resolveWithFullResponse: true,
            simple:                  false
        });

        if (response.statusCode !== 302) {
            throw new AuthorizationError();
        }

        const jar = request.jar();

        response.headers['set-cookie'].map((row) => {
            const [key, value] = row.split(';')[0].split('=');
            const cookie       = new tough.Cookie({key, value});

            jar.setCookie(cookie, this.host);
        });

        this.jar        = jar;
        this.authorized = true;

        return true;
    }

    search(query) {
        if (!this.authorized) {
            return Promise.reject(new NotAuthorizedError());
        }

        const url = `${this.searchUrl}?nm=${query}`;

        return requestPromise({
            url:    url,
            method: "GET",
            jar:    this.jar,
        });
    }

    thread(id) {
        const url = `${this.host}/t${id}`;

        return this.url(url);
    }

    url(url) {
        if (!this.authorized) {
            return Promise.reject(new NotAuthorizedError());
        }

        return requestPromise({
            url:    url,
            method: "GET",
            jar:    this.jar,
        });
    }

    torrentFile(downloadId) {
        if (!this.authorized) {
            return Promise.reject(new NotAuthorizedError());
        }

        const url = `${this.downloadUrl}?id=${downloadId}`;

        return request({
            url:    url,
            method: "GET",
            jar:    this.jar,
        });
    }
}

module.exports = PageProvider;
