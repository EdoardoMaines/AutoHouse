const Beliefset = require('../../bdi/Beliefset')
const Clock = require('../../utils/Clock')
const Agent = require('../../bdi/Agent')
const { SenseAlarmGoal, SenseAlarmIntention } = require('../agents/AlarmSensor')
const { SenseRoomGoal, SenseRoomIntention } = require('../agents/RoomSensor')
const { SenseCoffeeGoal, SenseCoffeeIntention } = require('../agents/CoffeeSensor')
const { SenseNightGoal, SenseNightIntention } = require('../agents/NightSensor')
const { SenseExternalGoal, SenseExternalIntention } = require('../agents/ExternalSensor')
const { SenseCurtainsGoal, SenseCurtainsIntention } = require('../agents/CurtainSensor')
const { SenseTemperatureGoal, SenseTemperatureIntention } = require('../agents/TemperatureSensor')
const { SenseSolarPanelGoal, SenseSolarPanelIntention } = require('../agents/SolarPanelSensor')
const { SenseStorageColumnGoal, SenseStorageColumnIntention } = require('../agents/StorageColumnSensor')

const pddlActionIntention = require('../../pddl/actions/pddlActionIntention')
const FakeAction = require('../../bdi/FakeAction')
const PlanningGoal = require('../../pddl/PlanningGoal')
const setup = require('../../pddl/OnlinePlanner')
const Goal = require('../../bdi/Goal')
const Intention = require('../../bdi/Intention')

const House = require('../house/House')

const world = new Agent('world');

// House, which includes rooms and devices
var myHouse = new House()

// Agents
class Clean extends FakeAction {
    static parameters = ['room', 'robot']
    static precondition = [['is-dirty', 'room'], ['in', 'room', 'robot']]
    static effect = [['not is-dirty', 'room'], ['in', 'room', 'robot']]
}

class Move extends FakeAction {
    static parameters = ['from', 'robot', 'to']
    static precondition = [['not in', 'to', 'robot'], ['in', 'from', 'robot'], ['linked', 'from', 'to']]
    static effect = [['in', 'to', 'robot'], ['not in', 'from', 'robot']]
}

world.Clean = async function ({ room, robot } = args) {
    this.log('Clean', room, robot)
    myHouse.utilities.electricity.consumption += 1
    this.log('energy consumption', myHouse.utilities.electricity.consumption)

    // await new Promise( res => setTimeout(res, 5000) )
    return new Clean(world, { room, robot }).checkPreconditionAndApplyEffect()
        .catch(err => { this.error('world.Clean failed:', err.message || err); throw err; })
}

world.Move = async function ({ from, robot, to } = args) {
    this.log('Move', from, robot, to)
    myHouse.utilities.electricity.consumption += 1
    this.log('energy consumption', myHouse.utilities.electricity.consumption)
    return new Move(world, { from, robot, to }).checkPreconditionAndApplyEffect()
        .catch(err => { this.error('world.Move failed:', err.message || err); throw err; })
}


{
    class CleanGoal extends Goal { }
    class Clean extends pddlActionIntention {
        static parameters = ['room', 'robot']
        static precondition = [['room', 'room'], ['is-dirty', 'room'], ['robot', 'robot'], ['in', 'room', 'robot']]
        static effect = [['not is-dirty', 'room'], ['in', 'room', 'robot']]
        static applicable(goal) {
            return goal instanceof CleanGoal
        }
        *exec({ room, robot } = parameters) {
            if (robot == this.agent.name)
                yield world.Clean({ room, robot })
            else
                yield MessageDispatcher.authenticate(this.agent).sendTo(robot, new CleanGoal({ room, robot }))
        }
    }

    class MoveGoal extends Goal { }
    class Move extends pddlActionIntention {
        static parameters = ['from', 'robot', 'to']
        static precondition = [['room', 'from'], ['room', 'to'], ['robot', 'robot'], ['not in', 'to', 'robot'], ['in', 'from', 'robot'], ['linked', 'from', 'to']]
        static effect = [['in', 'to', 'robot'], ['not in', 'from', 'robot']]
        static applicable(goal) {
            return goal instanceof MoveGoal
        }
        *exec({ from, robot, to } = parameters) {
            if (robot == this.agent.name) {
                yield world.Move({ from, robot, to })
            }
            else
                yield MessageDispatcher.authenticate(this.agent).sendTo(robot, new MoveGoal({ from, robot, to }))
        }
    }

    class RetryGoal extends Goal { }
    class RetryFourTimesIntention extends Intention {
        static applicable(goal) {
            return goal instanceof RetryGoal
        }
        *exec({ goal } = parameters) {
            //Clock.stopTimer()
            for (let i = 0; i < 4; i++) {
                let goalAchieved = yield this.agent.postSubGoal(goal)
                if (goalAchieved)
                    return;
                this.log('wait for something to change on beliefset before retrying for the ' + (i + 2) + 'th time goal', goal.toString())
                yield this.agent.beliefs.notifyAnyChange()
            }
            //Clock.startTimer()
        }
    }

    var sensor = (agent) => (value, key, observable) => {
        value ? agent.beliefs.declare(key) : agent.beliefs.undeclare(key)
    }

    let { OnlinePlanning } = require('../../pddl/OnlinePlanner')([Clean, Move])


    let cleaner = new Agent('a3')
    world.beliefs.observeAny(sensor(cleaner))
    var myAgent = new Agent('myAgent')

    //INTENSIONS
    myAgent.intentions.push(SenseAlarmIntention)
    myAgent.intentions.push(SenseRoomIntention)
    myAgent.intentions.push(SenseCoffeeIntention)
    myAgent.intentions.push(SenseNightIntention)
    myAgent.intentions.push(SenseExternalIntention)
    myAgent.intentions.push(SenseCurtainsIntention)
    myAgent.intentions.push(SenseTemperatureIntention)
    myAgent.intentions.push(SenseSolarPanelIntention)
    myAgent.intentions.push(SenseStorageColumnIntention)


    myHouse.people.luca.setAlarm(9, 30)
    myHouse.people.anna.setAlarm(9, 45)
    myHouse.people.luca.setTemperature(22)

    //SUBGOALS
    myAgent.postSubGoal(new SenseAlarmGoal(myHouse.devices['alarm_luca']))
    myAgent.postSubGoal(new SenseAlarmGoal(myHouse.devices['alarm_anna']))

    myAgent.postSubGoal(new SenseRoomGoal([myHouse.people.luca, myHouse.people.anna]))
    myAgent.postSubGoal(new SenseCoffeeGoal(myHouse.devices['coffee_machine']))
    myAgent.postSubGoal(new SenseNightGoal(myHouse))
    myAgent.postSubGoal(new SenseExternalGoal(myHouse))
    myAgent.postSubGoal(new SenseCurtainsGoal(myHouse))
    myAgent.postSubGoal(new SenseTemperatureGoal(myHouse.devices['thermostat']))
    myAgent.postSubGoal(new SenseSolarPanelGoal(myHouse.devices['solar_panel']))
    myAgent.postSubGoal(new SenseStorageColumnGoal(myHouse.devices['storage_column']))

    cleaner.intentions.push(Clean, Move)
    cleaner.intentions.push(OnlinePlanning)
    cleaner.intentions.push(RetryFourTimesIntention)

    // beliefs for the world

    //objects
    world.beliefs.declare('room kitchen')
    world.beliefs.declare('room corridor')
    world.beliefs.declare('room bathroom')
    world.beliefs.declare('room living_room')
    world.beliefs.declare('room bedroom')
    world.beliefs.declare('room entrance_hall')


    world.beliefs.declare('linked kitchen entrance_hall')
    world.beliefs.declare('linked entrance_hall kitchen')

    world.beliefs.declare('linked entrance_hall living_room')
    world.beliefs.declare('linked living_room entrance_hall')

    world.beliefs.declare('linked entrance_hall corridor')
    world.beliefs.declare('linked corridor entrance_hall')

    world.beliefs.declare('linked bathroom corridor')
    world.beliefs.declare('linked corridor bathroom')

    world.beliefs.declare('linked bedroom corridor')
    world.beliefs.declare('linked corridor bedroom')

    world.beliefs.declare('robot a3')

    //init initial position of the robot
    world.beliefs.declare('in kitchen a3')


    // Simulated Daily/Weekly schedule
    Clock.global.observe('mm', (mm) => {
        var time = Clock.global

        if (time.hh == 9 && time.mm == 45) {
            myHouse.people.luca.moveTo('corridor')
            world.beliefs.declare('is-dirty corridor')

        }
        if (time.hh == 10 && time.mm == 00) {
            myHouse.people.luca.moveTo('entrance_hall')
            myHouse.people.anna.moveTo('corridor')
            world.beliefs.declare('is-dirty entrance_hall')
        }
        if (time.hh == 10 && time.mm == 15) {
            myHouse.people.luca.moveTo('kitchen')
            myHouse.people.anna.moveTo('entrance_hall')
            world.beliefs.declare('is-dirty kitchen')
        }
        if (time.hh == 10 && time.mm == 30) {
            myHouse.people.anna.moveTo('kitchen')
        }
        if (time.hh == 11 && time.mm == 00) {
            myHouse.people.luca.moveTo('entrance_hall')
            myHouse.people.anna.moveTo('entrance_hall')
        }
        if (time.hh == 11 && time.mm == 15) {
            myHouse.people.luca.moveTo('living_room')
            myHouse.people.anna.moveTo('living_room')
            world.beliefs.declare('is-dirty living_room')
        }
        if (time.hh == 13 && time.mm == 00) {
            myHouse.people.luca.moveTo('entrance_hall')
            myHouse.people.anna.moveTo('entrance_hall')
        }
        if (time.hh == 13 && time.mm == 15) {
            myHouse.people.luca.moveTo('kitchen')
            myHouse.people.anna.moveTo('kitchen')

        }
        if (time.hh == 15 && time.mm == 15) {
            myHouse.people.luca.moveTo('entrance_hall')
            myHouse.people.anna.moveTo('entrance_hall')
        }
        if (time.hh == 15 && time.mm == 30) {
            myHouse.people.luca.moveTo('living_room')
            myHouse.people.anna.moveTo('living_room')
        }
        if (time.hh == 17 && time.mm == 00) {
            myHouse.people.luca.moveTo('entrance_hall')
            myHouse.people.anna.moveTo('entrance_hall')

            console.log('Five Luca\'s friends have arrived')



        }
        if (time.hh == 17 && time.mm == 15) {

            // modification of the parameter nr_ppl = 5
            myHouse.rooms['living_room'].nr_ppl = 5
            myHouse.people.luca.moveTo('living_room')
        }
        if (time.hh == 17 && time.mm == 30) {
            myHouse.people.anna.moveTo('living_room')
        }
        if (time.hh == 20 && time.mm == 30) {
            myHouse.people.luca.moveTo('entrance_hall')
            myHouse.people.anna.moveTo('entrance_hall')

            console.log('Five Luca\'s friends are gone')
            myHouse.rooms['living_room'].nr_ppl = 0
        }
        if (time.hh == 20 && time.mm == 45) {
            myHouse.people.luca.moveTo('corridor')
            myHouse.people.anna.moveTo('corridor')
        }
        if (time.hh == 21 && time.mm == 00) {
            myHouse.people.luca.moveTo('bathroom')
            myHouse.people.anna.moveTo('bathroom')
            world.beliefs.declare('is-dirty bathroom')
        }
        if (time.hh == 21 && time.mm == 15) {
            myHouse.people.luca.moveTo('corridor')
            myHouse.people.anna.moveTo('corridor')
        }
        if (time.hh == 21 && time.mm == 30) {
            myHouse.people.luca.moveTo('bedroom')
            myHouse.people.anna.moveTo('bedroom')
        }
        if (time.hh == 22 && time.mm == 00) {
            cleaner.postSubGoal(new PlanningGoal({ goal: ['not(is-dirty bedroom)', 'not(is-dirty bathroom)', 'not(is-dirty living_room)', 'not(is-dirty kitchen)', 'not(is-dirty corridor)'] }))  // try to achieve the PlanningGoal for 4 times
        }
        if (time.hh == 23 && time.mm == 00) {
            myHouse.people.luca.turnOffLight('bedroom')
        }
    })

    // Start clock
    Clock.startTimer()
}