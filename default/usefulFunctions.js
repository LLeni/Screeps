
global.defineFreeSource = function(creep){
    //Пока только среди двух
    
    var sources= creep.room.find(FIND_SOURCES);
    if(Memory.countFreeSpaceNextToFirstSource == 0) {
        if(Memory.countFreeSpaceNextToSecondSource != 0){
            Memory.countFreeSpaceNextToSecondSource--;
        }
        return sources[1].id;
    }
    
    if(Memory.countFreeSpaceNextToSecondSource == 0){
        if(Memory.countFreeSpaceNextToFirstSource != 0){
            Memory.countFreeSpaceNextToFirstSource--;
        }
        return sources[0].id;
    }
    
    
    if(Memory.countFreeSpaceNextToFirstSource != 0){
        Memory.countFreeSpaceNextToFirstSource--;
    }
   

    return sources[0].id;
        

}
    
global.goToSource = function(creep, idSource){
       var curSource = Game.getObjectById(idSource);
       // console.log(creep.id + ': I go to '+idSource+' source');
    if(creep.harvest(curSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(curSource, {visualizePathStyle: {stroke: '#ffaa00'}});
           
    }
}

global.addFreeSpaceToSource = function(creep, idSource){
    var sources = creep.room.find(FIND_SOURCES);
    
    if(sources[0].id ==  idSource) {
        if(Memory.countFreeSpaceNextToFirstSource < 2){
            Memory.countFreeSpaceNextToFirstSource++;
        }
    } else {
        if(Memory.countFreeSpaceNextToSecondSource < 2){
            Memory.countFreeSpaceNextToSecondSource++;
        }
    }
}
