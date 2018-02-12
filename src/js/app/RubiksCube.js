
define([
    "dojo/_base/declare", "dojo/dom","dojo/query", "dojo/dom-style","dojo/_base/lang","dojo/domReady!"
], function(declare, dom, query, domstyle,lang){
    return declare(null, {
        _cube: [],
        _turnReorientMatrix: {
            left :[             
            1,1,2,1,/*up to front */
            1,4,2,4,
            1,7,2,7,
            2,1,6,1,/*back to up */
            2,4,6,4,
            2,7,6,7,
            6,1,4,9,/*down to back */
            6,4,4,6,
            6,7,4,3,
            4,9,1,7,/*front to down */
            4,6,1,4,
            4,3,1,1,
            5,1,5,3,/*left side */
            5,2,5,6,
            5,3,5,9,
            5,4,5,2,
            5,6,5,8,
            5,7,5,1,
            5,8,5,4,
            5,9,5,7
            ],
            right: [
            1,3,4,7,/*up to back */
            1, 6,4,4,
            1, 9,4,1,
            2, 3,1,3,/*back to down */
            2, 6,1,6,
            2, 9,1,9,
            6, 3,2,3,/*down to front */
            6, 6,2,6,
            6, 9,2,9,
            4, 1, 6,9,/*front to up */
            4, 4, 6,6,
            4, 7, 6,3,
            3, 1, 3, 3,/*right side */
            3, 2, 3, 6,
            3, 3, 3, 9,
            3, 4, 3, 2,
            3, 6, 3, 8,
            3, 7, 3, 1,
            3, 8, 3, 4,
            3, 9, 3, 7
            ],
            front: [
            1, 7, 3, 1,/*up to back */
            1, 8, 3, 4,
            1, 9, 3, 7,
            5, 3, 1, 9,/*back to down */
            5, 6, 1, 8,
            5, 9, 1, 7,
            6, 1, 5, 3,/*down to front */
            6, 2, 5, 6,
            6, 3, 5, 9,
            3, 1, 6, 3,/*front to up */
            3, 4, 6, 2,
            3, 7, 6, 1,
            2, 1, 2, 3,/*front side */
            2, 2, 2, 6,
            2, 3, 2, 9,
            2, 4, 2, 2,
            2, 6, 2, 8,
            2, 7, 2, 1,
            2, 8, 2, 4,
            2, 9, 2, 7
            ],
            back: [
            1,1,5,1,/*up to back */
            1, 2,5,4,
            1, 3, 5, 7,
            5,1,6,7,/*back to down */
            5,4,6,8,
            5,7,6,9,
            6, 9, 3, 3,/*down to front */
            6, 8, 3, 6,
            6, 7, 3, 9,
            3, 9, 1, 3,/*front to up */
            3, 6, 1, 2,
            3, 3, 1, 1,
            4, 1, 4, 3,/*front side */
            4, 2, 4, 6,
            4, 3, 4, 9,
            4, 4, 4, 2,
            4, 6, 4, 8,
            4, 7, 4, 1,
            4, 8, 4, 4,
            4, 9, 4, 7
            ],
            up: [
            2, 1, 5, 1,/*up to back */
            2, 2, 5, 2,
            2, 3, 5, 3,
            3, 1, 2, 1,/*back to down */
            3, 2, 2, 2,
            3, 3, 2, 3,
            4, 1, 3, 1,/*down to front */
            4, 2, 3, 2,
            4, 3, 3, 3,
            5, 1, 4, 1,/*front to up */
            5, 2, 4, 2,
            5, 3, 4, 3,
            1, 1, 1, 3,/*front side */
            1, 2, 1, 6,
            1, 3, 1, 9,
            1, 4, 1, 2,
            1, 6, 1, 8,
            1, 7, 1, 1,
            1, 8, 1, 4,
            1, 9, 1, 7
            ],
            down: [
            2, 7, 3, 7,/*up to back */
            2, 8, 3, 8,
            2, 9, 3, 9,
            3, 7, 4, 7,/*back to down */
            3, 8, 4, 8,
            3, 9, 4, 9,
            4, 7, 5, 7,/*down to front */
            4, 8, 5, 8,
            4, 9, 5, 9,
            5, 7, 2, 7,/*front to up */
            5, 8, 2, 8,
            5, 9, 2, 9,
            6, 1, 6, 3,/*front side */
            6, 2, 6, 6,
            6, 3, 6, 9,
            6, 4, 6, 2,
            6, 6, 6, 8,
            6, 7, 6, 1,
            6, 8, 6, 4,
            6, 9, 6, 7
            ]

        },
        constructor : function(){
            console.log("constructor");
            this.ResetCube();

        },
        CubeState: function () {
            return this._cube;
        },
        RandomizeCube: function () {
            for (i = 0; i < 100 ; i++) {
                var move = Math.floor(Math.random() * 3);
                switch(move)
                {
                    case 0:
                        this.Turn("Left");
                        break;
                    case 1:
                        this.Turn("Right");
                        break;
                    case 2:
                        this.Turn("Front");
                        break;

                }
            }
            //Math.floor(Math.random() * 10);
            return this._cube;
            this._cube = [
                [2,4,4,0,0,0,0,3,0],
                [1,0,1,1,1,2,3,5,3],
                [2,2,5,3,2,5,4,4,5],
                [1,1,3,3,3,4,1,1,3],
                [0,4,4,3,4,0,0,2,2],
                [5,1,5,5,5,5,4,2,2]
            ]
        },
        ResetCube: function(){
            this._cube = [
                [0,0,0,0,0,0,0,0,0],
                [1,1,1,1,1,1,1,1,1],
                [2,2,2,2,2,2,2,2,2],
                [3,3,3,3,3,3,3,3,3],
                [4,4,4,4,4,4,4,4,4],
                [5,5,5,5,5,5,5,5,5]
            ]
        },
        // 0     1      2       3         4      5 
        Colors : ["white","red", "blue", "orange", "lime","yellow"],

        RecolorCube: function (arrayOfTables_UFRBLD){
            for(var tableIndex = 0 ; tableIndex < arrayOfTables_UFRBLD.length; tableIndex++){
                var table = arrayOfTables_UFRBLD[tableIndex];
                var tdsInTable  = query("tr td", table);
                var sideArray = this._cube[tableIndex];
                for(var tdIndex = 0; tdIndex < 9; tdIndex ++){
                    var color =  this.Colors[sideArray[tdIndex]];
                    domstyle.set(tdsInTable[tdIndex],"background-color", color);
                }
            }
        },

        Recolor3DCube : function () {

        },

        Turn: function (direction) {
            var turnArray = this._turnReorientMatrix.left;
            switch(direction){
                case "Left":
                    turnArray = this._turnReorientMatrix.left
                    break;
                case "Right":
                    turnArray = this._turnReorientMatrix.right
                    break;
                case "Front":
                    turnArray = this._turnReorientMatrix.front
                    break;
                case "Back":
                    turnArray = this._turnReorientMatrix.back
                    break;
                case "Up":
                    turnArray = this._turnReorientMatrix.up
                    break;
                case "Down":
                    turnArray = this._turnReorientMatrix.down
                    break;
            }
            var copy = lang.clone(this._cube);// this._cube.slice();
            for (var i = 0; i < turnArray.length; i = i + 4) {
                var fromSide = turnArray[i] - 1;
                var fromTile = turnArray[i + 1] - 1;
                var toSide = turnArray[i + 2] - 1;
                var toTile = turnArray[i + 3] - 1;
                var fromColorIndex = this._cube[fromSide][fromTile];
                //var fromColor = this.Colors[fromColorIndex];
                copy[toSide][toTile] = fromColorIndex;
            }
            this._cube = copy;
            return this._cube;
        },
        Reorient : function(direction){
            return _cube;
        }

    });
});




//define(["dojo/_base/declare", "dojo/on", "dojo/dom", "dojo/ready"],
//    function (declare,on, dom, ready) {
//        console.log("In define");

//        return declare(null, "RubiksCube", null, {

//            constructor: function () {
//                console.log("Rubiks cube constructor");
//                /*this.Cube = [                
//                    [0,1,2,3,4,5],
//                    [0,1,2,3,4,5],
//                    [0,1,2,3,4,5],
//                    [0,1,2,3,4,5],
//                    [0,1,2,3,4,5],
//                    [0,1,2,3,4,5]
//                ];*/
//            }/*,
//            Cube : [] ,
//            SolvedCube :  [
//                    [0,0,0,0,0,0,0,0,0],
//                    [1,1,1,1,1,1,1,1,1],
//                    [2,2,2,2,2,2,2,2,2],
//                    [3,3,3,3,3,3,3,3,3],
//                    [4,4,4,4,4,4,4,4,4],
//                    [5,5,5,5,5,5,5,5,5]
//            ],
//            Left: function(){
//                this.Cube = [                
//                    [5,1,2,3,4,0],
//                    [5,1,2,3,4,0],
//                    [5,1,2,3,4,0],
//                    [5,1,2,3,4,0],
//                    [5,1,2,3,4,0],
//                    [5,1,2,3,4,0]
//                ];
//            },
//            Reset: function () {
//                Cube = SolvedCube;
//            }
//            */
//        });
//    }
//);