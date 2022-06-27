;; domain file: domain-a3.pddl
(define (domain a3)
    (:requirements :strips)
    (:predicates
        (room ?room)
        (is-dirty ?room)
        (robot ?robot)
        (in ?room ?robot)
        (linked ?from ?to)              
    )
    
        (:action Clean
            :parameters (?room ?robot)
            :precondition (and
                (room ?room)
                (is-dirty ?room)
                (robot ?robot)
                (in ?room ?robot)
            )
            :effect (and
                (not (is-dirty ?room))
                (in ?room ?robot)
            )
        )
        
        (:action Move
            :parameters (?from ?robot ?to)
            :precondition (and
                (room ?from)
                (room ?to)
                (robot ?robot)
                (not (in ?to ?robot))
                (in ?from ?robot)
                (linked ?from ?to)
            )
            :effect (and
                (in ?to ?robot)
                (not (in ?from ?robot))
            )
        )
)