var functions = require('usefulFunctions');

var roleUpgrader = {
    run: function(creep){
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0){
            creep.memory.upgrading = true;
            creep.say('⬆️️ upgrade');
        }
        
        if(creep.memory.upgrading){
            if(creep.memory.idActiveSource != null){
                addFreeSpaceToSource(creep, creep.memory.idActiveSource);
                creep.memory.idActiveSource = null;
            }
            
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#03adfc'}});
            }
           
        } else {
            if(creep.memory.idActiveSource == null){
                creep.memory.idActiveSource = defineFreeSource(creep);
            } else {
                goToSource(creep, creep.memory.idActiveSource);
            }
        }
    }
}

module.exports = roleUpgrader;