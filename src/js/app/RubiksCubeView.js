
define(["dojo/_base/declare", "dojo/on", "dojo/dom", "dojo/dom-style", 'app/RubiksCube', "dojox/collections/Queue", "dojox/collections/Dictionary",
    "dojo/_base/array", "dojox/timing", "dojox/math/random/Simple", "dojo/dom-class", "dijit/Dialog"],
    function (declare, on, dom,domStyle, RubiksCube, Queue, Dictionary, array,t, rand,domClass,Dialog) {
        var _canvas;
        var _backCanvas;
        var _ctxBack;
        //var _foldCanvas;
        //var _ctxFoldOut;
    var _ctx;
    var _txtCubeCoords;
    var _requestReveal = false; //13,400 - 180,376
    var _lastRequestType = "Normal"; //"Normal" or "Reveal"
    var _cube = [];
    var t = new dojox.timing.Timer(1000);
    var counter = 0;
    var howRandom = 6;
    t.onTick = function () {
        return;
        counter++;
        if(counter > 10){
            t.stop();
            return;
        }
        var ra = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var rnd = new dojox.math.random.Simple();
        rnd.nextBytes(ra);

        var tdArray = dojo.query('.rcTitleTD');
        var colors = ["rgba(255,0,0,255)", "rgba(255,165,0,255)", "rgba(255,255,255,255)", "rgba(0,255,0,255)", "rgba(255,255,0,255)", "rgba(0,0,255,255)"];
        var upperEnd = 256 - (26 * counter);

        for (var r = 0 ; r < 3; r++) {
            for (var c = 0 ; c < 18; c++) {
                var index = (r * 18)+ c;
                var td = tdArray[index];
                var group = Math.floor(c / 3);
                if (group > 5) {
                    group = group - 6;
                }
                if (ra[index] < upperEnd) {
                    var color = ra[index] / (256 / howRandom);
                    var rounded = Math.floor(color); //on the first pass, this is the color index used
                }
                else {
                    rounded = group;
                }
                var colorName = colors[rounded];
                domStyle.set(tdArray[index], "background-color", colorName);
            }

        }
        //for (i = 0; i < (42 * 3) ; i++) {
        //    var color = ra[i] / (256 / howRandom);
        //    var rounded = Math.floor(color);
        //    var grouping = i % 3;
        //    rounded = Math.floor(rounded + (6 - howRandom));
        //    console.log(rounded);
        //    if (rounded > 5) {
        //        debugger;
        //    }
        //    var colorName = colors[rounded];
        //    domStyle.set(tdArray[i], "background-color", colorName);
        //}

        //console.log(ra);
    }
    t.onStart = function () {
        console.info("Starting timer");
    }
    t.start();

    var GetMousePos = function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        //return {
        //    x: evt.clientX - rect.left,
        //    y: evt.clientY - rect.top
        //};
        return {
            x: 2 * ( (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
            y: 2 * ( (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height )
        };
    };
    var ReplaceAll = function (str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    function rgb2hsl(rgbArr) {
        var r1 = rgbArr[0] / 255;
        var g1 = rgbArr[1] / 255;
        var b1 = rgbArr[2] / 255;

        var maxColor = Math.max(r1, g1, b1);
        var minColor = Math.min(r1, g1, b1);
        //Calculate L:
        var L = (maxColor + minColor) / 2;
        var S = 0;
        var H = 0;
        if (maxColor != minColor) {
            //Calculate S:
            if (L < 0.5) {
                S = (maxColor - minColor) / (maxColor + minColor);
            } else {
                S = (maxColor - minColor) / (2.0 - maxColor - minColor);
            }
            //Calculate H:
            if (r1 == maxColor) {
                H = (g1 - b1) / (maxColor - minColor);
            } else if (g1 == maxColor) {
                H = 2.0 + (b1 - r1) / (maxColor - minColor);
            } else {
                H = 4.0 + (r1 - g1) / (maxColor - minColor);
            }
        }

        L = L * 100;
        S = S * 100;
        H = H * 60;
        if (H < 0) {
            H += 360;
        }
        var result = [H, S, L];
        return result;
    }
   
    var __PaintCube = function (coordinateText, context) {
        //return;
        //var uFaceCoords = [[9, 26], [67, 18], [95, 34], [35, 45], [69, 17], [126, 9], [154, 23], [96, 34], [127, 9], [169, 2], [199, 14], [155, 23], [35, 45], [95, 34], [129, 52], [66, 65], [98, 34], [155, 23], [192, 40], [129, 52], [157, 23], [200, 14], [241, 30], [193, 41], [66, 65], [131, 52], [174, 78], [107, 93], [131, 53], [193, 41], [239, 63], [175, 78], [195, 41], [243, 31], [291, 51], [239, 64] ];
        var uFaceCoords = [[11, 27], [67, 18], [94, 34], [39, 46], [68, 19], [125, 9], [152, 23], [94, 35], [127, 10], [170, 4], [196, 15], [154, 23], [39, 45], [94, 34], [126, 53], [67, 66], [96, 35], [154, 23], [188, 42], [127, 53], [154, 24], [198, 14], [235, 31], [188, 41], [67, 66], [127, 55], [170, 79], [107, 93], [127, 53], [189, 41], [236, 64], [170, 79], [191, 40], [238, 31], [284, 52], [236, 64]];
        var fFaceCoords = [[108, 94], [170, 80], [169, 148], [108, 165], [171, 80], [236, 65], [234, 129], [169, 148], [236, 64], [285, 53], [280, 116], [234, 129], [108, 165], [169, 149], [167, 215], [108, 236], [169, 148], [234, 129], [231, 193], [168, 215], [234, 129], [280, 116], [275, 178], [232, 193], [108, 237], [167, 216], [167, 274], [107, 298], [167, 216], [231, 194], [229, 249], [166, 275], [232, 193], [275, 179], [270, 232], [229, 249]];
        var lFaceCoords = [[10, 27], [40, 48], [39, 112], [11, 91], [39, 47], [66, 67], [67, 134], [38, 112], [67, 67], [107, 94], [108, 166], [67, 135], [12, 91], [39, 111], [39, 171], [14, 147], [39, 112], [67, 135], [68, 199], [39, 170], [68, 135], [108, 167], [108, 236], [68, 200], [15, 148], [39, 171], [39, 221], [17, 196], [40, 172], [68, 200], [67, 252], [39, 221], [68, 200], [108, 238], [106, 295], [67, 254]];
        
        //var c2 = canvas.getContext('2d');

        //DrawCube(false);
        var faces = [uFaceCoords, fFaceCoords, lFaceCoords];
        var colors = [[255,255,255], [255,0,0], [0,0,255],[255,144,51], [0,255,0], [255,255,0]];
        for (i = 0 ; i < faces.length; i++) {
            var faceCoords = faces[i];
            var cubeFace = _cube.CubeState()[i];
            if (i == 2)
            {
                cubeFace = _cube.CubeState()[4];//Left Face
            }
            var tileCounter = 0;
            for (j = 0 ; j < faceCoords.length; j = j + 4) {
                var rgb = colors[cubeFace[tileCounter]];
                var r = [rgb[0]];
                var g = [rgb[1]];
                var b = [rgb[2]];
                var hsl = rgb2hsl([r, g, b]);
                var h = hsl[0];
                var s = hsl[1];
                var l = hsl[2];
                if (isNaN(h))
                {
                    h = 0;
                }
                if (isNaN(s)) {
                    s = 0;
                }
                if (isNaN(l)) {
                    l = 0;
                }
                l = l - (i * .1 * l);
                var hslString = "hsl(" + h.toString() + "," + s.toString() + "%," + l.toString() + "%)";
            
                context.fillStyle = hslString; //colors[cubeFace[tileCounter]];
                context.beginPath();
                context.moveTo(faceCoords[j][0], faceCoords[j][1]);
                context.lineTo(faceCoords[j + 1][0], faceCoords[j + 1][1]);
                context.lineTo(faceCoords[j + 2][0], faceCoords[j + 2][1]);
                context.lineTo(faceCoords[j + 3][0], faceCoords[j + 3][1]);
                //c2.lineTo(faceCoords[j+4][0], faceCoords[j+4][1]);
                context.closePath();
                context.fill();
                tileCounter++;
            }
        }
        DrawCube(coordinateText, context);
    }

    var __DrawCube3D = function (context, faces) {


    }

    var DrawFoldoutView = function () {
        return;
        var foldoutCanvas = dom.byId('foldoutCanvas');
        var foldoutCtx = foldoutCanvas.getContext("2d");
        foldoutCtx.lineWidth = 2;
        var tileSize = 30;

        var img = document.getElementById("unsettile");
        var pat = foldoutCtx.createPattern(img, "repeat");
        foldoutCtx.rect((tileSize * 3), 0, (tileSize * 3), (tileSize * 12));
        foldoutCtx.fillStyle = pat;
        foldoutCtx.fill();
        foldoutCtx.rect(0, (tileSize * 3), (tileSize * 9), (tileSize * 3));
        foldoutCtx.fillStyle = pat;
        foldoutCtx.fill();
        foldoutCtx.strokeStyle = "#000000";

        for (x = 0; x < 3; x++) {
            for (y = 0; y < 12; y++) {
                foldoutCtx.beginPath();
                var xStart = (tileSize*3) + (x * tileSize);
                var yStart = 0 + (tileSize * y);
                foldoutCtx.moveTo(xStart, yStart);
                foldoutCtx.lineTo(xStart + tileSize, yStart);
                foldoutCtx.lineTo(xStart + tileSize, yStart + tileSize);
                foldoutCtx.lineTo(xStart, yStart + tileSize);
                foldoutCtx.lineTo(xStart, yStart);
                foldoutCtx.stroke();
                //break;
            }
            //break;
        }
        for (y = 0; y < 3; y++) {
            for (x = 0; x < 9; x++) {
                foldoutCtx.beginPath();
                xStart = 0 + (x * tileSize);
                yStart = (3*tileSize) + (tileSize * y);
                
                foldoutCtx.moveTo(xStart, yStart);
                foldoutCtx.lineTo(xStart + tileSize, yStart);
                foldoutCtx.lineTo(xStart + tileSize, yStart + tileSize);
                foldoutCtx.lineTo(xStart, yStart + tileSize);
                foldoutCtx.lineTo(xStart, yStart);
                foldoutCtx.stroke();
                //break;
            }
            //break;
        }

    }


    var DrawCube = function ( txtAreaText, ctx) {
        try {
            //if (clearCanvas === true || clearCanvas === undefined) {
            //    ctx.fillStyle = "rgba(255,255,255,0)";
            //    ctx.fillRect(0, 0, _canvas.width, _canvas.height);
            //}

            var lineStylesAndCoords = txtAreaText.split('@');
            for (g = 0; g < lineStylesAndCoords.length; g++) {
                var lineStyleAndCoord = lineStylesAndCoords[g];
                var lineStyle = lineStyleAndCoord.split('$')[0];
                ctx.lineWidth = parseInt(lineStyle.split(',')[0]);
                var strokeStyle = "rgba(" + lineStyle.split(',')[1] + "," +
                  lineStyle.split(',')[2] + "," + lineStyle.split(',')[3] + "," + lineStyle.split(',')[4] + ")";
                ctx.strokeStyle = strokeStyle;
                var coordstring = lineStyleAndCoord.split('$')[1];
                var moveTo = coordstring.split(':');
                for (h = 0; h < moveTo.length; h++) {
                    var coords = moveTo[h].split(';');
                    var atLineStart = true;
                    for (i = 0; i < coords.length; i++) {
                        var coordPair = coords[i];
                        var xy = coordPair.split(',');
                        var x = parseInt(xy[0]);
                        var y = parseInt(xy[1]);
                        if (atLineStart) {
                            ctx.beginPath();
                            ctx.moveTo(x, y);
                            atLineStart = false;
                        } //first time through the loop start the path
                        else {
                            ctx.lineTo(x, y);
                        }

                    } //Loop through coordinates
                    ctx.stroke();
                    //_ctx.font = "16px Tahoma";
                    //_ctx.fillStyle = "black";
                    //_ctx.fillText("Reveal Hidden Sides", 350, 40);
                }
            }


        } catch (ex) {
            //  .Log(ex, true);
            console.log(ex);
        } //catch
    }



    return declare(null, {
        //PaintCube : function(queue, boolFrontside){
        //    return __PaintCube(_ctx );
        //},
        constructor: function () {
            console.log("Rubiks cube view constructor");
            try {

                _canvas = dom.byId('canvas');
                _backCanvas = dom.byId('backCanvas');
                //_foldCanvas = dom.byId('foldoutCanvas');
                _ctxBack = _backCanvas.getContext("2d");
                //_ctxFoldOut = _foldCanvas.getContext("2d");
                _ctx = _canvas.getContext("2d");
                _ctx.scale(.5, .5);
                _ctxBack.scale(.5, .5);
                //_ctxFoldOut.scale(.5, .5);

                _cubeVertexString = "";
                var txtAreaText = dom.byId('txtCubeCoords').value;
                var txtAreaTextBack = dom.byId('txtBackCubeCoords').value;

                //_ctx.fillStyle = "gray";
                //_ctx.fillRect(0, 0, _canvas.width, _canvas.height);
                var cube = new RubiksCube();
                _cube = cube;
                //cube.RecolorCube([dom.byId("tabUp"), dom.byId("tabFront"), dom.byId("tabRight"), dom.byId("tabBack"), dom.byId("tabLeft"), dom.byId("tabDown")]);
                //on(dom.byId("btnDrawCube"), "click", function (e) {
                //    DrawCube(txtAreaText, _ctx);
                //});


                on(dom.byId("canvas"), "click", function (e) {
                    _cubeVertexString += "[" + e.offsetX + "," + e.offsetY + "]" + ",";
                    console.log(_cubeVertexString);

                    this.RecolorCubeViews();



                });


                on(dom.byId("btnSetup"), "click", function (e) {
                    myDialog = new Dialog({
                        title: "Rubik's Cube Tutor Settings",
                        //content: "Test content.",
                        href:"../../src/html/setup.html",
                        style: "width: 300px"
                    });
                    myDialog.show();
                });

                on(dom.byId("canvas"), "mousemove", function (e) {

                    var canvasCoords = GetMousePos(_canvas, e);
                    var cc = dom.byId('divCanvasCoords');
                    //if (canvasCoords.x > 352 && canvasCoords.y > 22 && canvasCoords.x < 500 && canvasCoords.y < 38) {
                    //    _requestReveal = true;
                    //} else {
                    //    _requestReveal = false;
                    //}
                    //if (_lastRequestType == "Normal" && _requestReveal) {
                    //    DrawCube( txtAreaText);
                    //}
                    //if (_lastRequestType == "Reveal" && _requestReveal === false) {
                    //    DrawCube( txtAreaText);
                    //}
                    //_lastRequestType = "Normal";
                    //if (_requestReveal) {
                    //    _lastRequestType = "Reveal";
                    //}
                    cc.innerText = canvasCoords.x.toString() + "," + canvasCoords.y.toString();
                });

                var leftRef = dom.byId("btnLeft");
                var leftPrimeRef = dom.byId("btnLeftPrime");
                var rightRef = dom.byId("btnRight");
                var rightPrimeRef = dom.byId("btnRightPrime");
                var frontRef = dom.byId("btnFront");
                var frontPrimeRef = dom.byId("btnFrontPrime");
                var backRef = dom.byId("btnBack");
                var backPrimeRef = dom.byId("btnBackPrime");
                var upRef = dom.byId("btnUp");
                var upPrimeRef = dom.byId("btnUpPrime");
                var downRef = dom.byId("btnDown");
                var downPrimeRef = dom.byId("btnDownPrime");
                var colorPalleteRow = dom.byId("colorPalleteRow");
                var tableArray = [dom.byId("tabUp"), dom.byId("tabFront"), dom.byId("tabRight"), dom.byId("tabBack"), dom.byId("tabLeft"), dom.byId("tabDown")];
                on(leftRef, "click", function (evt) {
                    cube.Turn("Left");
                    //cube.RecolorCube(tableArray);
                    __PaintCube(_ctx);
                });

                on(colorPalleteRow, "click", function (evt) {
                    var sourceNode = evt.srcElement;
                    for (var i = 0 ; i < 6; i++) {
                        domClass.remove("tdColor" + i,"tdSelected");
                    }
                    
                    domClass.add(sourceNode, "tdSelected");
                });

                on(leftPrimeRef, "click", function (evt) {
                    for (var i = 0 ; i < 3; i++) {
                        cube.Turn("Left");
                    }
                    //cube.RecolorCube(tableArray);
                    __PaintCube(_ctx);
                });
                on(rightRef, "click", function (evt) {
                    cube.Turn("Right");
                   // cube.RecolorCube(tableArray);
                    __PaintCube(_ctx);
                });
                on(rightPrimeRef, "click", function (evt) {
                    for (var i = 0 ; i < 3; i++) {
                        cube.Turn("Right");
                    }
                    //cube.RecolorCube(tableArray);
                    __PaintCube(_ctx);
                });
                on(frontRef, "click", function (evt) {
                    cube.Turn("Front");
                    //cube.RecolorCube(tableArray);
                    __PaintCube(_ctx);
                });
                on(frontPrimeRef, "click", function (evt) {
                    for (var i = 0 ; i < 3; i++) {
                        cube.Turn("Front");
                    }
                    //cube.RecolorCube(tableArray);
                    __PaintCube(_ctx);
                });
                on(downRef, "click", function (evt) {
                    cube.Turn("Down");
                    //cube.RecolorCube(tableArray);
                    __PaintCube(_ctx);
                });
                on(downPrimeRef, "click", function (evt) {
                    for (var i = 0 ; i < 3; i++) {
                        cube.Turn("Down");

                    }
                    //cube.RecolorCube(tableArray);
                    __PaintCube(_ctx);
                });
                on(backRef, "click", function (evt) {
                    cube.Turn("Back");
                    //cube.RecolorCube(tableArray);
                    __PaintCube(_ctx);
                });
                on(backPrimeRef, "click", function (evt) {
                    for (var i = 0 ; i < 3; i++) {
                        cube.Turn("Back");
                    }
                    //cube.RecolorCube(tableArray);
                    __PaintCube(_ctx);
                });
                on(upRef, "click", function (evt) {
                    cube.Turn("Up");
                    //cube.RecolorCube(tableArray);
                    __PaintCube(_ctx);
                });
                on(upPrimeRef, "click", function (evt) {
                    for (var i = 0 ; i < 3; i++) {
                        cube.Turn("Up");
                    }
                    //cube.RecolorCube(tableArray);
                    __PaintCube(_ctx);
                });

                var image = new Image();
                image.onload = function () {
                    //_ctx.drawImage(this, 0, 0, 300, 300);
                };
                DrawCube(txtAreaText, _ctx);
                __PaintCube(txtAreaText, _ctx);
                DrawCube(txtAreaTextBack, _ctxBack);
                DrawFoldoutView();
                //__PaintCube(txtAreaTextBack, _ctxBack);

                image.src = "https://static1.squarespace.com/static/54f2df67e4b079e94c291e4f/t/55150d4ee4b0392be71ae5f2/1427443024072/solved_rubiks_cube";
            } //Try
            catch (ex) {
                this.Log(ex);
            } //Catch
        },

        Log: function (exception, alertMe) {
            console.log(exception);
            if (alertMe) {
                alert(exception.toString());
            }
        },




    })
});


