module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tasks', {
        deviceModelType: {
            type: DataTypes.STRING
        },
        
        deviceType: {
            type: DataTypes.STRING
        },
        
        hubId: {
            type: DataTypes.STRING
        },
        
        timeZone: {
            type: DataTypes.STRING
        },
        
        hubReceiveTime: {
            type: DataTypes.STRING
        },
        
        deviceAddress: {
            type: DataTypes.STRING
        },
        
        hubReceiveTimeOffset: {
            type: DataTypes.STRING
        },
        
        qcl_json_data: {
            type: DataTypes.JSON
        }
    });
};