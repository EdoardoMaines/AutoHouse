const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const CoffeeMachine = require ('../devices/CoffeeMachine');



class SenseCoffeeGoal extends Goal {

    constructor (coffeeMachine) {
        super()

        /** @type {CoffeeMachine} coffeeMachine */
        this.coffeeMachine = coffeeMachine

    }

}



class SenseCoffeeIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)

        /** @type {CoffeeMachine} coffeeMachine */
        this.coffeeMachine = this.goal.coffeeMachine
    }

    static applicable (goal) {
        return goal instanceof SenseCoffeeGoal
    }

    *exec () {
        while (true) {
            
                let status_machine = yield this.coffeeMachine.notifyChange('status_machine')                
                this.log('sense: ' + this.coffeeMachine.name + ' is ' + status_machine)

                this.coffeeMachine.start()

                this.coffeeMachine.stop()

                let status_coffee = yield this.coffeeMachine.notifyChange('status_coffee')
                this.log('sense: coffee is ' + status_coffee)
        }
    }

}



module.exports = {SenseCoffeeGoal, SenseCoffeeIntention}