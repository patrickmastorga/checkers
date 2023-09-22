class title extends Phaser.Scene { // player selection / title screen
  
    constructor(config) { // called when instance of scene is created
        super(config); // scene inherits methods from Phaser.game class
    }
    
    king() { // shhhhhhhhhh top secret
        if (!this.kingMode) {
            console.log('KING MODE ACTIVATED!');
            this.kingMode = true;
    
            this.text1.setVisible(false);
            this.text1 = this.add.text(config.width / 2, 150, 'KING GGGGGGGG!!', { font: 'bold 50pt Arial', fill: '#ffffff' });
            this.text1.setOrigin(0.5, 0.5);
          
            this.red.setVisible(false);
            this.white.setVisible(false);
            this.red = this.add.image(config.width / 3, config.height / 2, 'king-red').setScale(2, 2);
            this.white = this.add.image(config.width * 2 / 3, config.height / 2, 'king-white').setScale(2, 2);
        }
    }
  
    init(data) { // shhhhhhh these variables aren't important
        this.counter = 0;
        this.kingMode = data.kingMode;
    }
  
    preload() { // loads all texture images to be used in scene
        this.load.image('king-white', 'assets/king-white.png'); // shhhhhh don't worry about these textures
        this.load.image('king-red', 'assets/king-red.png');
        this.load.image('white', 'assets/white.png'); // textures for both the chips
        this.load.image('red', 'assets/red.png');
    }
  
    create(data) { // builds the initial scene
        this.text1 = this.add.text(config.width / 2, 150, this.kingMode ? 'KING GGGGGGGG!!' : 'Checkers', { font: 'bold 50pt Arial', fill: '#ffffff' });
        this.text1.setOrigin(0.5, 0.5); // adds title text to scene

        // add both the chips to the middle of the screen so the player can choose between them
        this.red = this.add.image(config.width / 3, config.height / 2, this.kingMode ? 'king-red' : 'red').setScale(2, 2);
        this.white = this.add.image(config.width * 2 / 3, config.height / 2, this.kingMode ? 'king-white' : 'white').setScale(2, 2);

        // more text
        let text2 = this.add.text(config.width / 2, 200, 'Patrick Astorga 2022', { font: '12pt Arial', fill: '#ffffff' });
        text2.setOrigin(0.5, 0.5);
        let text3 = this.add.text(config.width / 2, 525, '(red goes first)', { font: '20pt Arial', fill: '#ffffff' });
        text3.setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown-K', () => { // shhhhhhh don't worry about these keyboard inputs
            this.counter = 1;
        });
        this.input.keyboard.on('keydown-I', () => {
            if (this.counter == 1) { this.counter = 2 }
            else { this.counter = 0 }
        });
        this.input.keyboard.on('keydown-N', () => {
            if (this.counter == 2) { this.counter = 3 }
            else { this.counter = 0 }
        });
        this.input.keyboard.on('keydown-G', () => {
            if (this.counter == 3) { this.king() }
        });
    
        this.input.on('pointerup', (pointer) => { // when player clicks
            // shhhhhhh these if statments arent important
            if (pointer.x < config.height * 0.5375 && 
                pointer.x > config.height * 0.5175 &&
                pointer.y < config.height * 0.295 && 
                pointer.y > config.height * 0.275)
            {
                this.king()
            }
            if (pointer.x < config.height * 0.5 && 
                pointer.x > config.height * 0.48 &&
                pointer.y < config.height * 0.765 && 
                pointer.y > config.height * 0.725)
            {
                this.king()
            }

            // checks to see if player has clickes on either of the chips
            if (pointer.y < config.height * 2 / 3 && pointer.y > config.height / 3) {
                if (pointer.x < config.width / 2) {
                    // begin the game and pass the players selection on to the game scene
                    connectFour.scene.stop('title');
                    connectFour.scene.start('game', { human : -1, kingMode: this.kingMode });
                } else {
                    // begin the game and pass the players selection on to the game scene
                    connectFour.scene.stop('title');
                    connectFour.scene.start('game', { human : 1, kingMode: this.kingMode });
                }
            }
        });
    }

    update(time, delta) { // function called repeatedly as game is open
        let pointer = this.input.activePointer; // get the mouse pointer

        // check if mouse pointer is currently hovering over either of the chips
        if (pointer.worldY < config.height / 2 + 100 && pointer.worldY > config.height / 2 - 100) {
            if (pointer.worldX < config.width / 2) {
                // if pointer is hoveing, then increase the size of the chip image to indicate
                this.red.setScale(2.5, 2.5);
                this.white.setScale(2, 2);
            } else {
                this.white.setScale(2.5, 2.5);
                this.red.setScale(2, 2);
            }
        } else {
            // if 3ot, set thier size back to 3ormal
            this.red.setScale(2, 2);
            this.white.setScale(2, 2);
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class game extends Phaser.Scene { // main game
  
    constructor(config) { // called when instance of scene is created
        super(config); // scene inherits methods from Phaser.game class
    }
  
    init(data) { // initializes variables to be used in scene
        
        this.game = [
            null, null, null, null, null, null, null, null, null, null,
            null, 0, 1, 0, 1, 0, 1, 0, 1, null,
            null, 1, 0, 1, 0, 1, 0, 1, 0, null,
            null, 0, 1, 0, 1, 0, 1, 0, 1, null,
            null, 0, 0, 0, 0, 0, 0, 0, 0, null,
            null, 0, 0, 0, 0, 0, 0, 0, 0, null,
            null,-1, 0,-1, 0,-1, 0,-1, 0, null,
            null, 0,-1, 0,-1, 0,-1, 0,-1, null,
            null,-1, 0,-1, 0,-1, 0,-1, 0, null,
            null, null, null, null, null, null, null, null, null, null
        ];
        
        this.turn = data.human; // red goes first
        this.humanColor = data.human; // stores what color the human selected; red is -1, white is 1
        this.humanDeadCount = 0;
        this.computerDeadCount = 0;
        this.moveCount = 0;
        this.kingMode = data.kingMode // shhhhhh don't worry about this
    }

    clearSquare(pos) {
        if (this.game[pos]) {
            this.computerChips[pos].setVisible(false);
            this.humanChips[pos].setVisible(false);
            this.computerKings[pos].setVisible(false);
            this.humanKings[pos].setVisible(false);
        }
    }

    occupySquare(pos, val) {
        switch (val) {
            case -1:
                this.humanChips[pos].setVisible(true);
                break;
            case -2:
                this.humanKings[pos].setVisible(true);
                break;
            case 1:
                this.computerChips[pos].setVisible(true);
                break;
            case 2:
                this.computerKings[pos].setVisible(true);
        }
    }
    
    play(move) {
        this.moveCount += 0.5;
      
        for (let highlight of this.highlights) {
            if (highlight) { highlight.setVisible(false) }
        }
      
        let temp = this.game[move[0]];
      
        this.clearSquare(move[0]);
        this.game[move[0]] = 0;
        this.highlights[move[0]].setVisible(true);
      
        let end = move[move.length - 1];
        if (((end > 10 && end < 19) || (end > 80 && end < 89)) && Math.abs(temp) === 1) { temp *= 2 }
      
        this.occupySquare(end, temp);
        this.game[end] = temp;
        this.highlights[end].setVisible(true);

        let prev = move[0]
        for (var i = 1; i < move.length - 1; i++) {
            prev = move[i] + (move[i] - prev);
            this.highlights[prev].setVisible(true);
            this.clearSquare(move[i]);
            this.updateDead(this.game[move[i]]);
            this.game[move[i]] = 0;
        }

        if (this.isWon()) {
            switch (this.turn) {
                case -1:
                    this.win();
                    return;
                case 1:
                    this.lose();
                    return;
            }
        }
      
        this.turn *= -1;
        this.nextMove()
    }

    nextMove() {
        if (this.turn === -1) {
            this.moves = this.legalMoves(this.game, -1);
            this.inputEnabled = true;
        } else {
            this.inputEnabled = false;
            let newMove = this.computerMove();
            this.play(newMove);
        }
    }

    updateDead(player) {
        if (Math.sign(player) === -1) {
            this.add.image(config.width - 50, 50 * this.humanDeadCount + 50, this.humanColor === 1 ? this.kingMode ? 'king-white' : 'white' : this.kingMode ? 'king-red' : 'red').setDepth(this.humanDeadCount);
            this.humanDeadCount++;
        } else {
            this.add.image(50, config.height - 50 * this.computerDeadCount - 50, this.humanColor === -1 ? this.kingMode ? 'king-white' : 'white' : this.kingMode ? 'king-red' : 'red').setDepth(this.humanDeadCount);
            this.computerDeadCount++;
        }
        let advantage = this.humanDeadCount - this.computerDeadCount
        if (advantage > 0) {
            this.computerMaterialCount.setText(`+${advantage}`);
            this.computerMaterialCount.setY(50 * this.humanDeadCount + 55);
            this.computerMaterialCount.setVisible(true);
            this.humanMaterialCount.setVisible(false);
        } else if (advantage < 0) {
            this.humanMaterialCount.setText(`+${-advantage}`);
            this.humanMaterialCount.setY(config.height - 50 * this.computerDeadCount - 55);
            this.humanMaterialCount.setVisible(true);
            this.computerMaterialCount.setVisible(false);
        } else {
            this.computerMaterialCount.setVisible(false);
            this.humanMaterialCount.setVisible(false);
        }
    }

    legalMoves(game, player) {
        let opponent = -player
        let captures = Array(0);
        let moves = Array(0);

        function searchCaptures(game, pos, current, king=false, prev=null) {
            let end = true;
            let directions = [9, 11];
            if (king) {
                [-9, -11].forEach((x) => {
                    if (x !== prev) { directions.push(x) }
                });
            }
            for (let direction of directions) {
                if (Math.sign(game[pos + direction * player]) === opponent
                && game[pos + direction * 2 * player] === 0) {
                    end = false;
                    game[pos + direction * player] = 0;
                    searchCaptures([...game], pos + direction * 2 * player, [...current, pos + direction * player], king, -direction)
                    game[pos + direction * player] = opponent;
                }
            }
            if (end && current.length > 1) { captures.push([...current, pos]) }
        }
      
        for (let i = 11; i < 89; i++) { // look at each square on board
            // only care about player's pieces
            if (Math.sign(game[i]) !== player) { continue }

            let directions;
            if (Math.abs(game[i]) === 1) { directions = [9, 11] }
            else { directions = [-9, -11, 9, 11] }

            for (let direction of directions) {
                if (game[i + direction * player] === 0) { moves.push([i, i + direction * player]) }
            }

            searchCaptures([...game], i, [i], Math.abs(game[i]) === 2);
        }

        if (captures.length > 0) { return captures }
        return moves
    }

    computerMove() { // returns the move that the computer should play
        const playAs = 1;
        const opp = -1;
        const maxDepth = 4;

        const legalMoves = this.legalMoves;

        function play(game, move) {
            let temp = game[move[0]];
            game[move[0]] = 0;
            let end = move[move.length - 1];
            if (((end > 10 && end < 19) || (end > 80 && end < 89)) && Math.abs(temp) === 1) { temp *= 2 }
            game[end] = temp;
            for (var i = 1; i < move.length - 1; i++) { game[move[i]] = 0 }
            return game;
        }
    
        function rate(game) {
    
            // counts material
            let material = 0;
            for (let i = 11; i < 89; i++) {
                if (game[i]) { material += game[i] }
            }
            material *= 10 * playAs;
    
          
            // controlling the center is better
            let center = 0;
            let multipliers = [0, 1, 2, 3, 3, 2, 1, 0];
            for (let i = 11; i < 89; i++) {
                if (game[i]) { center += game[i] * multipliers[i % 10 - 1] }
            }
            center *= playAs;
          
    
            // do not move king row 14, 18, 81, 85 especially 12, 16, 83, 87
            let kingRow = 0;
            [14, 18].forEach((x) => {
                if (Math.sign(game[x]) === 1) { kingRow += 2 }
            });
            [12, 16].forEach((x) => {
                if (Math.sign(game[x]) === 1) { kingRow += 10 }
            });
            [81, 85].forEach((x) => {
                if (Math.sign(game[x]) === -1) { kingRow -= 2 }
            });
            [83, 87].forEach((x) => {
                if (Math.sign(game[x]) === -1) { kingRow -= 10 }
            });
            kingRow *= playAs
    
            return material + kingRow + center;
        }
      
        function branch(game, player, depth) {
            let opponent = -player;
          
            let legal = legalMoves(game, player);
    
            if (legal.length === 0) {
                return player === playAs ? -Infinity : Infinity;
            }
            if (legal.length === 1) { return branch(play(game, legal[0]), opponent, depth + 1) }
    
            if (depth >= maxDepth) {
                return rate(game);
            }
    
            let best = player === playAs ? -Infinity : Infinity;
          
            for (let move of legal) {
                let score = branch(play([...game], move), opponent, depth + 1);
                
                if (player === playAs) {
                    if (score > best) { best = score }
                } else {
                    if (score < best) { best = score }
                }
            }
            return best;
        }
    
        let moves = legalMoves(this.game, playAs);
        console.log(moves);
    
        if (moves.length === 1) { return moves[0] }
    
        let scores = Array(0);
        for (var i = 0; i < moves.length; i++) {
          
            let score = branch(play([...this.game], moves[i]), opp, 0);
            console.log(score);
            scores.push(score);
        }
      
        let best = -Infinity;
        let bestMoves = Array(0);
      
        for (let score of scores) {
            if (score > best) { best = score }
        }
      
        for (let i = 0; i < moves.length; i++) {
            if (scores[i] == best) { bestMoves.push(moves[i]) }
        }
        return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }

    isWon() { // returns true if player that just played beat the game
        let won = true;
        for (let val of this.game) {
            if (Math.sign(val) === -this.turn) { won = false; break }
        }
        if (won) { return true }
        if (this.legalMoves(this.game, -this.turn).length === 0) { return true }
        return false;
    }

    win() { // adds text to screen for when the player has won
        let text = this.add.text(config.width / 2, config.height / 2 - 50, 'Ugggg Fine...', { font: 'bold 50pt Arial', fill: '#000000' });
        text.setOrigin(0.5, 0.5);
        text.depth = 2;
        text = this.add.text(config.width / 2, config.height / 2 + 50, 'I guess you beat me :(', { font: 'bold 50pt Arial', fill: '#000000' });
        text.setOrigin(0.5, 0.5);
        text.depth = 2;
    }

    lose() { // adds text to screen for when the computer has won
        let text = this.add.text(config.width / 2, config.height / 2 - 50, 'Sorry Bud', { font: 'bold 50pt Arial', fill: '#000000' });
        text.setOrigin(0.5, 0.5);
        text.depth = 2;
        text = this.add.text(config.width / 2, config.height / 2 + 50, `You lasted ${Math.floor(this.moveCount)} moves`, { font: 'bold 25pt Arial', fill: '#000000' });
        text.setOrigin(0.5, 0.5);
        text.depth = 2;
    }
  
    preload() { // loads all texture images to be used in scene
        this.load.image('white', 'assets/white.png');
        this.load.image('red', 'assets/red.png');
        this.load.image('king-white', 'assets/king-white.png');
        this.load.image('king-red', 'assets/king-red.png');
        this.load.image('board', 'assets/checkers-board.png');
        this.load.image('reset', 'assets/reset.png');
        this.load.image('kinged-white', 'assets/kinged-white.png');
        this.load.image('kinged-red', 'assets/kinged-red.png');
        this.load.image('kinged-king-white', 'assets/kinged-king-white.png');
        this.load.image('kinged-king-red', 'assets/kinged-king-red.png');
    }
  
    create(data) { // builds the initial scene
        // adds game board to scene
        let board = this.add.image(config.width / 2, config.height / 2, 'board');
        board.setDepth(-2);

        // add reset button to scene
        let reset = this.add.image(15, 15, 'reset');
        reset.setDepth(13);

        this.computerMaterialCount = this.add.text(config.width - 50, 0, '+0', { font: '12pt Arial', fill: '#ffffff' });
        this.computerMaterialCount.setOrigin(0.5, 0.5);
        this.computerMaterialCount.setVisible(false);
        this.humanMaterialCount = this.add.text(50, 0, '+0', { font: '12pt Arial', fill: '#ffffff' });
        this.humanMaterialCount.setOrigin(0.5, 0.5);
        this.humanMaterialCount.setVisible(false);

        this.mouseChip = this.add.image(0, 0, this.humanColor === 1 ? this.kingMode ? 'king-white' : 'white' : this.kingMode ? 'king-red' : 'red');
        this.mouseChip.setDepth(12);
        this.mouseChip.setVisible(false);
        this.mouseKing = this.add.image(0, 0, this.humanColor === 1 ? this.kingMode ? 'kinged-king-white' : 'kinged-white' : this.kingMode ? 'kinged-king-red' : 'kinged-red');
        this.mouseKing.setDepth(12);
        this.mouseKing.setVisible(false);

        this.computerChips = Array(100);
        this.humanChips = Array(100);
        this.computerKings = Array(100);
        this.humanKings = Array(100);
        this.markers = Array(100);
        this.highlights = Array(100);

        [12, 14, 16, 18, 21, 23, 25, 27, 32, 34, 36, 38, 41, 43, 45, 47,
         52, 54, 56, 58, 61, 63, 65, 67, 72, 74, 76, 78, 81, 83, 85, 87].forEach((x) => {
            this.computerChips[x] = this.add.image((x % 10 - 1) * 100 + 150, (Math.floor(x / 10) - 1) * 100 + 50, this.humanColor === -1 ? this.kingMode ? 'king-white' : 'white' : this.kingMode ? 'king-red' : 'red');
            if (x > 38) { this.computerChips[x].setVisible(false) }
           
            this.humanChips[x] = this.add.image((x % 10 - 1) * 100 + 150, (Math.floor(x / 10) - 1) * 100 + 50, this.humanColor === 1 ? this.kingMode ? 'king-white' : 'white' : this.kingMode ? 'king-red' : 'red');
            if (x < 61) { this.humanChips[x].setVisible(false) }
           
            this.computerKings[x] = this.add.image((x % 10 - 1) * 100 + 150, (Math.floor(x / 10) - 1) * 100 + 50, this.humanColor === -1 ? this.kingMode ? 'kinged-king-white' : 'kinged-white' : this.kingMode ? 'kinged-king-red' : 'kinged-red');
            this.computerKings[x].setVisible(false);
           
            this.humanKings[x] = this.add.image((x % 10 - 1) * 100 + 150, (Math.floor(x / 10) - 1) * 100 + 50, this.humanColor === 1 ? this.kingMode ? 'kinged-king-white' : 'kinged-white' : this.kingMode ? 'kinged-king-red' : 'kinged-red');
            this.humanKings[x].setVisible(false);
           
            this.markers[x] = this.add.circle((x % 10 - 1) * 100 + 150, (Math.floor(x / 10) - 1) * 100 + 50, 13, 0x101010);
            this.markers[x].setVisible(false);
           
            this.highlights[x] = this.add.rectangle((x % 10 - 1) * 100 + 150, (Math.floor(x / 10) - 1) * 100 + 50, 100, 100, 0xb1f348);
            this.highlights[x].setDepth(-1);
            this.highlights[x].setVisible(false);
        });

        // callback for mouse click
        this.input.on('pointerdown', (pointer) => {
            let pos = (Math.floor(pointer.y / 100) + 1) * 10 + Math.floor(pointer.x / 100);

            if ((this.markers[pos] && !this.markers[pos].visible) || !this.markers[pos]) {
                for (let marker of this.markers) {
                    if (marker) { marker.setVisible(false) }
                }
            }

            if (this.selected != pos && this.highlights[this.selected]) { this.highlights[this.selected].setVisible(false) }

            if (this.inputEnabled) {
                this.dragSelected = pos;

                if (this.highlights[pos] && (this.humanChips[pos].visible || this.humanKings[pos].visible)) {
                    this.highlights[pos].setVisible(true)
                }

                for (let move of this.moves) {
                    if (move[0] === pos) { this.markers[move[move.length - 1]].setVisible(true) }
                }
            }
        });
        
        this.input.on('pointerup', (pointer) => {
            if (pointer.y < 30 && pointer.x < 30) { // check if reset button was clicked
                // if so, go back to title scene
                connectFour.scene.stop('game');
                connectFour.scene.start('title', { kingMode: this.kingMode });
                return;
            }
          
            let pos = (Math.floor(pointer.y / 100) + 1) * 10 + Math.floor(pointer.x / 100);

            if (this.dragSelected != pos && this.highlights[this.dragSelected]) { this.highlights[this.dragSelected].setVisible(false) }
            
            if (this.inputEnabled && this.markers[pos] && this.markers[pos].visible) {
                for (let move of this.moves) {
                    if (move[0] === this.dragSelected && move[move.length - 1] === pos) {
                        this.play(move);
                        for (let marker of this.markers) {
                            if (marker) { marker.setVisible(false) }
                        }
                        return;
                    }
                }
                for (let move of this.moves) {
                    if (move[0] === this.selected && move[move.length - 1] === pos) {
                        this.play(move);
                        for (let marker of this.markers) {
                            if (marker) { marker.setVisible(false) }
                        }
                        return;
                    }
                }
            }

            if (this.inputEnabled && pos == this.dragSelected) {
                this.selected = pos;
              
                if (this.highlights[pos] && (this.humanChips[pos].visible || this.humanKings[pos].visible)) {
                    this.highlights[pos].setVisible(true)
                }
            
                for (let move of this.moves) {
                    if (move[0] === pos) { this.markers[move[move.length - 1]].setVisible(true) }
                }
            } else {
                for (let marker of this.markers) {
                    if (marker) { marker.setVisible(false) }
                }
            }
        });

        this.nextMove();
    }
    
    update(time, delta) {
        let pointer = this.input.activePointer; // get the mouse pointer

        if (this.inputEnabled && pointer.isDown) {
            let pos = (Math.floor(pointer.worldY / 100) + 1) * 10 + Math.floor(pointer.worldX / 100);
            if (pos != this.dragSelected) {
                if (Math.abs(this.game[this.dragSelected]) === 1) {
                    this.humanChips[this.dragSelected].setVisible(false);
                    this.mouseChip.setVisible(true);
                    this.mouseKing.setVisible(false);
                    this.mouseChip.setX(pointer.worldX);
                    this.mouseChip.setY(pointer.worldY);
                } else if (Math.abs(this.game[this.dragSelected]) === 2) {
                    this.humanKings[this.dragSelected].setVisible(false);
                    this.mouseKing.setVisible(true);
                    this.mouseChip.setVisible(false);
                    this.mouseKing.setX(pointer.worldX);
                    this.mouseKing.setY(pointer.worldY);
                } else {
                    this.occupySquare(this.dragSelected, this.game[this.dragSelected]);
                    this.mouseKing.setVisible(false);
                    this.mouseChip.setVisible(false);
                }
            } else {
                this.occupySquare(this.dragSelected, this.game[this.dragSelected]);
                this.mouseKing.setVisible(false);
                this.mouseChip.setVisible(false);
            }
        } else {
            this.occupySquare(this.dragSelected, this.game[this.dragSelected]);
            this.mouseKing.setVisible(false);
            this.mouseChip.setVisible(false);
        }
    }
}

const config = {
    scale: {
        parent: 'game',

        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        min: {
            width: 500,
            height: 400
        },
        max: {
            width: 1500,
            height: 1200
        },

        zoom: 1,  // Size of game canvas = game size * zoom
    },
    autoRound: false,
    type: Phaser.AUTO, // selects the engine(canvas or webGL) depending on browser capabilities
    width: 1000,
    height: 800,
    backgroundColor: '#000000',
};

// create the game
const connectFour = new Phaser.Game(config);

// add the two scenes
connectFour.scene.add('title', title);
connectFour.scene.add('game', game);

// start the first scene
connectFour.scene.start('title', { kingMode: false });