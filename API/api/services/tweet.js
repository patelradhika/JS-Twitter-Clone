const axios = require('axios');
const URL ="https://api.twitter.com/1.1/search/tweets.json";

class Twitter {
    get(query, count) {
        return axios.get(URL, {
            params: {
                q: query,
                count: count
            },
            headers: {
                "Authorization": `Bearer ${process.env.TWITTER_BEARER_KEY}`
            }
        })
    };

    getNext(query, count, max_id) {
        return axios.get(URL, {
            params: {
                q: query,
                count: count,
                max_id: max_id
            },
            headers: {
                "Authorization": `Bearer ${process.env.TWITTER_BEARER_KEY}`
            }
        })
    }
}

module.exports = Twitter;