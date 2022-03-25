"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFakeIP = exports.mergeCookie = exports.obj2Cookies = exports.cookies2Obj = void 0;
const axios_1 = __importDefault(require("axios"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const tunnel_1 = __importDefault(require("tunnel"));
const url_1 = __importDefault(require("url"));
const axios_retry_1 = __importDefault(require("axios-retry"));
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
        this.instance = axios_1.default.create();
        this.auto = auto;
        this.instance.defaults.timeout = 30 * 1000;
        if (retryConfig) {
            (0, axios_retry_1.default)(this.instance, {
                retries: retryConfig.retries,
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
                },
            });
        }
        this.instance.interceptors.request.use((config) => {
            return config;
        }, (error) => {
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
            var _a;
            const { url, headers } = config;
            if (!url)
                reject('Please fill in the url');
            if (!headers)
                config.headers = {};
            const cookie = (_a = config.headers) === null || _a === void 0 ? void 0 : _a['Cookie'];
            if (cookie) {
                config.headers['Cookie'] = typeof cookie === 'string' ? cookies2Obj(cookie) : cookie;
            }
            else {
                if (obj2Cookies(this.cookies))
                    config.headers['Cookie'] = obj2Cookies(this.cookies);
            }
            if (this.auto) {
                let { protocol, host, pathname } = url_1.default.parse(url);
                if (!config.headers['Referer']) {
                    config.headers['Referer'] = protocol + '//' + host + pathname;
                }
                if (!config.headers['Origin']) {
                    config.headers['Origin'] = protocol + '//' + host;
                }
            }
            let _headers = Object.assign(Object.assign({}, this.headers), config.headers);
            let setting = Object.assign(Object.assign({}, config), { headers: _headers, withCredentials: true, maxRedirects: 0, httpAgent: new http_1.default.Agent({ keepAlive: true }), httpsAgent: new https_1.default.Agent({ keepAlive: true, rejectUnauthorized: false }), validateStatus: function (status) {
                    return true;
                } });
            if (this.proxy && !config.proxy) {
                config.proxy = this.proxy;
            }
            if (config.proxy) {
                setting.proxy = false;
                setting.httpAgent = tunnel_1.default.httpOverHttp({ proxy: this.proxy });
            }
            this.instance
                .request(setting)
                .then(async (res) => {
                var _a;
                if ((_a = res.headers) === null || _a === void 0 ? void 0 : _a['set-cookie']) {
                    let cookies = res.headers['set-cookie'].map((x) => x.split(';')[0]).reduce((a, val) => ((a[val.slice(0, val.indexOf('=')).trim()] = val.slice(val.indexOf('=') + 1).trim()), a), {});
                    this.cookies = Object.assign(Object.assign({}, this.cookies), cookies);
                    res['cookies'] = this.cookies;
                }
                if ([301, 302, 303].includes(res.status)) {
                    let location = res.headers['location'] || '';
                    if (location) {
                        if (this.redirect) {
                            let res = await this.request(Object.assign(Object.assign({}, setting), { url: location }));
                            resolve(res);
                        }
                        else {
                            res['location'] = location;
                        }
                    }
                }
                resolve(res);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    async get(url, config) {
        return this.request(Object.assign({ url, method: 'GET' }, config));
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
        this.headers['Accept-Language'] = 'zh-CN,zh;q=0.9';
        this.headers['Accept-Encoding'] = 'gzip, deflate';
        this.headers['Connection'] = 'keep-alive';
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
                port: Number(p.split(':')[1]),
            };
            this.proxy = proxy;
        }
        else {
            this.proxy = null;
        }
    }
}
exports.default = Http;
function cookies2Obj(cookies) {
    return cookies.split('; ').reduce((a, val) => ((a[val.slice(0, val.indexOf('=')).trim()] = val.slice(val.indexOf('=') + 1).trim()), a), {});
}
exports.cookies2Obj = cookies2Obj;
function obj2Cookies(obj) {
    return Object.keys(obj)
        .map((key) => key + '=' + obj[key])
        .join('; ');
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
