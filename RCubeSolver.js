(function () {
    require(["dojo/dom",  "dojo/parser", "dojo/domReady!"],
        function (dom, parser,ready) {
            ready(function () {
                alert("Ready");
                parser.parse().then(function () {
                    alert("Done parsing");
                    document.body.style.opacity = 1;
                })
            })
        //Cube is oriented U,F,R,B,L,D  with colors 0-6 as W,R,B,O,G,Y
        var cube = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [2, 2, 2, 2, 2, 2, 2, 2, 2],
            [3, 3, 3, 3, 3, 3, 3, 3, 3],
            [4, 4, 4, 4, 4, 4, 4, 4, 4],
            [5, 5, 5, 5, 5, 5, 5, 5, 5]
        ];
        var left = dom.byId("btnLeft");
        var leftPrime = dom.byId("btnLeftPrime");
        var right = dom.byId("btnRight");
        var rightPrime = dom.byId("btnRightPrime");
        var down = dom.byId("btnDown");
        var downPrime = dom.byId("btnDownPrime");
        var front = dom.byId("btnFront");
        var frontPrime = dom.byId("btnFrontPrime");
        var back = dom.byId("btnBack");
        var backPrime = dom.byId("btnBackPrime");
        var up = dom.byId("btnUp");
        var upPrime = dom.byId("btnUpPrime");

        var reorientFL = dom.byId("btnReorientFrontLeft");
        var reorientFR = dom.byId("btnReorientFrontRight");
        var reorientUF = dom.byId("btnReorientUpFront");
        var reorientUB = dom.byId("btnReorientUpBack");
        var reorientUL = dom.byId("btnReorientUpLeft");
        var reorientUR = dom.byId("btnReorientUpRight");
 
    });

})();