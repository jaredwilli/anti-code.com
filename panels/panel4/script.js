window.onload=function(){
    var Game = {
        init : function() {
            var choices = document.getElementsByTagName('a'),
                options = [];
            
            for (var i = 0; i < choices.length; i++) {
                var choice = choices[i];
                options.push(choice.id);
        
                choice.onclick = function(e) {
                    Game.pick(this.id, options);
                    e.preventDefault();
                };
            }
            
        },
        pick : function(player, options) {
            if (player) {
                Game.shuffle(options);
                Game.winner(player, options[0]);   
            }
        },
        winner : function(player, computer) {
            var win = '';
            console.log(player);
            console.log(computer);
            
            document.getElementById('player').innerHTML = '<h2>You</h2><img src="panels/panel4/'+ player.toLowerCase() +'.png" />';
            document.getElementById('computer').innerHTML = '<h2>Computer</h2><img src="panels/panel4/'+ computer.toLowerCase() +'.png" />';
            
            if (computer == 'Rock' && player == 'Paper' ||
                computer == 'Scissors' && player == 'Rock' ||
                computer == 'Paper' && player == 'Scissors') {
                
                win = 'You Win!!';
            }
            else if (computer == 'Paper' && player == 'Rock' ||
                     computer == 'Rock' && player == 'Scissors' ||
                     computer == 'Scissors' && player == 'Paper') {
            
                win = 'You Lose!';
            } else {
                if (player == computer) {
                    win = 'Tie Play Again';
                }
            }
            
            document.getElementById('winner').innerHTML = win;
            
        },
        shuffle : function(options) {
            for (var i = options.length - 1; i > 0; i--) {
                
                var rand = Math.floor(Math.random() * (i + 1)),
                    temp = options[i];
                
                options[i] = options[rand];
                options[rand] = temp;
            }
        }
    };

    Game.init();
}