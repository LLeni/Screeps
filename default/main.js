var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

const STANDART_PROPERTIES = [WORK, WORK, CARRY, MOVE]; //300
const HARVESTER_BODY = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]; // 500
const UPGRADER_BODY = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; //500
const BUILDER_BODY = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; // 500


const BEGINNER_LEVEL_NAME = 'BEGINNER';
const INTERMEDIATE_LEVEL_NAME = 'INTERMEDIATE';
const ADVANCED_LEVEL_NAME = 'ADVANCED';


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
const DYING_CREEP_MESSAGE = " said 'Bye Daddy ;c'";


var countHarvesters;
var countUpgraders;
var countBuilders;

module.exports.loop = function(){
    //Очистка из памяти тех крипов, которые на прошлом тике умерли
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            console.log(creep + DYING_CREEP_MESSAGE);
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
    
    chooseCreepToSpawn(Game.rooms['W7S39']);

}

var chooseCreepToSpawn = function(room){
    
    if(room.energyAvailable >= 300){
        var creepLevel;
        var creepRole;
    
        //Определяем какого уровня крип должен быть
        var extensionCount =  room.find(FIND_MY_STRUCTURES, {
           
            filter: { structureType: STRUCTURE_EXTENSION }
        }).length;
    
        if(room.controller.level == 1 || extensionCount < NEED_COUNT_EXTENSIONS_FOR_INTERMEDIATE_CREEP 
            || countHarvesters < 2 || room.energyAvailable < 500){
            creepLevel = BEGINNER_LEVEL_NAME;
        } else {
            creepLevel = INTERMEDIATE_LEVEL_NAME;
        }
        
        
    
        //Определяем роль
        if(countBuilders  < (countUpgraders + countHarvesters) / BUILDERS_N_TIMES_LESS){
            creepRole = BUILDER_ROLE;
        } else {
            if(countHarvesters >= countUpgraders){
                creepRole = UPGRADER_ROLE;
            } else {
                creepRole = HARVESTER_ROLE;
            }
        }
    
        spawnCreep(room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_SPAWN }
        })[0], creepLevel, creepRole);
    }
}

var spawnCreep = function(spawn, creepLevel, creepRole){
    var creepName;
    var creepBody;
    
    if(creepRole == HARVESTER_ROLE) {
        Memory.countExistedHarvesters++;
        creepName = HARVESTER_NAME + Memory.countExistedHarvesters;
        switch(creepLevel){
            case 'BEGINNER':
                creepBody = STANDART_PROPERTIES;
                break;
            case 'INTERMEDIATE':
                creepBody = HARVEST_BODY;
                break;
            case 'ADVANCED':
                creepBody = ADVANCED_HARVEST_BODY;
                break;
        }
    }
    
    if(creepRole == UPGRADER_ROLE) {
         Memory.countExistedUpgraders++;
         creepName = UPGRADER_NAME + Memory.countExistedUpgraders;
         switch(creepLevel){
            case 'BEGINNER':
                creepBody = STANDART_PROPERTIES;
                break;
            case 'INTERMEDIATE':
                creepBody = UPGRADER_BODY;
                break;
            case 'ADVANCED':
                creepBody = ADVANCED_UPGRADER_BODY;
                break;
        }
    }
    
    if(creepRole == BUILDER_ROLE) { 
         Memory.countExistedBuilders++;
         creepName = BUILDER_NAME + Memory.countExistedBuilders;
         switch(creeplevel){
            case 'BEGINNER':
                creepBody = STANDART_PROPERTIES;
                break;
            case 'INTERMEDIATE':
                creepBody = BUILDER_BODY;
                break;
            case 'ADVANCED':
                creepBody = ADVANCED_BUILDER_BODY;
                break;
        }
    }
    
    spawn.spawnCreep(creepBody, creepName, {memory : {role: creepRole}});
    showCountCreeps();
}

var showCountCreeps = function(){
    console.log('-------------------------------');
    console.log('Количество сборщиков:   ' + countHarvesters);
    console.log('Количество улучшателей: ' + countUpgraders);
    console.log('Количество строителей:  ' + countBuilders);
    console.log('-------------------------------');
}