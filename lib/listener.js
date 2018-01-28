'use strict';



var Listener = EventEmitter;
Listener.prototype.on('entered', (task, instance) => {
  console.log(`${task.type} <${task.id}> of ${instance.id} is entered`);
});

module.exports = Listener;