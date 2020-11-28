//TODO: I have 301 высвечивается
//FIXME: Сложная система определения свободных мест. Да и то, работает странно

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

const STANDART_PROPERTIES = [WORK, WORK, CARRY, MOVE]; //300
const HARVESTER_BODY = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]; // 500
const UPGRADER_BODY = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; //500
const BUILDER_BODY = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; // 500


const HARVESTER_NAME = 'Harvester';
const UPGRADER_NAME = 'Upgrader';
const BUILDER_NAME = 'Builder';

const HARVESTER_ROLE = 'harvester';
const UPGRADER_ROLE = 'upgrader';
const BUILDER_ROLE = 'builder';

const NEEDED_COUNT_ENERGY_FOR_BASIC_CREEP = 300;
const NEEDED_COUNT_ENERGY_FOR_INTERMEDIATE_CREEP = 500;

const NEED_COUNT_EXTENSIONS_FOR_INTERMEDIATE_CREEP = 4; //300 + 200

const BUILDERS_N_TIMES_LESS = 4;
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
        if(creep.memory.role == HARVESTER_ROLE) {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == UPGRADER_ROLE) {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == BUILDER_ROLE) {
            roleBuilder.run(creep);
        }
    }
    //TODO: переписать нижерасположенный if
    //Чтобы действительно учитывалось количество ТЕКУЩИХ крипов
    var extensionCount = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    }).length;
    if(extensionCount < NEED_COUNT_EXTENSIONS_FOR_INTERMEDIATE_CREEP){
        if(Game.spawns['Spawn1'].energy >= NEEDED_COUNT_ENERGY_FOR_BASIC_CREEP){
            if(Memory.countBuilders < (Memory.countUpgraders + Memory.countHarvesters) / BUILDERS_N_TIMES_LESS){
                Memory.countBuilders++;
                Game.spawns['Spawn1'].spawnCreep(STANDART_PROPERTIES,BUILDER_NAME+Memory.countBuilders, { memory: {role: BUILDER_ROLE}});
                
            } else {
                if(Memory.countUpgraders > Memory.countHarvesters){
                    Memory.countHarvesters++;
                    Game.spawns['Spawn1'].spawnCreep(STANDART_PROPERTIES,HARVESTER_NAME+Memory.countHarvesters, { memory: {role: HARVESTER_ROLE}});
                } else {
                    Memory.countUpgraders++;
                    Game.spawns['Spawn1'].spawnCreep(STANDART_PROPERTIES,UPGRADER_NAME+Memory.countUpgraders, { memory: {role: UPGRADER_ROLE}});
                }
            }
        }
    } else {
        if(Game.spawns['Spawn1'].room.energyAvailable >= NEEDED_COUNT_ENERGY_FOR_INTERMEDIATE_CREEP){
            if(Memory.countBuilders < (Memory.countUpgraders + Memory.countHarvesters) / BUILDERS_N_TIMES_LESS){
                Memory.countBuilders++;
                Game.spawns['Spawn1'].spawnCreep(BUILDER_BODY,BUILDER_NAME+Memory.countBuilders, { memory: {role: BUILDER_ROLE}});
                
            } else {
                if(Memory.countUpgraders > Memory.countHarvesters){
                    Memory.countHarvesters++;
                    Game.spawns['Spawn1'].spawnCreep(HARVESTER_BODY,HARVESTER_NAME+Memory.countHarvesters, { memory: {role: HARVESTER_ROLE}});
                } else {
                    Memory.countUpgraders++;
                    Game.spawns['Spawn1'].spawnCreep(UPGRADER_BODY,UPGRADER_NAME+Memory.countUpgraders, { memory: {role: UPGRADER_ROLE}});
                }
            }
        }
    }
}