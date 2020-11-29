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

const CHECK_CREEPS_FOR_DYING_UNDER_N_TICKS = 1;
const DYING_CREEP_MESSAGE = "Bye Daddy ;c";


var countHarvesters;
var countUpgraders;
var countBuilders;

module.exports.loop = function(){
    //Очистка из памяти тех крипов, которые на прошлом тике умерли
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            console.log(creep + " - умер ");
            delete Memory.creeps[i];
            
        }
    }
    
    //Каждая 50 доступная энергия в комнатах провоцирует вывод текущего количества
    for(var name in Game.rooms){
        if(Game.rooms[name].energyAvailable % 50 == 0){
             console.log('Room "'+name+'" has '+ Game.rooms[name].energyAvailable+' energy');
        }
    }
    
    //Для определенной роли запускаем свой скрипт
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
    
    
    //Подсчет количества крипов
    countHarvesters = _.filter(Game.creeps, function(creep){
        if(creep.memory.role == HARVESTER_ROLE){
            return creep;
        } 
    }).length;
    countUpgraders = _.filter(Game.creeps, function(creep){
        if(creep.memory.role == UPGRADER_ROLE){
            return creep;
        } 
    }).length;
    countBuilders = _.filter(Game.creeps, function(creep){
        if(creep.memory.role == BUILDER_ROLE){
            return creep;
        } 
    }).length;
    


    var extensionCount = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    }).length;
    
    
    //Спавн крипов
    if(extensionCount < NEED_COUNT_EXTENSIONS_FOR_INTERMEDIATE_CREEP || Memory.countHarvesters < 2 || Game.rooms['W7S39'].controller.level == 1){
        if(Game.rooms['W7S39'].energyAvailable >= NEEDED_COUNT_ENERGY_FOR_BASIC_CREEP){
            if(Memory.countBuilders < (Memory.countUpgraders + Memory.countHarvesters) / BUILDERS_N_TIMES_LESS){
                Memory.countExistedBuilders++;;
                Game.spawns['Spawn1'].spawnCreep(STANDART_PROPERTIES,BUILDER_NAME+Memory.countExistedBuilders, { memory: {role: BUILDER_ROLE}});
                showCountCreeps();
            } else {
                if(Memory.countUpgraders >= Memory.countHarvesters){
                    Memory.countExistedHarvesters++;
                    Game.spawns['Spawn1'].spawnCreep(STANDART_PROPERTIES,HARVESTER_NAME+Memory.countExistedHarvesters, { memory: {role: HARVESTER_ROLE}});
                    showCountCreeps();
                    
                } else {
                    Memory.countExistedUpgraders++;
                    Game.spawns['Spawn1'].spawnCreep(STANDART_PROPERTIES,UPGRADER_NAME+Memory.countExistedUpgraders, { memory: {role: UPGRADER_ROLE}});
                    showCountCreeps();
                    
                }
            }
        }
    } else {
        if(Game.spawns['Spawn1'].room.energyAvailable >= NEEDED_COUNT_ENERGY_FOR_INTERMEDIATE_CREEP){
            if(Memory.countBuilders < (Memory.countUpgraders + Memory.countHarvesters) / BUILDERS_N_TIMES_LESS){
                Memory.countExistedBuilders++;
                Game.spawns['Spawn1'].spawnCreep(BUILDER_BODY,BUILDER_NAME+Memory.countExistedBuilders, { memory: {role: BUILDER_ROLE}});
                showCountCreeps();
            } else {
                if(Memory.countUpgraders > Memory.countHarvesters){
                    Memory.countExistedHarvesters++;
                    Game.spawns['Spawn1'].spawnCreep(HARVESTER_BODY,HARVESTER_NAME+Memory.countExistedHarvesters, { memory: {role: HARVESTER_ROLE}});
                    showCountCreeps();
                    
                } else {
                    Memory.countExistedUpgraders++;
                    Game.spawns['Spawn1'].spawnCreep(UPGRADER_BODY,UPGRADER_NAME+Memory.countExistedUpgraders, { memory: {role: UPGRADER_ROLE}});
                    showCountCreeps();
                }
            }
        }
    }
}

var showCountCreeps = function(){
    console.log('-------------------------------');
    console.log('Количество сборщиков:   ' + countHarvesters);
    console.log('Количество улучшателей: ' + countUpgraders);
    console.log('Количество строителей:  ' + countBuilders);
    console.log('-------------------------------');
}