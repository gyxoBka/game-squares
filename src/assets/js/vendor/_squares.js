games.squares = function (options) {
    let score = 0, isGameStarted = false

    let $wrapper, $game, $gameTime
    let gameTime = options.gameTime || 5

    function startGame() {
        score = 0
        isGameStarted = true

        $gameTime.setAttribute('disabled', 'true')
        
        _updateStartBtn()
        _renderSquare()

        let $title = _setGameTitle(`Время игры: <span>${gameTime}</span> сек.`)
        let $time = $title.querySelector('span')

        let interval = setInterval(() => {
            let time = parseFloat($time.textContent)

            if(time <= 0) {
                clearInterval(interval)
                _endGame()
                return
            }

            $time.textContent = (time - 0.1).toFixed(1)
        }, 100);
    }

    function _endGame() {
        isGameStarted = false

        _setGameTitle(`Время вышло. Ваш результат: <span>${score}</span>`)
        _updateStartBtn()

        $game.innerHTML = ''
        $gameTime.removeAttribute('disabled')
    }

    function _createHeader($el) {
        const header = document.createElement('div')
        header.classList.add('squares__header')

        header.insertAdjacentHTML('afterbegin', `
            <div class="squares__title">Время игры: <span>${gameTime}</span> сек.</div>
        `)

        $el.appendChild(header)

        return header
    }

    function _createFooter($el) {
        const footer = document.createElement('div')
        footer.classList.add('squares__footer')

        footer.insertAdjacentHTML('afterbegin', `
            <div class="squares__input">
                <label for="game-time">Время игры, (сек)</label>
                <input type="number" id="game-time" min="5" step="1" value="5">
            </div>
        `)

        $el.appendChild(footer)

        return footer
    }

    function _createGame($el) {

        const gameField = document.createElement('div')
        gameField.classList.add('squares')
        gameField.setAttribute('data-game', 'squares')
        _createHeader(gameField)

        const gameContent = document.createElement('div')
        gameContent.classList.add('squares__content')

        gameContent.insertAdjacentHTML('afterbegin', `
            <button class="btn" data-start="start">Начать</button>
            <div class="squares__field" id="game"></div>
        `)

        gameField.appendChild(gameContent)

        _createFooter(gameField)

        $el.appendChild(gameField)

        return gameField
    }

    function _renderSquare() {
        $game.innerHTML = ''
    
        const square = document.createElement('div')
        const boxSize = _getRand(40, 100)
        const gameSize = $game.getBoundingClientRect()
        const maxTop = gameSize.height - boxSize
        const maxLeft = gameSize.width - boxSize
    
        square.style.height = square.style.width = boxSize + 'px'
        square.style.position = 'absolute'
        square.style.borderRadius = '.5rem'
        square.style.backgroundColor = _getRandColor(_getRand(1, 5))
        square.style.top = _getRand(0, maxTop) + 'px'
        square.style.left = _getRand(0, maxLeft) + 'px'
        square.style.cursor = 'pointer'
        square.setAttribute('data-square', 'square')
    
        $game.insertAdjacentElement('afterbegin', square)
    }

    function _updateStartBtn() {
        const btn = $gameField.querySelector('[data-start]')
        btn.classList.toggle('hide')
    }

    function _setGameTitle(title) {
        let $title = $gameField.querySelector('.squares__title')
        $title.innerHTML = title

        return $title
    }

    function _getRand(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    }
    
    function _getRandColor(brightness){
        let RGB = [Math.random() * 256, Math.random() * 256, Math.random() * 256]
        let mix = [brightness * 51, brightness * 51, brightness * 51]
        var mixedRGB = [RGB[0] + mix[0], RGB[1] + mix[1], RGB[2] + RGB[2]].map(function(x){ return Math.round(x/2.0) })
        return "rgb(" + mixedRGB.join(",") + ")";
    }

    const squareGame = {
        init() {
            $wrapper = document.querySelector(options.wrapper || '.app')

            if(!$wrapper) return

            score = 0
            isGameStarted = false

            $gameField = _createGame($wrapper)
            $game = $gameField.querySelector('#game')
            $gameTime = $gameField.querySelector('#game-time')

            $gameField.addEventListener('click', fieldClickHandler)
            $gameTime.addEventListener('input', setGameTime)
        }
    }

    function fieldClickHandler(e) {
        const target = e.target
        
        if(target.dataset.start) {
            startGame()
            return
        }

        if(target.dataset.square) {
            score++
            _renderSquare()
            return
        }
    }

    function setGameTime() {
        if(isGameStarted)
            return

        gameTime = $gameTime.valueAsNumber
    }

    return Object.assign(squareGame, {
        destroy() {
            if(!$wrapper) return

            $wrapper.removeChild($gameField)

            $gameField.removeEventListener('click', fieldClickHandler)
            $gameTime.removeEventListener('input', setGameTime)

            $wrapper = null
        }
    })
}