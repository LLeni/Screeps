var functions = require('usefulFunctions');

var roleBuilder = {
    run: function(creep){
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0){
            creep.memory.building = true;
            creep.say('🚧 build');
        }
        
        
        if(creep.memory.building){
            if(creep.memory.idActiveSource != null){
                addFreeSpaceToSource(creep, creep.memory.idActiveSource);
                creep.memory.idActiveSource = null;
            }
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length == 0){
                if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            if(targets.length){
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
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

module.exports = roleBuilder;