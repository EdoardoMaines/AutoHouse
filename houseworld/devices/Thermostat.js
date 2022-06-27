const Observable = require('../../utils/Observable');



class Thermostat extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.temp_set;
        this.temperature = 15;

    }
    increaseTemp (temp) {
        this.temperature += temp        
    }
    
    decreaseTemp (temp) {
        this.temperature -= temp        
    }

    setTemp (temp) {
        this.temp_set = temp
    }
}



module.exports = Thermostat