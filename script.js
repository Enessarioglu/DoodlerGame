
document.addEventListener("DOMContentLoaded", () => {
    console.log('loaded');
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');

    let doodlerLeft;
    let doodlerBottom;
    let idDoodlerMove;
    let pressingButtons = []

    const platAccelerate = 2;
    const platformCount = 5;
    let platforms = [];
    let idMovePlatforms;
    let score = 0;

    let autoJump = true;
    let idGravity;
    let velocity = 25;//position change amount per 30 milisecond
    const accelerate = 1.2;//graviti force, speed changing amount per 30 milisecond

    function createDoodler() {
        doodlerLeft = platforms[0].left + ((85 - 50) / 2);
        doodlerBottom = platforms[0].bottom + 15;

        doodler.style.bottom = doodlerBottom + 'px';
        doodler.style.left = doodlerLeft + 'px';

        doodler.classList.add('doodler');

        grid.appendChild(doodler);
    }

    function movePlatforms() {
        if (doodlerBottom > 100) {
            platforms.forEach(element => {
                element.bottom -= platAccelerate;

                if (doodlerBottom > 200) {
                    element.bottom -= platAccelerate;
                }
                if (doodlerBottom > 300) {
                    element.bottom -= platAccelerate;
                }
                if (doodlerBottom > 400) {
                    element.bottom -= platAccelerate;
                }
                if (element.bottom < 0) {
                    element.div.remove();

                    platforms.shift();

                    platforms.push(new Platform(580));

                    score++;
                   
                }

                element.div.style.bottom = element.bottom + 'px';

            });
        }
    }

    class Platform {
        constructor(platBottom) {
            this.bottom = platBottom;
            this.left = Math.random() * (600 - 85);

            this.div = document.createElement('div');

            this.div.style.bottom = this.bottom + 'px';
            this.div.style.left = this.left + 'px';

            this.div.classList.add('platform');
            grid.appendChild(this.div);
        }
    }
    function createPlatforms() {
        const platGap = 600 / platformCount;//the gap between platforms

        for (let i = 0; i < platformCount; i++) {
            let newPlatBottom = 100 + i * platGap;
            let platform = new Platform(newPlatBottom);
            platforms.push(platform);

        }

    }

    function jump(power) {
        velocity = power;
    }

    function gameOver() {
        console.log('game over your score is ' + score);
        clearInterval(idDoodlerMove);
        clearInterval(idGravity);
        clearInterval(idMovePlatforms);

        platforms.forEach(element => {
            element.div.remove();
        });

        document.querySelector('.gameover').style.display = 'block';
        document.querySelector('#score').innerHTML = 'Your score is ' + score;
    }

    function gravity() {
        let nextBottom = doodlerBottom + velocity;

        if (velocity < 0) {
            if (nextBottom < 0) {


                nextBottom = 0; velocity = 0;

                gameOver();
            } else {
                platforms.forEach(element => {//50,85 is doodler,plat width
                    if (
                        doodlerLeft + 50 > element.left &&
                        doodlerLeft < element.left + 85 &&
                        nextBottom < element.bottom + 15 &&//15 doodler height
                        doodlerBottom >= element.bottom + 15) {
                        //landed on platform
                        
                        nextBottom = element.bottom + 15;
                        if (autoJump) {
                            jump(25);
                        } else {
                            velocity = 0;
                        }

                    }
                });
            }



        } else if (velocity > 0) {
            if (doodlerBottom > 500) {
                velocity -= 1;
                nextBottom -= velocity;
            }

        }


        doodlerBottom = nextBottom;
        doodler.style.bottom = doodlerBottom + 'px';
        velocity -= accelerate;

    }

    function moveDoodler(direction, pixel) {

        switch (direction) {
            case 'right':
                //go right
                //when gone if doodlerleft + doodlerwidth is > than grid width
                //then left = 0
                doodlerLeft += pixel;

                if (doodlerLeft + 50 > 600) {
                    doodlerLeft = 0;
                }
                break;

            case 'left':
                //go left
                //when gone left if the doodler left < 0
                //then left = grid width - doodlerweight 
                doodlerLeft -= pixel;
                if (doodlerLeft < 0) {
                    doodlerLeft = 600 - 50;
                }
                break;

            case 'straight':
                //go straight so up
                break;

            case 'down':
                //go down
                break;


        }

        doodler.style.left = doodlerLeft + 'px';
    }


    function keyEvent(event) {

        if (event.type === 'keydown') {
            //prevent having more than one from a button in the pressingButtons. 
            let preClicked = false;
            for (let i = 0; i < pressingButtons.length; i++) {
                //if chicked key already exists in the pressing buttons
                if (pressingButtons[i] === event.key) {
                    preClicked = true;
                }
            }   //if chicked key doesn't exists in the pressing buttons
            if (!preClicked) {
                pressingButtons.push(event.key);
            }


        } else if (event.type === 'keyup') {
            pressingButtons = pressingButtons.filter((key) => key != event.key);

        }
    }

    document.addEventListener('keydown', keyEvent);
    document.addEventListener('keyup', keyEvent);

    function start() {

        createPlatforms();

        createDoodler();
        idGravity = setInterval(gravity, 30);
        idMovePlatforms = setInterval(movePlatforms, 30);

        idDoodlerMove = setInterval(() => {
            let direction = 'straight';
            for (let i = 0; i < pressingButtons.length; i++) {

                if (pressingButtons[i] === 'ArrowLeft' || pressingButtons[i] === 'ArrowRight') {

                    if (pressingButtons[i] === 'ArrowRight') {
                        direction = 'right';
                    } else if (pressingButtons[i] === 'ArrowLeft') {
                        direction = 'left';
                    }

                    i = pressingButtons.length;
                }

            }

            moveDoodler(direction, 2)
        }, 10);

    }

    start();
});