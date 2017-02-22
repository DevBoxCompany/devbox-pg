function Query(connection) {
    this.connection = connection;
    this.input = input;
    this.inputMany = inputMany;
    this.inputName = inputName;
    this.object = object;
    this.execute = execute;
    this.executeOne = executeOne;
    this.createQuery = createQuery;
    this.createQueryName = createQueryName;
    this.params = [];
    this.paramsName = [];

    function input(value) {
        if (this.paramsName.length)
            throw new Exception('Parameter exception', 'Não utilize input e inputName ou object na mesma consulta');

        this.params.push(value);
        return this;
    }

    function inputMany(...value) {
        if (this.paramsName.length)
            throw new Exception('Parameter exception', 'Não utilize input e inputName ou object na mesma consulta');
            
        this.params = this.params.concat(value);
        return this;
    }

    function inputName(name, value) {
        if (this.params.length)
            throw new Exception('Parameter exception', 'Não utilize input e inputName ou object na mesma consulta');

        this.paramsName.push({
            name,
            value
        });
        return this;
    }

    function object(obj, prefix) {
        prefix = prefix || '';
        for (let i in obj) {
            this.inputName(prefix + i, obj[i]);
        }
        return this;
    }

    function execute(procedureName, callback) {
        this.connection.query(this[this.params.length ? 'createQuery' : 'createQueryName'](procedureName), this.params, callback);
    }

    function executeOne(procedureName, callback) {
        this.connection.queryOne(this[this.params.length ? 'createQuery' : 'createQueryName'](procedureName), this.params, callback);
    }

    function createQuery(procedureName) {
        let paramsIndice = '';
        for (let i in this.params)
            paramsIndice += `$${(+i + 1)}, `;
        paramsIndice = paramsIndice.slice(0, -2);

        return `SELECT * FROM ${procedureName}(${paramsIndice})`;
    }

    function createQueryName(procedureName) {
        let paramsIndice = '';
        this.paramsName.map(x => {
            paramsIndice += `${x.name} := '${x.value}', `;
        });
        paramsIndice = paramsIndice.slice(0, -2);

        return `SELECT * FROM ${procedureName}(${paramsIndice})`;
    }

    function Exception(name, message) {
        this.message = message;
        this.name = name;
    }
}

module.exports = (conn) => {
    return new Query(conn);
};