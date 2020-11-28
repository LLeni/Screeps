//TODO: I have 301 высвечивается
//FIXME: Сложная система определения свободных мест. Да и то, работает странно

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

const STANDART_PROPERTIES = [WORK, WORK, CARRY, MOVE]; //300
const HARVEST_BODY = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]; // 500
const UPGRADER_BODY = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; //500
const BUILDER_BODY = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; // 500

module.exports.loop = function(){
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    
    for(var name in Game.rooms){
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    }
    for(var name in Game.spawns){
       Game.spawns[name].room.visual.text(
        'I have '+ (Game.spawns[name].energy+1) + ' en.',
        Game.spawns[name].pos.x - 1,
        Game.spawns[name].pos.y - 2,
        {align: 'left', opacity: 0.4});
    }
    
    
    
    for(var name in Game.creeps){
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
    //TODO: переписать нижерасположенный if
    //Чтобы действительно учитывалось количество ТЕКУЩИХ крипов
    var extensionCount = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    }).length;
    if(extensionCount < 4){
        if(Game.spawns['Spawn1'].energy >= 300){
            if(Memory.countBuilders < (Memory.countUpgraders + Memory.countHarvesters) / 4){
                Memory.countBuilders++;
                Game.spawns['Spawn1'].spawnCreep(STANDART_PROPERTIES,'Builder'+Memory.countBuilders, { memory: {role: 'builder'}});
                
            } else {
                if(Memory.countUpgraders > Memory.countHarvesters){
                    Memory.countHarvesters++;
                    Game.spawns['Spawn1'].spawnCreep(STANDART_PROPERTIES,'Harvester'+Memory.countHarvesters, { memory: {role: 'harvester'}});
                } else {
                    Memory.countUpgraders++;
                    Game.spawns['Spawn1'].spawnCreep(STANDART_PROPERTIES,'Upgrader'+Memory.countUpgraders, { memory: {role: 'upgrader'}});
                }
            }
        }
    } else {
        if(Game.spawns['Spawn1'].room.energyAvailable >= 500){
            if(Memory.countBuilders < (Memory.countUpgraders + Memory.countHarvesters) / 4){
                Memory.countBuilders++;
                Game.spawns['Spawn1'].spawnCreep(BUILDER_BODY,'Builder'+Memory.countBuilders, { memory: {role: 'builder'}});
                
            } else {
                if(Memory.countUpgraders > Memory.countHarvesters){
                    Memory.countHarvesters++;
                    Game.spawns['Spawn1'].spawnCreep(HARVESTER_BODY,'Harvester'+Memory.countHarvesters, { memory: {role: 'harvester'}});
                } else {
                    Memory.countUpgraders++;
                    Game.spawns['Spawn1'].spawnCreep(UPGRADER_BODY,'Upgrader'+Memory.countUpgraders, { memory: {role: 'upgrader'}});
                }
            }
        }
    }
}