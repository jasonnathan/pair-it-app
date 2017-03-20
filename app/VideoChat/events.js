'use strict';

const events = require('events');
const eventEmitter = new events.EventEmitter();
const _ = require('lodash');

const suscribed = {};

function suscribe (fnName, fn, originModule){
  //Avoid various suscriptions with the same origin
    if (!suscribed[fnName]){
        suscribed[fnName] = {};
        suscribed[fnName][originModule] = fn;
    } else if (!suscribed[fnName][originModule]){
        suscribed[fnName][originModule] = fn;
    } else {
      //See if ignore the new suscription or replace the old one
      return;
    }
    eventEmitter.on(fnName, fn);
}

function resetSuscriptions(){
    _.forIn(suscribed, function(itemValue, fnName){
        _.forIn(itemValue, function(suscribedFunction){
            eventEmitter.removeListener(fnName,suscribedFunction);
        });
    });
}


function trigger(fnName, args){
    eventEmitter.emit(fnName, args);
}

module.exports = {
    suscribe : suscribe,
    trigger: trigger
}