const Observable = require('../../utils/Observable');



class Curtain extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'closed')   // observable
    }
    open (c) {
        this.status = 'opened'
        this.house.utilities.electricity.consumption += 1;
        // Include some messages logged on the console!
        console.log('The curtains in ',this.name ,' are opening')
    }
    close (c) {
        this.status = 'closed'
        this.house.utilities.electricity.consumption += 1;
        // Include some messages logged on the console!
        console.log('The curtains in ',this.name ,' are closing')
    }
}



module.exports = Curtain