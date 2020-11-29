var functions = require('usefulFunctions');

var roleHarvester = {
    run: function(creep){
        if(creep.store.getFreeCapacity() > 0){
            if(creep.memory.idActiveSource == null){
                creep.memory.idActiveSource = defineFreeSource(creep);
            } else {
                goToSource(creep, creep.memory.idActiveSource);
            }
        } else {
            if(creep.memory.idActiveSource != null){
                addFreeSpaceToSource(creep, creep.memory.idActiveSource);
                creep.memory.idActiveSource = null;
            }
        
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0){
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
}

module.exports = roleHarvester;