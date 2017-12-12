window.addEventListener('load', init);

function init() {
    // Stageオブジェクトを作成します
    var stage = new createjs.Stage('canvas');

    let cardW = 58 * 4;
    let cardH = 89 * 4;

    let friction = 0.9;

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
            c.card.alpha = 1.0;
        });
    }
    function handleDown(e) {
        cards.forEach((c,i) => {
            let point = c.card.globalToLocal(stage.mouseX, stage.mouseY);
            
            let isHit = c.card.hitTest(point.x, point.y);
            c.hit = isHit;
            //if (isHit === true) {
                cards[i].dragPointX = stage.mouseX - c.card.x;
                cards[i].dragPointY = stage.mouseY - c.card.y;
                c.card.alpha = 0.5;
                console.log();
            //}
        });
        /*
        cards.forEach(c => {
            let point = c.card.globalToLocal(stage.mouseX, stage.mouseY);
            
            let isHit = c.card.hitTest(point.x, point.y);
            c.hit = isHit;
            //if (isHit === true) {
                c.dragPointX = stage.mouseX - c.card.x;
                c.dragPointY = stage.mouseY - c.card.y;
                c.card.alpha = 0.5;
                console.log();
            //}
        });
        */
    }
    function handleMove(e) {
        cardsContainer.getObjectsUnderPoint(stage.mouseX,stage.mouseY).forEach((c,i) => {
            let index = cardsContainer.getChildIndex(c);
            let cof = 1.0 - friction * index;
            c.x = c.x + (stage.mouseX - cards[i].dragPointX - c.x) * cof;
            c.y = c.y + (stage.mouseY - cards[i].dragPointY - c.y) * cof;
            //if (c.isHit === true) {
                
                //c.card.x = stage.mouseX - c.dragPointX;
                //c.card.y = stage.mouseY - c.dragPointY;
            //}
        });
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
