window.addEventListener('load', init);

function init() {
    var stage = new createjs.Stage('canvas');
    
    // タッチデバイス対応
    createjs.Touch.enable(stage);
    
    const cardW = 58 * 4;
    const cardH = 89 * 4;

    // 摩擦係数
    let friction = 0.3;

    // mousedownしたときのマウスの座標とカードの座標間の距離
    var cardToMouseX, cardToMouseY; 
    var upperCardIndex;

    var cardsContainer = new createjs.Container();
    cardsContainer.x = 0;
    cardsContainer.y = 0;
    stage.addChild(cardsContainer);

    var cards = new Array(3);
    for(var i=0;i < 2;i++) {
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

        cards[i] = { card: card, isHit: false, dragPointX:0,dragPointY:0 };
        cardsContainer.addChild(cards[i].card); // 表示リストに追加
    }
    
    // デフォルトで24FPS
    createjs.Ticker.addEventListener('tick', handleTick);

    function handleUp(e) {    
        cards.forEach(c => {
            c.card.alpha = 1.0;
        });
    }

    function handleDown(e) {
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
    }

    function handleMove(e) {
        const draggingCard = cardsContainer.getObjectUnderPoint(stage.mouseX,stage.mouseY);
        console.log('draggingCard: ' + draggingCard);
        if (draggingCard != null) {
            if (upperCardIndex != draggingCard.id) {
                upperCardIndex = draggingCard.id;
                cardToMouseX = stage.mouseX - draggingCard.x;
                cardToMouseY = stage.mouseY - draggingCard.y;
                draggingCard.alpha = 0.5;
            }
            const moveX = stage.mouseX - cardToMouseX - draggingCard.x;
            const moveY = stage.mouseY - cardToMouseY - draggingCard.y;
        
            cardsContainer.children.forEach((c,i) => {
                if (isCollision(draggingCard, c)) {
                    let cof = draggingCard.id == c.id ? 1.0 : 1.0 - friction;
                    c.x = c.x + moveX * cof;
                    c.y = c.y + moveY * cof;
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
        console.log(cardsContainer.getObjectsUnderPoint(stage.mouseX,stage.mouseY));
    }
    
    function handleTick() {
        stage.update();
    }

    // カードが重なり合っているかどうかを判定する
    function isCollision(c1, c2) {
        return (Math.abs(c1.x - c2.x) < cardW) && (Math.abs(c1.y - c2.y) < cardH);
    }
}
