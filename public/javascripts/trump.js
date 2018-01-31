window.addEventListener('load', init);

function init() {
    const stage = new createjs.Stage('canvas');
    
    // タッチデバイス対応
    createjs.Touch.enable(stage);

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    stage.canvas.width = windowWidth;
    stage.canvas.height = windowHeight;

    const cardW = 58 * 4;
    const cardH = 89 * 4;

    // 摩擦係数
    let friction = 0.9;

    // mousedownしたときのマウスの座標とカードの座標間の距離
    var cardToMouseX, cardToMouseY; 
    var upperCardIndex;
    // カードの移動量
    let moveX, moveY;

    const cardsContainer = new createjs.Container();
    cardsContainer.x = 0;
    cardsContainer.y = 0;
    stage.addChild(cardsContainer);

    var cards = new Array(52);
    for(var i=0;i < 52;i++) {
        var card = new createjs.Shape();
        if (i % 2 == 0) {
            card.graphics.beginFill('LightBlue').beginStroke('Black').setStrokeStyle(2).drawRoundRect(0, 0, cardW, cardH, 20, 20);
        } else {
            card.graphics.beginFill('DarkTurquoise').beginStroke('Black').setStrokeStyle(2).drawRoundRect(0, 0, cardW, cardH, 20, 20);
        }
        card.x = i * 20;
        card.y = 0;
        /*
        var  cardHitArea = new createjs.Shape();
        cardHitArea.graphics.beginFill("#FFF").drawEllipse(0,0,300,200);
        card.hitArea = cardHitArea;
        */
        card.addEventListener('pressmove', handleMove);
        card.addEventListener('mousedown', handleDown);
        card.addEventListener('pressup', handleUp);

        cards[i] = { card: card, motionTimer: 0 };
        cardsContainer.addChild(cards[i].card); // 表示リストに追加
    }
    
    // デフォルトで24FPS
    createjs.Ticker.addEventListener('tick', handleTick);

    // 指を離したとき
    function handleUp(e) {    
        cards.forEach(c => {
            c.card.alpha = 1.0;
        });
    }

    // カードに触れたとき
    function handleDown(e) {
        console.log(e.nativeEvent.targetTouches);
        // マウス座標と接する一番上のカード
        const c = cardsContainer.getObjectUnderPoint(stage.mouseX,stage.mouseY);
            /*
            let mouseHitArea = new createjs.Shape();
            mouseHitArea.graphics.beginFill("#FFF").beginStroke('Black').setStrokeStyle(2).drawEllipse(0,0,300,200);
            mouseHitArea.x = c.x;
            mouseHitArea.y = c.y;
            stage.addChild(mouseHitArea);
            */
        upperCardIndex = c.id;
        cardToMouseX = stage.mouseX - c.x;
        cardToMouseY = stage.mouseY - c.y;
        c.alpha = 0.5;
        console.log(c);
    }

    function handleMove(e) {
        const draggingCard = cardsContainer.getObjectUnderPoint(stage.mouseX,stage.mouseY);
        //console.log('draggingCard: ' + draggingCard);
        if (draggingCard != null) {
            if (upperCardIndex != draggingCard.id) {
                upperCardIndex = draggingCard.id;
                cardToMouseX = stage.mouseX - draggingCard.x;
                cardToMouseY = stage.mouseY - draggingCard.y;
                draggingCard.alpha = 0.5;
            }
            moveX = stage.mouseX - cardToMouseX - draggingCard.x;
            moveY = stage.mouseY - cardToMouseY - draggingCard.y;
        
            cardsContainer.children.forEach((c,i) => {
                if (isCollision(draggingCard, c)) {
                    let cof = draggingCard.id == c.id ? 1.0 : 1.0 - friction;
                    c.x = c.x + moveX * cof;
                    c.y = c.y + moveY * cof;
                    cards[i].motionTimer = 1;
                }
            });
        }

        /*
        cards.forEach(c => {
            let index = cardsContainer.getChildIndex(c.card);
            let cof = 1.0 - friction * index;
            c.card.x = c.card.x + (stage.mouseX - c.dragPointX - c.card.x) * cof;
            c.card.y = c.card.y + (stage.mouseY - c.dragPointY - c.card.y) * cof;
            //if (c.isHit === true) {
                
                //c.card.x = stage.mouseX - c.dragPointX;
                //c.card.y = stage.mouseY - c.dragPointY;
            //}
        })*/
        //console.log(cardsContainer.getObjectsUnderPoint(stage.mouseX,stage.mouseY));
    }

    // 指を離した後の処理
    // カードのスライドを表現する
    function handleUpAfter() {
        cards.filter(c => c.motionTimer > 0).forEach((c,i) => {
            console.log(c.motionTimer);
            if (c.motionTimer > 15) {
                c.motionTimer = -1;
                c.card.alpha = 1.0;
                c.card.graphics.clear().beginFill('DarkTurquoise').beginStroke('Black').setStrokeStyle(2).drawRoundRect(0, 0, cardW, cardH, 20, 20);
            } else {
                c.card.x = c.card.x + moveX * 0.2;
                c.card.y = c.card.y + moveY * 0.2;
                c.motionTimer += 1;
                c.card.alpha = 0.4;
                c.card.graphics.clear().beginFill('Red').beginStroke('Black').setStrokeStyle(2).drawRoundRect(0, 0, cardW, cardH, 20, 20);
                
            }
        });
    }

    function handleTick() {
        handleUpAfter();
        stage.update();
    }

    // カードが重なり合っているかどうかを判定する
    function isCollision(c1, c2) {
        return (Math.abs(c1.x - c2.x) < cardW) && (Math.abs(c1.y - c2.y) < cardH);
    }
}
