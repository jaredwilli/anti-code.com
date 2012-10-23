var Game = {
    options : [],
    init : function() {
        var items = document.getElementById('options'),
            choices = items.getElementsByTagName('a');

        for (var i = 0; i < choices.length; i++) {
            if (choices[i] === '') return;
            Game.options.push(choices[i].id);
            choices[i].addEventListener('click', Game.pick, false);
        }

    },
    pick : function(e) {
        e.preventDefault();
        
        //console.log(this.id, Game.options);
        Game.winner(this.id, Game.randomKey(Game.options));
    },
    winner : function(player, computer) {
        //console.log(player, computer);
        var pLow = '<h2>You</h2><img src="panels/panel7/'+ player.toLowerCase() +'.png" />',
            cLow = '<h2>Computer</h2><img src="panels/panel7/'+ computer.toLowerCase() +'.png" />',
            winStr = '';
        
        if (computer === 'Rock' && player === 'Paper' || computer === 'Scissors' && player === 'Rock' || computer === 'Paper' && player === 'Scissors') {
            winStr = 'You Win!!';
        } else if (computer === 'Paper' && player === 'Rock' || computer === 'Rock' && player === 'Scissors' || computer === 'Scissors' && player === 'Paper') {
            winStr = 'You Lose!';
        } else {
            winStr = 'Tie Play Again';
        }
        
        document.getElementById('player').innerHTML = pLow;
        document.getElementById('computer').innerHTML = cLow;
        document.getElementById('winner').innerHTML = winStr;
    },
    randomKey: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
};
Game.init();