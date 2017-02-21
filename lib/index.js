function init(config) {
    const db = require('pg-db')(config);

    let req = {
        db: db,
        request: function () {
            return require('./query')(db);
        }
    };
    return req;
}

module.exports = init;