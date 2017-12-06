window.addEventListener('load', init);

function init() {
    // Stageオブジェクトを作成します
    var stage = new createjs.Stage('canvas');

    let cardW = 58 * 4;
    let cardH = 89 * 4;

    var cardsContainer = new createjs.Container();
    cardsContainer.x = 0;
    cardsContainer.y = 0;
    stage.addChild(cardsContainer);
    var cards = new Array(3);
    for(var i=0;i < 2;i++) {
        var card = new createjs.Shape();
        card.graphics.beginFill("DeepSkyBlue").beginStroke('DarkGrey').setStrokeStyle(2).drawRoundRect(0, 0, cardW, cardH, 20, 20);
        card.x = i * 20;
        card.y = 0;
        card.addEventListener('pressmove', handleMove);
        card.addEventListener('mousedown', handleDown);
        card.addEventListener('pressup', handleUp);

        cards[i] = { card: card, isHit: false, dragPointX:0,dragPointY:0 };
        cardsContainer.addChild(cards[i].card); // 表示リストに追加
        console.log(card);
    }
    
    // デフォルトで24FPS
    createjs.Ticker.addEventListener('tick', handleTick);

    
    var dragPointX,dragPointY;

    function handleUp(e) {
        cards.forEach(c => {
            c.hit = false;
            card.alpha = 1.0;
        });
    }
    function handleDown(e) {
        cards.forEach(c => {
            let point = c.card.globalToLocal(stage.mouseX, stage.mouseY);
            
            let isHit = c.card.hitTest(point.x, point.y);
            c.hit = isHit;
            //if (isHit === true) {
                c.dragPointX = stage.mouseX - c.card.x;
                c.dragPointY = stage.mouseY - c.card.y;
                c.card.alpha = 0.5;
            //}
        });
        
    }
    function handleMove(e) {
        cards.forEach(c => {
            //if (c.isHit === true) {
                c.card.x = stage.mouseX - c.dragPointX;
                c.card.y = stage.mouseY - c.dragPointY;
            //}
        })

    }
    
    function handleTick() {
        //console.log(new Date());
/*
        cards.forEach(card => {
            let point = card.globalToLocal(stage.mouseX, stage.mouseY);

            let isHit = card.hitTest(point.x, point.y);

            if (isHit === true) {
                card.graphics.clear().beginFill("DarkRed").beginStroke('DarkGrey').drawRoundRect(0, 0, cardW, cardH, 20, 20);
                console.log(card.hitArea);
            } else {
                card.graphics.clear().beginFill("DeepSkyBlue").beginStroke('DarkGrey').drawRoundRect(0, 0, cardW, cardH, 20, 20);
            }

        })
*/
        // Stageの描画を更新します
        stage.update();
    }
}
