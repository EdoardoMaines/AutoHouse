const Observable = require('../../utils/Observable');



class Alarm extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;
        this.hh;          // non-observable
        this.mm
        this.set('status', 'non_set')   // observable
    }
    setAlarm (hh, mm) {
        this.status = 'set'
        this.hh = hh
        this.mm = mm
        this.house.utilities.electricity.consumption += 1;
        // Include some messages logged on the console!
    }
}

module.exports = Alarm