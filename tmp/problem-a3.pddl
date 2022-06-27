;; problem file: problem-a3.pddl
(define (problem a3)
    (:domain a3)
    (:objects kitchen corridor bathroom living_room bedroom entrance_hall a3)
	(:init (room kitchen) (room corridor) (room bathroom) (room living_room) (room bedroom) (room entrance_hall) (linked kitchen entrance_hall) (linked entrance_hall kitchen) (linked entrance_hall living_room) (linked living_room entrance_hall) (linked entrance_hall corridor) (linked corridor entrance_hall) (linked bathroom corridor) (linked corridor bathroom) (linked bedroom corridor) (linked corridor bedroom) (robot a3) (is-dirty corridor) (is-dirty entrance_hall) (is-dirty kitchen) (in corridor a3))
	(:goal (and (not(is-dirty bedroom)) (not(is-dirty bathroom)) (not(is-dirty living_room)) (not(is-dirty kitchen)) (not(is-dirty corridor))))
)
