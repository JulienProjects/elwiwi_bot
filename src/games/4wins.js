
const columns = 7;
const rows = 6;

const emptyIcon = ":white_large_square:"
const playerOneIcon = ":red_circle:"
const playerTwoIcon = ":yellow_circle:"
const invalidIcon = ":no_entry:"
const winIcon = ":x:"
const acceptIcon = "1️⃣"
const declineIcon = "0️⃣"

const pressIcon = ["0️⃣","1️⃣", "2️⃣","3️⃣","4️⃣","5️⃣","6️⃣"]

class FourWins {
    constructor(interaction, args, client) {
        if(!args[1]){
            interaction.reply("Missing opponent Name")
            return;
        }
        //check if user is tagged
        if(args[1].indexOf("@") > -1){
            args[1] = args[1].substring(3, args[1].length);
            args[1] = args[1].substring(0, args[1].length - 1);
        }


        this.playerOne = "";
        this.playerFields = {playerOne: [], playerTwo: []};
        this.playerTwo = ""
        this.currentPlayer = null;
        this.loaded = false;
        this.playerTwoObject = {};
        this.interaction = interaction;
        this.client = client;
        this.msg = null;
        this.reactionListener = null;

        this.playerOne = interaction.author.username;
        this.playerTwo = args[1];

        this.playerTwoObject = client.users.cache.find(user => {return (user.username == this.playerTwo || user.id === this.playerTwo )});
        console.log(this.playerTwoObject);
        this.playerTwo = this.playerTwoObject.username
        this.channel = null
        const randomNumber = Math.floor(Math.random() * 2); 
        this.currentPlayer = randomNumber === 1 ? this.playerOne : this.playerTwo;
        
        this.init(false);
    }

     async init(accepted){
        const me = this;
        const promises = []

        let startMessage = null;
        let waitMessage = null;
    
        this.channel = await this.client.channels.fetch(this.interaction.channelId);
         if(accepted){
            startMessage = await this.channel.send(`${this.playerOne} started a 4wins game against ${this.playerTwo} \n ${playerOneIcon}: ${this.playerOne} \n ${playerTwoIcon}: ${this.playerTwo}`);
    
            waitMessage = await this.channel.send(`creating please wait....`);
    
            //leeres Feld erstellen
            this.msg = await this.channel.send(this.createField());
            
    
            for(let n = 0; n < pressIcon.length; n++){
                const p = this.msg.react(pressIcon[n]);
    
                promises.push(p)
            }
         }else{
            startMessage = await this.channel.send(`${this.playerOne} wants to play a 4win game against ${this.playerTwoObject}. Do you accept?`);
            startMessage.react(acceptIcon);
            startMessage.react(declineIcon);
         }

        
        this.reactionListener = async (reaction, user) => {
            if(!accepted){
                if((acceptIcon === reaction.emoji.name ||  declineIcon === reaction.emoji.name) && user.username === this.playerTwo){
                    if(acceptIcon === reaction.emoji.name){
                        startMessage.delete();
                        me.client.removeListener("messageReactionAdd", me.reactionListener)
                       this.init(true);
                    }else{
                        this.channel.send(`${this.playerTwo} did not accept the game`);
                        startMessage.delete();
                    }
                }
            }
            else if(me.filter(reaction, user)){
                const columnIndex = pressIcon.indexOf(reaction.emoji.name);
                const pointsInColumn = function(column){
                    let usedSpace = 0;
                    for(let i = 0; i < me.playerFields.playerOne.length; i++){
                        if(me.playerFields.playerOne[i].col === column){
                            usedSpace++;
                        }
                    }
                    for(let j = 0; j < me.playerFields.playerTwo.length; j++){
                        if(me.playerFields.playerTwo[j].col === column){
                            usedSpace++;
                        }
                    }
                    return usedSpace;
                }

                let player = ""

                if(me.currentPlayer === me.playerOne){
                    player = "playerOne"            
                }else{
                    player = "playerTwo"
                }
                const usedRowSpaces = pointsInColumn(columnIndex);

                if(usedRowSpaces < rows ){
                    me.playerFields[player].push({col: columnIndex, row: (rows - usedRowSpaces) - 1})

                    const won = me.checkIfWon(me.playerFields[player])

                    if(won){
                        setTimeout(() => {
                            me.msg.delete();
                            startMessage.delete();
                            me.channel.send(`${me.currentPlayer} won the 4wins Game against ${player === "playerOne" ? me.playerTwo : me.playerOne}`)
                            me.client.removeListener("messageReactionAdd", me.reactionListener)
                       }, 3000)
                    }else{
                        if(me.playerFields.playerOne.length + me.playerFields.playerTwo.length === (rows * columns)){
                            me.msg.delete();
                            startMessage.delete();
                            me.channel.send(`Its a draw between ${me.currentPlayer} and ${player === "playerOne" ? me.playerTwo : me.playerOne}`)
                        }else{
                            me.msg = await me.msg.fetch();
                            me.msg.reactions.resolve(reaction.emoji.name).users.remove(me.interaction.author)
                            if(me.playerTwoObject){
                                me.msg.reactions.resolve(reaction.emoji.name).users.remove(me.playerTwoObject)
                            }
                            //player wechseln
                            me.currentPlayer = player === "playerOne" ? me.playerTwo : me.playerOne;
                            me.msg.edit(me.updateField());
                        }
                    }
                }else{
                    const invalidFields = [];

                    for(let n = 0; n < rows; n++){
                        invalidFields.push({col: columnIndex, row: n})
                    }
                    me.msg.edit(me.updateField(invalidFields,true,false));
                    me.msg = await me.msg.fetch();    
                    me.msg.reactions.resolve(reaction.emoji.name).users.remove(me.interaction.author)
                    if(me.playerTwoObject){
                        me.msg.reactions.resolve(reaction.emoji.name).users.remove(me.playerTwoObject)
                    }
                    setTimeout(async () => {
                        
                        me.msg.edit(me.updateField());
                    }, 700)
                }
            }
        }

        this.client.on('messageReactionAdd', this.reactionListener)

        if(accepted){
            Promise.all(promises).then(() => {
                this.loaded = true;
                waitMessage.delete();
            })
        }
    }
    checkIfWon(playerFields){
        let won = false;
        let sameRow = {};
        let sameColumn = {};
        let wonFields = [];
    
        if(playerFields.length > 3){
            for(let i = 0; i < playerFields.length; i++){
                let numberInOrder = [];
                sameRow[playerFields[i].row] = sameRow[playerFields[i].row] ? sameRow[playerFields[i].row]  : {row: playerFields[i].row, col: []};
                sameRow[playerFields[i].row].col.push(playerFields[i].col)

                sameColumn[playerFields[i].col] = sameColumn[playerFields[i].col] ? sameColumn[playerFields[i].col]  : {col: playerFields[i].col, row: []};
                sameColumn[playerFields[i].col].row.push(playerFields[i].row)


                //diagonal 
                for(let j = 0; j < 4;j++){
                    //runter rechts
                    const row = playerFields[i].row
                    const col = playerFields[i].col

                    if(row < 3 && col < 4){
                        const fieldSet = this.fieldUsed({row: row + j, col: col+j}, this.currentPlayer)
                        if(fieldSet && fieldSet.icon){
                            numberInOrder.push({row: row + j, col: col+j});

                            if(numberInOrder.length === 4){
                                wonFields = numberInOrder;
                            }
                        }else{
                            numberInOrder = [];
                        }
                    }
                }

                for(let j = 0; j < 4;j++){
                    //hoch links
                    const row = playerFields[i].row
                    const col = playerFields[i].col

                    if(row > 2 && col > 2){
                        const fieldSet = this.fieldUsed({row: row - j, col: col-j}, this.currentPlayer)
                        if(fieldSet && fieldSet.icon){
                            numberInOrder.push({row: row - j, col: col-j});

                            if(numberInOrder.length === 4){
                                wonFields = numberInOrder;
                            }
                        }else{
                            numberInOrder = [];
                        }
                    }
                }

                for(let j = 0; j < 4;j++){
                    //hoch rechts
                    const row = playerFields[i].row
                    const col = playerFields[i].col

                    if(row > 2 && col < 4){
                        const fieldSet = this.fieldUsed({row: row - j, col: col + j}, this.currentPlayer)
                        if(fieldSet && fieldSet.icon){
                            numberInOrder.push({row: row - j, col: col + j});

                            if(numberInOrder.length === 4){
                                wonFields = numberInOrder;
                            }
                        }else{
                            numberInOrder = [];
                        }
                    }
                   
                }

                for(let j = 0; j < 4;j++){
                    //runter links
                    const row = playerFields[i].row
                    const col = playerFields[i].col

                    if(row < 3 && col > 2){
                        const fieldSet = this.fieldUsed({row: row + j, col: col - j}, this.currentPlayer)
                        if(fieldSet && fieldSet.icon){
                            numberInOrder.push({row: row + j, col: col - j});

                            if(numberInOrder.length === 4){
                                wonFields = numberInOrder;
                            }
                        }else{
                            numberInOrder = [];
                        }
                    }                  
                }
            }
        
            Object.keys(sameRow).forEach(element => {
                element = sameRow[element]
                if(element.col.length > 3){
                    let numberInOrder = [];
                    element.col = element.col.sort();
                    element.col.forEach((col, index) => {
                        if(((index + 1) < element.col.length && element.col[index + 1] === col + 1) || numberInOrder.length === 3){
                            numberInOrder.push({col, row: element.row});
                            if(numberInOrder.length === 4){
                                wonFields = numberInOrder;
                            }
                        }else{
                            numberInOrder = [];
                        }
                    })
                }
            });
            
            Object.keys(sameColumn).forEach(element => {
                element = sameColumn[element]
                if(element.row.length > 3){
                    let numberInOrder = [];
                    element.row = element.row.sort();
                    element.row.forEach((row, index) => {
                        if(((index + 1) < element.row.length && element.row[index + 1] === row + 1) || numberInOrder.length === 3){
                            numberInOrder.push({row, col: element.col});
                            if(numberInOrder.length === 4){
                                wonFields = numberInOrder;
                            }
                        }else{
                            numberInOrder = [];
                        }
                    })
                }
            });
            
            if(wonFields.length > 0){
                console.log("won");
                won = true;

                this.msg.edit(this.updateField(wonFields,false,true));
            }
        }

        return won;
    }
    fieldUsed(field, player){
        const obj = {};
        if(player){
            if(player === this.playerOne){
                //nur auf den ersten Spieler testen
                this.playerFields.playerOne.forEach((f) => {
                    if(f.col === field.col && f.row === field.row){
                        obj.icon = playerOneIcon;
                    }
                })
            }else{
                if(!obj.icon){
                     //nur auf den zweiten Spieler testen
                    this.playerFields.playerTwo.forEach((f) => {
                        if(f.col === field.col && f.row === field.row){
                            obj.icon = playerTwoIcon;
                        }
                    })
                } 
            }
        }else{
            this.playerFields.playerOne.forEach((f) => {
                if(f.col === field.col && f.row === field.row){
                    obj.icon = playerOneIcon;
                }
            })
            
            if(!obj.icon){
                this.playerFields.playerTwo.forEach((f) => {
                    if(f.col === field.col && f.row === field.row){
                        obj.icon = playerTwoIcon;
                    }
                })
            }
        }
           
    
        return obj;
    }
    updateField(markedFields, invalid, win){
        let text = `${this.currentPlayer}'s turn \n`;
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < columns; j++){
                let found = false;
                if(markedFields && markedFields.length > 0){
                    markedFields.forEach(field => {
                        if(field.col === j && field.row === i){
                            found = true;
                        }
                    });
                }
                if(found && (invalid || win)){
                    text += (invalid ? invalidIcon : winIcon) + "        ";
                }else{
                    const fieldSet = this.fieldUsed({col:j, row: i});
                    text +=  (fieldSet && fieldSet.icon ? fieldSet.icon : emptyIcon) + "        ";
                }
            }
            text += `\n \n`;
        }
    
        return text;
    }
    createField(){
        let text = `${this.currentPlayer}'s turn \n`
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < columns; j++){
                text += emptyIcon + "        ";
            }
            text += "\n \n";
        }
    
        return text;
    }
    filter(reaction, user) {
        return this.loaded && pressIcon.includes(reaction.emoji.name) && user.username === this.currentPlayer;
    };
}


function fourwins(interaction, args, client){
    new FourWins(interaction, args, client);
}


export default {
    startGame: fourwins
}