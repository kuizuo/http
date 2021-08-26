"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFakeIP = exports.mergeCookie = exports.obj2Cookies = exports.cookies2Obj = exports.Http = void 0;
const axios_1 = require("axios");
const http = require("http");
const https = require("https");
const urllib = require("url");
const axios_retry_1 = require("axios-retry");
const UserAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.30 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
];
class Http {
    constructor(auto, retryConfig) {
        this.auto = false;
        this.cookies = {};
        this.headers = {};
        this.redirect = true;
        this.auto = auto;
        this.instance = axios_1.default.create();
        this.instance.defaults.timeout = 60 * 1000;
        if (retryConfig) {
            axios_retry_1.default(this.instance, {
                retries: retryConfig.retry,
                retryDelay: (retryCount) => {
                    return retryCount * retryConfig.delay;
                },
                shouldResetTimeout: true,
                retryCondition: (error) => {
                    if (axios_retry_1.default.isNetworkOrIdempotentRequestError(error)) {
                        return true;
                    }
                    if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1) {
                        return true;
                    }
                    if (['ECONNRESET', 'ETIMEDOUT'].includes(error.code)) {
                        return true;
                    }
                    return false;
                }
            });
        }
        this.instance.interceptors.request.use(config => {
            return config;
        }, error => {
            return Promise.reject(error);
        });
        this.instance.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            if (error.response) {
                let res = error.response;
                return Promise.reject(res);
            }
            else {
                return Promise.reject(error);
            }
        });
    }
    async request(config) {
        return new Promise((resolve, reject) => {
            var _a, _b;
            const { url, method = 'GET', data = null, headers } = config;
            if (!url)
                reject('Please fill in the url');
            if (!headers)
                config.headers = {};
            const cookie = (_a = config.headers) === null || _a === void 0 ? void 0 : _a['Cookie'];
            if (cookie) {
                config.headers['Cookie'] = typeof cookie == 'string' ? cookies2Obj(cookie) : cookie;
            }
            else {
                config.headers['Cookie'] = (_b = obj2Cookies(this.cookies)) !== null && _b !== void 0 ? _b : '';
            }
            if (this.auto) {
                let { protocol, host, pathname } = urllib.parse(url);
                if (!config.headers['Referer']) {
                    config.headers['Referer'] = protocol + '//' + host + pathname;
                }
                if (!config.headers['Origin']) {
                    config.headers['Origin'] = protocol + '//' + host;
                }
            }
            if (this.proxy) {
                config.proxy = this.proxy;
            }
            let _headers = Object.assign(Object.assign({}, this.headers), config.headers);
            let _config = Object.assign(Object.assign({}, config), { method,
                data, headers: _headers, withCredentials: true, maxRedirects: 5, httpAgent: new http.Agent({ keepAlive: true }), httpsAgent: new https.Agent({ keepAlive: true, rejectUnauthorized: false }), validateStatus: function (status) {
                    return true;
                } });
            this.instance.request(_config).then(async (res) => {
                var _a, _b;
                if ((_a = res.headers) === null || _a === void 0 ? void 0 : _a['set-cookie']) {
                    let setCookies = (_b = res.headers) === null || _b === void 0 ? void 0 : _b['set-cookie'];
                    let cookies = setCookies
                        .map((x) => x.split(';')[0])
                        .reduce((a, val) => ((a[val.slice(0, val.indexOf('=')).trim()] = val.slice(val.indexOf('=') + 1).trim()), a), {});
                    this.cookies = Object.assign(Object.assign({}, this.cookies), cookies);
                    res['cookies'] = this.cookies;
                }
                if ([301, 302, 303].includes(res.status)) {
                    let location = res.headers['location'] || '';
                    if (location) {
                        if (!this.redirect) {
                            res['location'] = location;
                        }
                        else {
                            let res = this.request(Object.assign({ url: location }, _config));
                            resolve(res);
                        }
                    }
                }
                resolve(res);
            }).catch((err) => {
                resolve(err);
            });
        });
    }
    async get(url, config) {
        return this.request(Object.assign({ url, method: 'GET', data: '' }, config));
    }
    async post(url, data, config) {
        return this.request(Object.assign({ url, method: 'POST', data }, config));
    }
    async put(url, data, config) {
        return this.request(Object.assign({ url, method: 'PUT', data }, config));
    }
    async delete(url, config) {
        return this.request(Object.assign({ url, method: 'DELETE' }, config));
    }
    init() {
        this.headers['User-Agent'] = UserAgents[Math.round(Math.random() * UserAgents.length)] || 'User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0';
        this.headers['Accept-Language'] = "zh-CN,zh;q=0.9";
        this.headers['Accept-Encoding'] = "gzip, deflate";
        this.headers['Connection'] = "keep-alive";
    }
    setCookies(cookies) {
        if (!cookies) {
            delete this.headers['Cookie'];
            delete this.cookies;
            return;
        }
        if (typeof cookies === 'string') {
            this.headers['Cookie'] = cookies;
        }
        else {
            this.headers['Cookie'] = obj2Cookies(cookies);
        }
    }
    setHeader(key, val = '') {
        if (val) {
            this.headers[key] = val;
        }
        else {
            delete this.headers[key];
        }
    }
    setHeaders(headers) {
        Object.keys(headers).forEach((h) => {
            if (headers[h]) {
                this.headers[h] = headers[h];
            }
            else {
                delete this.headers[h];
            }
        });
    }
    setUserAgent(userAgent) {
        this.headers['User-Agent'] = userAgent;
    }
    setFakeIP(ip) {
        ip = ip !== null && ip !== void 0 ? ip : getFakeIP();
        this.headers['Client-Ip'] = ip;
        this.headers['X-Forwarded-For'] = ip;
        this.headers['Remote_Addr'] = ip;
    }
    setProxy(p) {
        if (p) {
            let proxy = {
                host: p.split(':')[0],
                port: parseInt(p.split(':')[1])
            };
            this.proxy = proxy;
        }
        else {
            this.proxy = null;
        }
    }
}
exports.Http = Http;
function cookies2Obj(cookies) {
    return cookies.split('; ').reduce((a, val) => ((a[val.slice(0, val.indexOf('=')).trim()] = val.slice(val.indexOf('=') + 1).trim()), a), {});
}
exports.cookies2Obj = cookies2Obj;
function obj2Cookies(obj) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('; ');
}
exports.obj2Cookies = obj2Cookies;
function mergeCookie(c1, c2) {
    c1 = typeof c1 == 'string' ? cookies2Obj(c1) : c1;
    c2 = typeof c2 == 'string' ? cookies2Obj(c2) : c2;
    return Object.assign(Object.assign({}, c1), c2);
}
exports.mergeCookie = mergeCookie;
function getFakeIP() {
    var a = Math.round(Math.random() * 250) + 1, b = Math.round(Math.random() * 250) + 1, c = Math.round(Math.random() * 240) + 1, d = Math.round(Math.random() * 240) + 1;
    return [a, b, c, d].join('.');
}
exports.getFakeIP = getFakeIP;
