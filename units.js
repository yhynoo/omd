const units = {
    'depot': {
        'name': 'Depot',
        'commands': 'S: solar ($5), T: turret ($10), W: workshop ($15)',
        'cost': [0, 0],
        'maxHealth': 15,
        'range': 24,
        'representation': "'==",
        'isBuilding': true,
        'margin': 2
    },
    'workshop': {
        'name': 'Workshop',
        'commands': 'D: drone ($10, *5), L: l. veh. ($15, *5), H: h. veh. ($25, *15)',
        'cost': [15, 0],
        'maxHealth': 10,
        'representation': "^^'",
        'isBuilding': true,
        'margin': 2
    },
    'solar': {
        'name': 'Solar panel',
        'commands': '',
        'cost': [5, 0],
        'maxHealth': 5,
        'representation': '#',
        'isBuilding': true,
        'margin': 1
    },
    'turret': {
        'name': 'Turret',
        'commands': 'A: attack (*1)',
        'cost': [10, 0],
        'damage': [2, 3],
        'range': 15,
        'maxHealth': 10,
        'representation': '*',
        'isBuilding': true,
        'margin': 1
    },
    'human': {
        'name': 'Astronaut',
        'commands': 'A: attack',
        'cost': [0, 0],
        'damage': [2, 3],
        'range': 12,
        'speed': 3,     // this works reversed: the lower the number, the faster the unit.
        'maxHealth': 5,
        'representation': 'o',
        'isBuilding': false,
        'margin': 1
    },
    'drone': {
        'name': 'Drone',
        'commands': 'A: attack',
        'cost': [10, 5],
        'damage': [0, 3],
        'range': 6,
        'speed': 1,
        'maxHealth': 5,
        'representation': 'x',
        'isBuilding': false,
        'margin': 1
    },
    'light': {
        'name': 'Light vehicle',
        'commands': 'A: attack',
        'cost': [15, 5],
        'damage': [2, 3],
        'range': 12,
        'speed': 2,
        'maxHealth': 10,
        'representation': "'",
        'isBuilding': false,
        'margin': 1
    },
    'heavy': {
        'name': 'Heavy vehicle',
        'commands': 'A: attack',
        'cost': [25, 15],
        'damage': [3, 5],
        'range': 12,
        'speed': 3,
        'maxHealth': 15,
        'representation': '"',
        'isBuilding': false,
        'margin': 1
    }
};
