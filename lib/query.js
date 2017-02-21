function Query(connection) {
    this.connection = connection;
    this.input = input;
    this.inputMany = inputMany;
    this.execute = execute;
    this.executeOne = executeOne;
    this.createQuery = createQuery;
    this.params = [];

    function input(value) {
        this.params.push(value);
        return this;
    }

    function inputMany(...value) {
        this.params = this.params.concat(value);
        return this;
    }

    function execute(procedureName, callback) {
        this.connection.query(this.createQuery(procedureName), this.params, callback);
    }

    function executeOne(procedureName, callback) {
        this.connection.queryOne(this.createQuery(procedureName), this.params, callback);
    }

    function createQuery(procedureName) {
        let paramsIndice = '';
        for (let i in this.params)
            paramsIndice += `$${(+i + 1)}, `;
        paramsIndice = paramsIndice.slice(0, -2);

        return `SELECT * FROM ${procedureName}(${paramsIndice})`;
    }
}

module.exports = (conn) => {
    return new Query(conn);
};