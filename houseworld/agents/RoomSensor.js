const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Clock = require('../../utils/Clock');
const Person = require ('../person/Person');



class SenseRoomGoal extends Goal {

    constructor (persons = []) {
        super()

        /** @type {Array<Person>} persons */
        this.persons = persons

    }

}



class SenseRoomIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)

        /** @type {Array<Person>} persons */
        this.persons = this.goal.persons
    }

    static applicable (goal) {
        return goal instanceof SenseRoomGoal
    }

    *exec () {
        var personsGoals = []
        for (let person of this.persons) {
            
            let peopleGoalPromise = new Promise( async res => {
                while (true) {
                    let pre_room = person.in_room
                    
                    let room = await person.notifyChange('in_room')
                    this.log('sense: ' + person.name + ' has entered in ' + room, ' from ', pre_room)

                    this.log('sense: in ', room , ' there are: ', person.house.rooms[room].nr_ppl, ' person and in ', pre_room , ' there are: ', person.house.rooms[pre_room].nr_ppl, ' person!')

                    if (room != 'outside') {
                        if (person.house.devices[room+'_light'].status == 'off' && Clock.global.hh >= 19) {
                            person.house.devices[room+'_light'].switchOnLight()
                        }
                    }
                    if (pre_room != 'outside') {
                        if(person.house.rooms[pre_room].nr_ppl == 0 && person.house.devices[pre_room+'_light'].status == 'on') {
                            person.house.devices[pre_room+'_light'].switchOffLight()
                        }
                    }
                    

                    //PARTY DETECTOR IN THE LIVING ROOM: 6 People (impossible in corridor: too small)
                    
                    if (person.house.rooms['living_room'].nr_ppl == 6) {
                        this.log('sense: Time to turn off the lights and close the curtains. LET\'S PARTY!! In living_room there are: ', person.house.rooms['living_room'].nr_ppl, ' people.')
                        if(person.house.devices['living_room_light'].status == 'on') {
                            //Turning off the light
                            person.house.devices['living_room_light'].switchOffLight()

                            //Closing curtain
                            if(person.house.devices['living_room_curtain'].status == 'opened') {
                                person.house.devices['living_room_curtain'].close()
                            }
                        }
                    }

                    //USING BATHROOM --> MORE PRIVACY

                    //enter in the bathroom
                    if (person.house.rooms[room].name == 'bathroom' && person.house.rooms[room].privacy_mode == 'on') {
                        this.log('sense:', person.name, ' is now using the bathroom. More privacy!')
                        if(person.house.devices[room +'_curtain'].status == 'opened') {
                            person.house.devices[room +'_curtain'].close()
                        }
                    }
                    //get out of the bathroom
                    if (person.house.rooms[pre_room].name == 'bathroom' && person.house.rooms[pre_room].nr_ppl == 0 && person.house.rooms[pre_room].privacy_mode == 'on') {
                        this.log('sense: No more privacy for ', person.name)
                        if(person.house.devices[pre_room +'_curtain'].status == 'closed') {
                            person.house.devices[pre_room +'_curtain'].open()
                        }
                    } 
                    
                    
                }
            });
            personsGoals.push(peopleGoalPromise)
        }
        yield Promise.all(personsGoals)
    }
}



module.exports = {SenseRoomGoal, SenseRoomIntention}