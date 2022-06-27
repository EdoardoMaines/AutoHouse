const Observable = require('../../utils/Observable');



class CoffeeMachine extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status_machine', 'off')   // observable
        this.set('status_coffee', 'not_ready')   // observable
    }
    turnOn (m) {
        this.status_machine = 'on'
        this.house.utilities.electricity.consumption += 1;
        // Include some messages logged on the console!
        console.log(this.name, ' turned on')
    }
    turnOff (m) {
        this.status_machine = 'off'
        this.house.utilities.electricity.consumption -= 1;
        // Include some messages logged on the console!
        console.log(this.name, ' turned off')
    }
    start(m) {
        this.house.utilities.electricity.consumption += 1;
        console.log('Coffee in preparation')
        // Include some messages logged on the console!
        // console.log('Coffee is in preparation! It will takes 5 minutes')
        // setTimeout(console.log)
    }

    stop(m) {
        this.status_coffee = 'ready'
        this.house.utilities.electricity.consumption -= 1;
        console.log('Coffee is ready')
    }
}



module.exports = CoffeeMachine