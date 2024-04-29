const screen = document.getElementsByClassName('screen')[0]

// -- GLOBAL VARIABLES
let currentPlayer = 0
let currentScreenPosition = [0, 0]
let currentAimPosition = null           // for drawing the ! for aiming
let currentTemplatePosition = null
let currentSelectedUnit = null

let isVisible = true
let isTemplating = false
let currentTemplate = null
let isAiming = false
let isCoolingDown = []

let resourceCooldown = 0;
let movesLeft = 30
let mapResources = []
let warningLine = null
let isGameOver = false

// -- view

function centerScreenOn(unitRow, unitCol) {
    // Calculate the new screen position to center the selected unit
    let newScreenRow = Math.max(0, Math.min(unitRow - 12, map.length - 20))
    let newScreenCol = Math.max(0, Math.min(unitCol - 40, map[0].length - 81))

    // Update the current screen position
    currentScreenPosition = [newScreenRow, newScreenCol];
}

function updateInfoPanel() {
    result = `${getUnitInfo()}${getAvailableCommands(currentSelectedUnit)}`
    
    if (isAiming) { result = 'Aiming...' }
    if (isTemplating) { result = `Choosing spot for ${currentTemplate.name}...` }
    if (warningLine) { result = `${warningLine}` }

    return result
}

function moveView(deltaRow, deltaCol) {
    const [currentRow, currentCol] = currentScreenPosition;

    let newScreenRow = Math.min(Math.max(0, currentRow + deltaRow), map.length - 20);
    let newScreenCol = Math.min(Math.max(0, currentCol + deltaCol), map[0].length - 81);

    // Update the current screen position
    currentScreenPosition = [newScreenRow, newScreenCol];
}

function moveAim(deltaRow, deltaCol) {
    const [currentRow, currentCol] = currentAimPosition
    const newRow = currentRow + deltaRow
    const newCol = currentCol + deltaCol

    if (newRow >= 0 && newRow < map.length && newCol >= 1 && newCol < map[0].length - 1 &&
        checkDistance(currentSelectedUnit.position[0], currentSelectedUnit.position[1], newRow, newCol) <= currentSelectedUnit.unitType.range) {
            currentAimPosition = [newRow, newCol]
            centerScreenOn(newRow, newCol)
        }
}

function moveTemplate(deltaRow, deltaCol, type) {
    const [currentRow, currentCol] = currentTemplatePosition;
    const depot = players[currentPlayer].units.find(unit => unit.unitType === units['depot']);

    // Calculate the new position
    const newRow = currentRow + deltaRow;
    const newCol = currentCol + deltaCol;

    // Check if the new position is within the map boundaries and range of the depot
    if (newRow >= 0 && newRow < map.length &&
        newCol >= type.margin && newCol < map[0].length - type.margin &&
        checkDistance(depot.position[0], depot.position[1], newRow, newCol) <= units['depot'].range) {
            currentTemplatePosition = [newRow, newCol];
            centerScreenOn(newRow, newCol)
    }
}

function playExplosion(row, col) {
    document.removeEventListener('keydown', handleKeyDown);

    let originalTerrain = map[row][col]
    let frames = ['.', '*', originalTerrain]
    let frameIndex = 0

    let explosionInterval = setInterval(() => {
        map[row] = map[row].substring(0, col) + frames[frameIndex] + map[row].substring(col + 1)
        updateScreen()
        frameIndex++

        if (frameIndex >= frames.length) {
            clearInterval(explosionInterval)
            document.addEventListener('keydown', handleKeyDown)
        }
    }, 150)
}

function updateScreen() {
    // Status panel
    let playerInfo = (!isVisible || currentSelectedUnit) ? `Player ${currentPlayer + 1}` : ' '.repeat(8)
    //let topPanel = `${playerInfo} ${movesLeft.toString().padStart(2, ' ')} action points left` + ` `.repeat(31) + `$: ${players[currentPlayer].money.toString().padStart(5, ' ')} | *: ${players[currentPlayer].energy.toString().padStart(5, ' ')}\n\n`
    let topPanel = `${playerInfo}` + ` `.repeat(54) + `$: ${players[currentPlayer].money.toString().padStart(5, ' ')} | *: ${players[currentPlayer].energy.toString().padStart(5, ' ')}\n\n`

    // Update the map with unit positions
    let mapWithUnits = updateMapWithUnits(map, players)

    // Include map content from mapWithUnits
    let mapContent = mapWithUnits.slice(currentScreenPosition[0], currentScreenPosition[0] + 20) // Limit the number of rows displayed
    mapContent = mapContent.map(row => row.slice(currentScreenPosition[1], currentScreenPosition[1] + 81)) // Limit the number of characters displayed per row
    let mapPanel = mapContent.join('\n') + '\n'

    // Info panel
    let infoPanel = `\n${updateInfoPanel()}`

    // Update screen innerHTML
    screen.innerHTML = topPanel + mapPanel + infoPanel
}

// -- map manager
function updateMapWithUnits(map, players) {
    let updatedMap = [...map]; // Create a copy of the map array to avoid modifying the original

    // Draw resources
    mapResources.forEach(position => {
        const [resourceRow, resourceCol] = position;
        if (resourceRow >= 0 && resourceRow < map.length && resourceCol >= 1 && resourceCol < map[0].length) {
            updatedMap[resourceRow] = updatedMap[resourceRow].substring(0, resourceCol) + '$' + updatedMap[resourceRow].substring(resourceCol + 1);
        }
    });

    // Iterate over each player's units
    players.forEach(player => {
        player.units.forEach(unit => {
            if (unit.health <= 0) {
                const index = player.units.indexOf(unit);
                if (index !== -1) {
                    player.units.splice(index, 1);
                }
                return;
            }

            const [unitRow, unitCol] = unit.position;

            // Check if the unit position is within the bounds of the map
            if (unitRow >= 0 && unitRow < map.length && unitCol >= 1 && unitCol + 1 < map[0].length) {
                // Determine the bracket type based on the player
                const bracket = (player === players[0]) ? ['(', ')'] : ['[', ']']; // Use round brackets for player 0, square brackets for player 1

                // Build the unit with brackets or apply blinking
                let unitToDraw = (unit === currentSelectedUnit && !isVisible && !isTemplating && !isAiming) ? ' '.repeat(unit.unitType.representation.length + 2) : bracket[0] + unit.unitType.representation + bracket[1];

                // Update the map with the unit representation
                updatedMap[unitRow] = updatedMap[unitRow].substring(0, unitCol - unit.unitType.margin) + unitToDraw + updatedMap[unitRow].substring(unitCol + unit.unitType.margin + 1);
            }
        });
    });

    // Draw aim
    if (isAiming) {
        const [aimRow, aimCol] = currentAimPosition
        let unitToDraw = (!isVisible) ? '!' : ' '
        updatedMap[aimRow] = updatedMap[aimRow].substring(0, aimCol) + unitToDraw + updatedMap[aimRow].substring(aimCol + 1);
    }

    // Draw template
    if (isTemplating) {
        const [templateRow, templateCol] = currentTemplatePosition;
        const bracket = (currentPlayer === 0) ? ['(', ')'] : ['[', ']']
        let unitToDraw = (!isVisible) ? ' '.repeat(currentTemplate.representation.length + 2) : bracket[0] + currentTemplate.representation + bracket[1];
        updatedMap[templateRow] = updatedMap[templateRow].substring(0, templateCol - currentTemplate.margin) + unitToDraw + updatedMap[templateRow].substring(templateCol + currentTemplate.margin + 1);
    }

    return updatedMap;
}

// -- helper functions
function checkCollision(row, col, unit = null, margin = 0) {
    let result = 0;
    let toCheck = [[row, col]];
    if (unit) { margin = unit.unitType.margin}

    for (let i = 1; i <= margin; i++) {
        toCheck.push([row, col + i], [row, col - i]);
    }

    // Check for terrain and resources
    toCheck.forEach(position => {
        const [checkRow, checkCol] = position;
        if (mapResources.some(resource => resource[0] === checkRow && resource[1] === checkCol)) { result = 1 }
        if (map[checkRow][checkCol] === ':') { result = 2 } 
    }) 

    // Check for units
    let unitsInSameRow = players.flatMap(player =>
        player.units.filter(otherUnit => otherUnit.position[0] === row)
    );
    
    unitsInSameRow.forEach(otherUnit => {
        if (!unit || otherUnit !== unit) {
            if (Math.abs(col - otherUnit.position[1]) <= (margin + otherUnit.unitType.margin)) {
                result = otherUnit;
                return
            }
         }
    });

    return result
}

function checkDistance(rowA, colA, rowB, colB) {
    const horizontalDistance = Math.abs(colB - colA);
    const verticalDistance = Math.abs(rowB - rowA) * 2;

    const hypotenuseLength = Math.sqrt(Math.pow(horizontalDistance, 2) + Math.pow(verticalDistance, 2));
    return Math.round(hypotenuseLength);
}

function checkIds() {
    return players.reduce((highestId, player) => {
        return player.units.reduce((maxId, unit) => {
            return Math.max(maxId, unit.id)
        }, highestId)
    }, 0)
}

function deselectUnit() {
    isAiming = false
    isTemplating = false
    currentAimPosition = null
    currentTemplate = null
    currentTemplatePosition = null
    currentSelectedUnit = null
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

function getUnitInfo() {
    if (currentSelectedUnit != null) {
        return `${currentSelectedUnit.unitType.name}: ${currentSelectedUnit.health}hp`
    }
    return `No unit selected.`
}

function togglePlayer() {
    deselectUnit();
    updateResources();
    currentPlayer = currentPlayer === 0 ? 1 : 0;

    const depot = players[currentPlayer].units.find(unit => unit.unitType === units['depot']);
    if (depot) centerScreenOn(depot.position[0], depot.position[1]);

    isCoolingDown = [];
    movesLeft = 30;
}

function toggleUnitVisibility() {
    isVisible = !isVisible
}

function updateResources() {
    // adding energy
    players[currentPlayer].units.forEach(unit => {
        if (unit.unitType === units['solar']) {
            players[currentPlayer].energy++
        }
    })

    // placing resources on map
    for (let i = 0; i < 3; i++) {
        if (getRandomInt(0, 3) <= resourceCooldown && mapResources.length < 12) {
            let placedResource = false
    
            while (!placedResource) {
                let row = getRandomInt(0, map.length)
                let col = getRandomInt(0, map[0].length)
        
                if (checkCollision(row, col, null, 0) === 0) {
                    resourceCooldown = 0
                    placedResource = true
                    mapResources.push([row, col])
                }
            }
        } else {
            resourceCooldown++
        }
    }
}

// -- handling user input
function handleKeyDown(event) {
    if (isGameOver) return;

    warningLine = null;

    const keyActions = {
        'a': () => handleAiming(),
        'd': () => handleAddVehicleKey(units['drone']),
        'h': () => handleAddVehicleKey(units['heavy']),
        'l': () => handleAddVehicleKey(units['light']),
        's': () => handleAddBuildingKey(units['solar']),
        't': () => handleAddBuildingKey(units['turret']),
        'w': () => handleAddBuildingKey(units['workshop']),
        'ArrowUp': () => handleArrowKey(-1, 0),
        'ArrowDown': () => handleArrowKey(1, 0),
        'ArrowLeft': () => handleArrowKey(0, -1),
        'ArrowRight': () => handleArrowKey(0, 1),
        'Escape': () => deselectUnit(),
        'Enter': () => handleEnterKey(),
        'Shift': () => handleShiftKey(),
        ' ': () => togglePlayer()
    }

    const key = event.key
    if (keyActions[key]) keyActions[key]()
    updateScreen()
}

function handleAiming() {
    if (!currentSelectedUnit || currentSelectedUnit.unitType.isBuilding && !(currentSelectedUnit.unitType === units['turret'] && !isAiming)) return;
    
    if (isCoolingDown.includes(currentSelectedUnit.id)) {
        warningLine = 'This unit is cooling down.';
        return;
    }

    if (!currentAimPosition) currentAimPosition = currentSelectedUnit.position;
    isAiming = true;
}


function handleAddVehicleKey(vehicleType) {
    if (currentSelectedUnit && currentSelectedUnit.unitType === units['workshop']) {
        commandAddVehicle(vehicleType, currentSelectedUnit.position[0], currentSelectedUnit.position[1]);
    }
}

function handleAddBuildingKey(templateType) {
    if (currentSelectedUnit && currentSelectedUnit.unitType === units['depot'] && !isTemplating) {
        if (!currentTemplatePosition) currentTemplatePosition = currentSelectedUnit.position;
        currentTemplate = templateType;
        isTemplating = true;
    }
}

function handleArrowKey(deltaRow, deltaCol) {
    if (currentSelectedUnit) {
        if (isAiming) moveAim(deltaRow, deltaCol);
        else if (isTemplating) moveTemplate(deltaRow, deltaCol, currentTemplate);
        else moveUnit(deltaRow, deltaCol);
    } else {
        moveView(deltaRow, deltaCol);
    }
}

function handleEnterKey() {
    if (isAiming) {
        if (movesLeft > 0) {
            playExplosion(currentAimPosition[0], currentAimPosition[1])
            isCoolingDown.push(currentSelectedUnit.id)
            const collisionResult = checkCollision(currentAimPosition[0], currentAimPosition[1], null, 0)
            if (collisionResult instanceof Object) damageUnit(collisionResult)
            movesLeft--
        } else {
            warningLine = 'Not enough action points.'
            return
        }
        deselectUnit()
    } else if (isTemplating) {
        commandAddBuilding(currentTemplate, currentTemplatePosition[0], currentTemplatePosition[1])
        deselectUnit()
    }
}

function handleShiftKey() {
    if (isAiming) isAiming = false
    if (isTemplating) isTemplating = false

    if (players[currentPlayer].units.length > 0) {
        if (currentSelectedUnit === null) currentSelectedUnit = players[currentPlayer].units[0]
        else {
            const currentIndex = players[currentPlayer].units.findIndex(unit => unit === currentSelectedUnit)
            const nextIndex = (currentIndex + 1) % players[currentPlayer].units.length
            currentSelectedUnit = players[currentPlayer].units[nextIndex]
        }
        centerScreenOn(currentSelectedUnit.position[0], currentSelectedUnit.position[1])
    }
}

// -- unit movement, applying damage and resource collection
function checkResourceCollection(row, col, unit) {
    if (unit.unitType === units['human']) {
        const positionsToCheck = [col - 1, col, col + 1];

        positionsToCheck.forEach(checkCol => {
            const index = mapResources.findIndex(resource => resource[0] === row && resource[1] === checkCol);
            if (index !== -1) {
                mapResources.splice(index, 1);
                players[currentPlayer].money += 5;
            }
        });
    }
}

function damageUnit(unit) {
    let damage = getRandomInt(currentSelectedUnit.unitType.damage[0], Math.min(currentSelectedUnit.unitType.damage[1], unit.health))
    unit.health -= damage

    warningLine = (unit.health <= 0) ? `Target destroyed. No unit selected.` : `Target received ${damage} damage. No unit selected.`
    movesLeft--
}

function moveUnit(deltaRow, deltaCol) {
    const [unitRow, unitCol] = currentSelectedUnit.position;
    const newRow = unitRow + deltaRow;
    const newCol = unitCol + deltaCol;

    // Check if there are enough movement points
    const movementCost = (deltaRow !== 0) ? 2 * currentSelectedUnit.unitType.speed : currentSelectedUnit.unitType.speed;
    if (movesLeft < movementCost) {
        warningLine = "Not enough action points.";
        return;
    }

    if (newRow >= 0 && newRow < map.length && newCol >= 1 && newCol < map[0].length - 1 && !currentSelectedUnit.unitType.isBuilding) {
        const collisionResult = checkCollision(newRow, newCol, currentSelectedUnit);
        switch (collisionResult) {
            case 1: {
                currentSelectedUnit.position = [newRow, newCol];
                checkResourceCollection(newRow, newCol, currentSelectedUnit);
                centerScreenOn(currentSelectedUnit.position[0], currentSelectedUnit.position[1]);
                movesLeft -= movementCost;
                break;
            }
            case 2: {
                warningLine = `Sorry, terrain in the way.`;
                break;
            }
            default: {
                if (collisionResult instanceof Object && collisionResult !== currentSelectedUnit) {
                    warningLine = `Sorry, other units in the way.`;
                } else {
                    currentSelectedUnit.position = [newRow, newCol];
                    centerScreenOn(currentSelectedUnit.position[0], currentSelectedUnit.position[1]);
                    movesLeft -= movementCost;
                }
                break;
            }
        }
    }
}

// -- command manager
function getAvailableCommands(unit) {
    return (unit) ? ` | ${unit.unitType.commands}` : ''
}

function commandAddBuilding(type, row, col) {
    // Check if there is enough resources
    if (players[currentPlayer].money < type.cost[0] || players[currentPlayer].energy < type.cost[1]) {
        warningLine = 'Not enough resources.'
        return
    } 
    
    // Check if the spot is free
    if (checkCollision(row, col, null, type.margin)) {
        warningLine = "Can't build here."
        return
    }

    players[currentPlayer].money -= type.cost[0]
    players[currentPlayer].energy -= type.cost[1]

    players[currentPlayer].units.push({
        'id' : checkIds() + 1,
        'health': type.maxHealth,
        'unitType': type,
        'position': [row, col]
    })
}

function commandAddVehicle(type, row, col) {
    // Check if there is enough resources
    if (players[currentPlayer].money < type.cost[0] || players[currentPlayer].energy < type.cost[1]) {
        warningLine = 'Not enough resources.'
        return
    }

    // Check if there is exit
    newRow = row + 1
    if (checkCollision(newRow, col, null, type.margin) === 2 || checkCollision(newRow, col, null, type.margin) instanceof Object) {
        newRow = row - 1
        if (checkCollision(newRow, col, null, type.margin) === 2 || checkCollision(newRow, col, null, type.margin) instanceof Object) {
            warningLine = 'No available exit from the workshop!'
            return
        }
    }

    players[currentPlayer].money -= type.cost[0]
    players[currentPlayer].energy -= type.cost[1]

    players[currentPlayer].units.push({
        'id' : checkIds() + 1,
        'health': type.maxHealth,
        'unitType': type,
        'position': [newRow, col]
    })
}

// -- Main game loop:
const switchPlayer = setInterval(gameLoop, 500)

function checkIfGameOver() {
    let activePlayers = players.filter(player => player.units.some(unit => unit.unitType === units['human']));

    if (activePlayers.length === 1) {
        isGameOver = true;
        warningLine = `Player ${players.indexOf(activePlayers[0]) + 1} won!`;
    }
}

function gameLoop() {
    checkIfGameOver()
    toggleUnitVisibility()
    updateScreen()
}

// Add event listener for keydown events
document.addEventListener('keydown', handleKeyDown)