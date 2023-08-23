import request from "./request";
import apiList from "./apiList";
import qs from "qs";

function getApiObj(url, data = {}) {
    let apiArray = url.split(".");
    let api = apiList;
    apiArray.forEach((v) => {
        api = api[v];
    });
    return api;
}

// const BASE_API = '//test-api.funihash.com';
// const BASE_API = '//api-cdn.beingfi.com';
const BASE_API = '//api.beingfi.com';

const URL_PREFIX = BASE_API + "/fingernft";
export default function api(url, data = {}) {
    var api = getApiObj(url);

    var post = {
        url: URL_PREFIX + api.url,
        method: api.method,
    };
    if (url == "storage.upload" || url === "storage.multiupload") {
        post.headers = { "Content-Type": "multipart/form-data" };
        post.data = data;
    } else if (api.json) {
        post.headers = { "Content-Type": "application/json" };
        post.data = data;
    } else if (url == "log.info") {
        post.url = api.url;
        post.data = data;
    } else {
        var method = api.method.toLowerCase();
        if (method == "post") {
            post.data = qs.stringify(data);
        } else {
            post.post = data;
        }
    }
    if (url == "oauth.authorize") {
        post.url = api.url;
    }
    return request(post);
}
