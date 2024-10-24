playsound portal.travel @a[tag=portal] ~~~

structure load mystructure:portal_1 -10000 200 -10000

tp @a[tag=portal] -10000 225 -10000
effect @a[tag=portal] slow_falling 15 255 true
effect @a[tag=portal] blindness 10 255 true

tp @e[type=013:teleporter] -10000 210 -10000
tp @e[type=013:generator] -10000 210 -10000

tag @a[tag=portal] add generate_dimension_1
tag @a[tag=portal] remove portal