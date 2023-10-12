class ResultService {
    constructor(db) {
        this.client = db.sequelize;
        this.Result = db.Result;
    }
    async getOne(userId) {
        return this.Result.findOne({ where: { UserId: userId } }); 
    }
    async create(operationName, value, userId) { // we first check whether the user has already set the result
        const model = this.Result;
        return model.findOne({ where: { UserId: userId } }).then(function (result) {
            if(result) { // If so, we update the operation name and value
                return model.update({ OperationName: operationName, Value: value }, { where: { UserId: userId} });
            } else { // otherwise, we add the new record to the table
                return model.create({ OperationName: operationName, Value: value, UserId: userId });
            }
        });
    }
}

module.exports = ResultService;