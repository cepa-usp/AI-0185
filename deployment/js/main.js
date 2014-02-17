
var widthAxis = 400;
var heightAxis = 300;
var border = 20;
var pointr = 4;
var r;
var chart = {};
var pts = {};
var segments = {};
var ptsIds = ["s0", "v0", "a0", "a1", "f0", "f1"];

var s0 = 100;
var v0 = 0;
var a0 = 2;
var a1 = 4;
var t1 = 3;
var t2 = 8;
var mass = 2;
var f0 = mass * a0;
var f1 = mass * a1;

var corg1 = "#000000";
var corg2 = "#00FF00";
var corg3 = "#0000FF";
var corg4 = "#FF0000";

function init(){

	r = Raphael("charts");
	chart.eixos1 = Graph(1, heightAxis, widthAxis, heightAxis, 0, 10, 0, 20, 1, 0.1, 2, 0.2);
	chart.eixos2 = Graph(border + widthAxis, heightAxis, widthAxis, heightAxis, 0, 10, 0, 100, 1, 0.1, 10, 1);
	chart.eixos3 = Graph(border + widthAxis, border + (2 * heightAxis), widthAxis, heightAxis, 0, 10, 0, 500, 1, 0.1, 50, 5);
	chart.eixos4 = Graph(1, border + (2 * heightAxis), widthAxis, heightAxis, 0, 10, 0, 10, 1, 0.1, 1, 0.1);

	//(ptx, pty, id, label, labelAxis, downF, moveF, upF, limitPoints)

	chart.eixos4.addSegment(0, a0, t1, a0, "a0", corg4);
	chart.eixos4.addSegment(t1, a1, t2, a1, "a1", corg4);

	chart.eixos1.addSegment(0, f0, t1, f0, "f0", corg1);
	chart.eixos1.addSegment(t1, f1, t2, f1, "f1", corg1);

	var vt1 = v0 + a0 * t1;
	var vt2 = vt1 + a1 * (t2 - t1);
	chart.eixos2.addSegment(0, v0, t1, vt1, "v0", corg2);
	chart.eixos2.addSegment(t1, vt1, t2, vt2, "v1", corg2);

	//getSpacePath(sp0, vel0, temp0, temp1, acel)

	var st1 = s0 + v0 * t1 + (a0 * t1 * t1)/2;
	//var st2 = st1 + vt1 * (t2 - t1) + (a1 * (t2 - t1) * (t2 - t1))/2;
	var vel1 = v0 + a0 * t1;
	/*
	var ptc1x = 0;
	var ptc1y = 0;
	var ptc2x = 0;
	var ptc2y = 0;

	chart.eixos3.addCurve(0, s0, t1, st1, ptc1x, ptc1y, "s0");
	chart.eixos3.addCurve(t1, st1, t2, st2, ptc2x, ptc2y,"s1");*/

	chart.eixos3.addPath("s0", getSpacePath(s0, v0, 0, t1, a0), corg3);
	chart.eixos3.addPath("s1", getSpacePath(st1, vel1, t1, t2, a1), corg3);

	chart.eixos3.addMovingPoint(0, s0, "s0", "s0", "x", mouseDown, spaceMove, spaceUp, null, corg3);
	chart.eixos2.addMovingPoint(0, v0, "v0", "v0", "x", mouseDown, velMove, velUp, null, corg2);
	chart.eixos4.addMovingPoint(0, a0, "a0", "a0", "x", mouseDown, accelMove, accelUp, null, corg4);
	chart.eixos4.addMovingPoint(0, a1, "a1", "a1", "x", mouseDown, accelMove, accelUp, null, corg4);
	chart.eixos1.addMovingPoint(0, f0, "f0", "f0", "x", mouseDown, forceMove, forceUp, null, corg1);
	chart.eixos1.addMovingPoint(0, f1, "f1", "f1", "x", mouseDown, forceMove, forceUp, null, corg1);

	chart.eixos1.addMovingPoint(t1, 0, "t1-1", "t1", "y", mouseDown, timeMove, timeUp);
	chart.eixos1.addMovingPoint(t2, 0, "t2-1", "t2", "y", mouseDown, timeMove, timeUp);
	chart.eixos2.addMovingPoint(t1, 0, "t1-2", "t1", "y", mouseDown, timeMove, timeUp);
	chart.eixos2.addMovingPoint(t2, 0, "t2-2", "t2", "y", mouseDown, timeMove, timeUp);
	chart.eixos3.addMovingPoint(t1, 0, "t1-3", "t1", "y", mouseDown, timeMove, timeUp);
	chart.eixos3.addMovingPoint(t2, 0, "t2-3", "t2", "y", mouseDown, timeMove, timeUp);
	chart.eixos4.addMovingPoint(t1, 0, "t1-4", "t1", "y", mouseDown, timeMove, timeUp);
	chart.eixos4.addMovingPoint(t2, 0, "t2-4", "t2", "y", mouseDown, timeMove, timeUp);

	$('#charts').on('DOMMouseScroll mousewheel', function (e) {
		var grph;
		if(e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) { //alternative options for wheelData: wheelDeltaX & wheelDeltaY
			//scroll down
			if(e.pageX < 410){
				if(e.pageY < 310){
					//gráfico 1
					grph = chart.eixos1;
				}else{
					//gráfico 4
					grph = chart.eixos4;
				}
			}else{
				if(e.pageY < 310){
					//gráfico 2
					grph = chart.eixos2;
				}else{
					//gráfico 3
					grph = chart.eixos3;
				}
			}
			grph.ymax -= grph.ticky;
			if(grph.ymax < grph.ticky) grph.ymax = grph.ticky;
			grph.redraw();
		} else {
		    //scroll up
		    if(e.pageX < 410){
				if(e.pageY < 310){
					//gráfico 1
					grph = chart.eixos1;
				}else{
					//gráfico 4
					grph = chart.eixos4;
				}
			}else{
				if(e.pageY < 310){
					//gráfico 2
					grph = chart.eixos2;
				}else{
					//gráfico 3
					grph = chart.eixos3;
				}
			}
		    grph.ymax += grph.ticky;
		    grph.redraw();
		}
		//prevent page fom scrolling
		return false;
	});
}

function createAxis(originX, originY, width, height){
	return r.path("M" + originX + "," + (originY - height) + "L" + originX + "," + originY + "L" + (originX + width) + "," + originY);
}

function Graph(originX, originY, width, height, xmin, xmax, ymin, ymax, tickx, subtickx, ticky, subticky){
	var marginW = 28;
	var marginH = 15;
	var g = {};
	g.zoomFactor = 1;
	g.x0 = originX + marginW;
	g.y0 = originY - marginH;
	g.width = width - marginW - 5;
	g.height = height - marginH - 5;
	g.xmin = xmin;
	g.xmax = xmax;
	g.ymin = ymin;
	g.ymax = ymax;
	g.tickx = tickx;
	g.subtickx = subtickx;
	g.ticky = ticky;
	g.subticky = subticky;
	g.points = {};
	g.segments = {};
	g.curves = {};
	g.textsX = [];
	g.textsY = [];

	g.drawAxis = function(){
		this.axis = r.path("M" + this.x0 + "," + (this.y0 - this.height) + "L" + this.x0 + "," + this.y0 + "L" + (this.x0 + this.width) + "," + this.y0);
	}

	//Monta string path eixo x:
	g.doTicksX = function(){
		var pathx = "";
		var tickNx = this.tickx/this.subtickx;
		var subTickControlx = 1;
		var tickPosX = 0;
		//var textsX = [];
		for (var i = this.xmin + this.subtickx; i <= this.xmax; i += this.subtickx) {
			tickPosX = this.getStageCoords(i, this.ymin);
			if(subTickControlx < tickNx){
				pathx += "M" + tickPosX.x + "," + (tickPosX.y - 3) + "L" + tickPosX.x + "," + (tickPosX.y);
				subTickControlx++;
			}else{
				pathx += "M" + tickPosX.x + "," + (tickPosX.y - 5) + "L" + tickPosX.x + "," + (tickPosX.y);
				subTickControlx = 1;
				this.textsX.push(r.text(tickPosX.x, tickPosX.y + 8, i.toFixed(0)));
			}
			
		};
		this.gTicksX = r.path(pathx);
	}
	
	//Monta string path eixo y:
	g.doThicksY = function(){
		var pathy = "";
		var tickNy = this.ticky/this.subticky;
		var subTickControly = 1;
		var tickPosY = 0;
		//var textsY = [];
		for (var i = this.ymin + this.subticky; i <= this.ymax; i += this.subticky) {
			tickPosY = this.getStageCoords(this.xmin, i);
			//pathx += "M" + tickPosX.x + "," + (tickPosX.y - 2) + "L" + tickPosX.x + "," + (tickPosX.y + 2);
			if(subTickControly < tickNy){
				pathy += "M" + tickPosY.x + "," + tickPosY.y + "L" + (tickPosY.x + 3) + "," + tickPosY.y;
				subTickControly++;
			}else{
				pathy += "M" + tickPosY.x + "," + tickPosY.y + "L" + (tickPosY.x + 5) + "," + tickPosY.y;
				subTickControly = 1;
				this.textsY.push(r.text(tickPosY.x - 6, tickPosY.y, i.toFixed(0)).attr("text-anchor", "end"));
			}
			
		};

		this.gTicksY = r.path(pathy);
	}

	g.addMovingPoint = function(ptx, pty, id, label, labelAxis, downF, moveF, upF, limitPoints, stroke){
		var pt = {};
		pt.graph = this;

		var stageCoords = this.getStageCoords(ptx, pty);
		pt.x = stageCoords.x;
		pt.y = stageCoords.y;
		pt.position = {x:ptx, y:pty};
		pt.labelText = label;
		pt.labelAxis = labelAxis;

		if(label) {
			if(labelAxis == "x") {
				pt.label = r.text(this.x0 + 8, this.y0 - 6, label);//.attr("text-anchor", "end");
			}else {
				pt.label = r.text(this.x0, this.y0 - 10 , label);
			}
			pt.label.transform("t" + (pt.x - this.x0) + "," + (pt.y - this.y0));
			pt.label.hide();
		}

		pt.graphics = r.circle(this.x0, this.y0, pointr).attr({fill: "transparent", "stroke-width": "2", 'stroke': stroke || '#D16619'});
		pt.graphics.transform("t" + (pt.x - this.x0) + "," + (pt.y - this.y0));
		pt.graphics.id = id;
		pt.graphics.data("t", [(pt.x - this.x0),(pt.y - this.y0)]);
		//pt.graphics.attr("stroke-width", "2");
		pt.graphics.drag(moveF, downF, upF);

		pt.graphics.hover(function(){
			this.attr({'cursor':'pointer'});
			var trans = this.data("t") || [0,0];
			this.attr({transform: ["t", trans[0], trans[1], "s", 1.5, 1.5]}).attr("stroke-width", "2");
			var pt = pts[this.id];
			pt.label.attr("text", pt.labelText + " = " + (pt.labelAxis == "x" ? pt.position.y : pt.position.x)).attr("text-anchor", (pt.labelAxis == "x" ? "start" : "middle"));;
			pt.label.show();
		}, function(){
			var trans = this.data("t") || [0,0];
			this.attr({transform: ["t", trans[0], trans[1], "s", 1, 1]}).attr("stroke-width", "2");
			pts[this.id].label.hide();
		});

		//this.points.push(pt);
		pts[id] = pt;
		
	}

	g.addSegment = function(pt1x, pt1y, pt2x, pt2y, id, fill){
		var pt1 = this.getStageCoords(pt1x, pt1y);
		var pt2 = this.getStageCoords(pt2x, pt2y);
		var seg = {};

		seg.pt1 = {x: pt1x, y:pt1y};
		seg.pt2 = {x: pt2x, y:pt2y};
		seg.graphics = r.path("M" + pt1.x + "," + pt1.y + "L" + pt2.x + "," + pt2.y).attr("stroke", fill || "#000000");
		seg.graphics.id = id;
		//this.segments[id] = seg;
		segments[id] = seg;
	}

	g.updateSegment = function(id, pt1x, pt1y, pt2x, pt2y){
		var pt1 = this.getStageCoords(pt1x, pt1y);
		var pt2 = this.getStageCoords(pt2x, pt2y);

		//var seg = this.segments[id];
		var seg = segments[id];
		seg.pt1 = {x: pt1x, y:pt1y};
		seg.pt2 = {x: pt2x, y:pt2y};
		seg.graphics.attr("path", "M" + pt1.x + "," + pt1.y + "L" + pt2.x + "," + pt2.y);

	}

	g.addPath = function(id, path, fill){
		var ph = {};
		ph.grahics = r.path(path).attr("stroke", fill || "#000000");
		ph.grahics.id = id;
		this.curves[id] = ph;
	}

	g.updatePath = function(id, path){
		var ph = this.curves[id];

		ph.grahics.attr("path", path);
	}

	g.addCurve = function(pt1x, pt1y, pt2x, pt2y, ptcx, ptcy, id){
		var pt1 = this.getStageCoords(pt1x, pt1y);
		var pt2 = this.getStageCoords(pt2x, pt2y);
		var ptc = this.getStageCoords(ptcx, ptcy);
		var curve = {};

		curve.pt1 = {x: pt1x, y:pt1y};
		curve.pt2 = {x: pt2x, y:pt2y};
		curve.ptc = {x: ptcx, y:ptcy};
		curve.grahics = r.path("M" + pt1.x + "," + pt1.y + "Q" + ptc.x + "," + ptc.y + " " + pt2.x + "," + pt2.y);
		curve.id = id;
		this.curves[id] = curve;
	}

	g.updateCurve = function(id, pt1x, pt1y, pt2x, pt2y, ptcx, ptcy){
		var pt1 = this.getStageCoords(pt1x, pt1y);
		var pt2 = this.getStageCoords(pt2x, pt2y);
		var ptc = this.getStageCoords(ptcx, ptcy);

		var curve = this.curves[id];
		curve.pt1 = {x: pt1x, y:pt1y};
		curve.pt2 = {x: pt2x, y:pt2y};
		curve.ptc = {x: ptcx, y:ptcy};
		curve.grahics.attr("path", "M" + pt1.x + "," + pt1.y + "Q" + ptc.x + "," + ptc.y + " " + pt2.x + "," + pt2.y);
	}

	g.getStageCoords = function(ptx, pty){
		var distx = this.width/(this.xmax - this.xmin);
		var disty = this.height/(this.ymax - this.ymin);
		var pt = {};
		pt.x = this.x0 + (ptx - this.xmin) * distx;
		pt.y = this.y0 - (pty - this.ymin) * disty;

		return pt;
	}

	g.getGraphCoords = function(ptx, pty){
		var distx = this.width/(this.xmax - this.xmin);
		var disty = this.height/(this.ymax - this.ymin);
		var pt = {};
		pt.x = Number(((ptx - this.x0) / distx).toFixed(2));
		pt.y = Number(((this.y0 - pty) / disty).toFixed(2));

		return pt;
	}

	g.draw = function(){
		this.drawAxis();
		this.doTicksX();
		this.doThicksY();
	}

	g.redraw = function(){
		this.axis.remove();
		this.gTicksX.remove();
		this.gTicksY.remove();

		for (var i = 0; i < this.textsX.length; i++) {
			this.textsX[i].remove();
		};
		for (var i = 0; i < this.textsY.length; i++) {
			this.textsY[i].remove();
		};
		this.textsX = [];
		this.textsY = [];

		this.draw();
		updateAll();
	}

	g.draw();

	return g;
}

//---------------------------------------------------------------------------
//MouseDown comum a todos os objetos
var trans;
var pt;
var delta;

function mouseDown(){
    //Seleciona o ponto atual
    pt = pts[this.id];
    //Transformação atual do ponto ou inicializa a transformação com [0.0]
    trans = this.data("t") || [0,0];
}

//----------------------------------------------------------------------------
//Space move handlers
function spaceMove(dx, dy){
	
	var newPosy = trans[1] + dy;
	var newDy = dy;
	if(newPosy < -pt.graph.height) {
		newPosy = -pt.graph.height;
		newDy = newPosy - trans[1];
	}else if(newPosy > 0){
		newPosy = 0;
		newDy = newPosy - trans[1];
	}

    //this.attr({transform: ['t',trans[0], newPosy]});
    this.transform('t' + trans[0] + ","  + newPosy)
    pt.label.transform('t' + trans[0] + "," + newPosy);
    delta = [dx, newDy];

    var bbox = this.getBBox();
    pt.position = pt.graph.getGraphCoords(bbox.x + bbox.width/2, bbox.y + bbox.height/2);
    pt.label.attr("text", pt.labelText + " = " + pt.position.y).attr("text-anchor", "start");
    updateSpaceGraphics();
}

//TODO: redraw space graphic
function updateSpaceGraphics(){
	/*var s0 = pts["s0"].position.y;
	var v0 = pts["v0"].position.y;
	var a0 = pts["a0"].position.y;
	var a1 = pts["a1"].position.y;
	var t1 = pts["t1-3"].position.y;
	var t2 = pts["t2-3"].position.y;
	var vt1 = v0 + a0 * t1;


	var st1 = s0 + v0 * t1 + (a0 * t1 * t1)/2;
	var st2 = st1 + vt1 * (t2 - t1) + (a1 * (t2 - t1) * (t2 - t1))/2;

	var ptc1x = 10;
	var ptc1y = 10;
	var ptc2x = 10;
	var ptc2y = 10;

	chart.eixos3.updateCurve("s0", 0, s0, t1, st1, ptc1x, ptc1y);
	chart.eixos3.updateCurve("s1", t1, st1, t2, st2, ptc2x, ptc2y);*/

	var sp1 = pts["s0"].position.y + pts["v0"].position.y * pts["t1-3"].position.x + (pts["a0"].position.y * Math.pow(pts["t1-3"].position.x, 2))/2;
	var vel1 = pts["v0"].position.y + pts["a0"].position.y * pts["t1-3"].position.x;

	chart.eixos3.updatePath("s0", getSpacePath(pts["s0"].position.y, pts["v0"].position.y, 0, pts["t1-3"].position.x, pts["a0"].position.y));
	chart.eixos3.updatePath("s1", getSpacePath(sp1, vel1, pts["t1-3"].position.x, pts["t2-3"].position.x, pts["a1"].position.y));
	//showHidePts();
}

function spaceUp(){
	this.data("t", [trans[0], trans[1] + delta[1]]);
    trans = null;
    delta = null;
    pt = null;
}

function getSpacePath(sp0, vel0, temp0, temp1, acel){
	var stageCoord = chart.eixos3.getStageCoords(temp0, sp0);
	var path = "M" + stageCoord.x + "," + stageCoord.y;
	//console.log(path);
	var passo = 0.05;

	doPath: for (var i = temp0; i <= temp1 + passo; i+=passo) {
		var spPasso = sp0 + (vel0 * (i - temp0)) + (acel * Math.pow((i - temp0), 2))/2;
		stageCoord = chart.eixos3.getStageCoords(i, spPasso);
		if(stageCoord.y < chart.eixos3.y0 - chart.eixos3.height) break doPath;
		path += "L" + stageCoord.x + "," + stageCoord.y;
	};
	return path;
}

//----------------------------------------------------------------------------
//Velocity move handlers
function velMove(dx, dy){
    var newPosy = trans[1] + dy;
	var newDy = dy;
	if(newPosy < -pt.graph.height) {
		newPosy = -pt.graph.height;
		newDy = newPosy - trans[1];
	}else if(newPosy > 0){
		newPosy = 0;
		newDy = newPosy - trans[1];
	}

    //this.attr({transform: ['t',trans[0], newPosy]});
    this.transform('t' + trans[0] + ","  + newPosy)
    pt.label.transform('t' + trans[0] + "," + newPosy);
    delta = [dx, newDy];

    var bbox = this.getBBox();
    pt.position = pt.graph.getGraphCoords(bbox.x + bbox.width/2, bbox.y + bbox.height/2);
    pt.label.attr("text", pt.labelText + " = " + pt.position.y).attr("text-anchor", "start");
    updateVelGraphics();
}

//TODO: redraw velocity graphic
function updateVelGraphics(){
	var vt1 = pts["v0"].position.y + pts["a0"].position.y * pts["t1-2"].position.x;
	var vt2 = vt1 + pts["a1"].position.y * (pts["t2-2"].position.x - pts["t1-2"].position.x);

	chart.eixos2.updateSegment("v0", 0, pts["v0"].position.y, pts["t1-2"].position.x, vt1);
	chart.eixos2.updateSegment("v1", pts["t1-2"].position.x, vt1, pts["t2-2"].position.x, vt2);

	updateSpaceGraphics();
}

function velUp(){
	this.data("t", [trans[0], trans[1] + delta[1]]);
    trans = null;
    delta = null;
    pt = null;
}

//----------------------------------------------------------------------------
//Acceleration move handlers
function accelMove(dx, dy){
    var newPosy = trans[1] + dy;
	var newDy = dy;
	if(newPosy < -pt.graph.height) {
		newPosy = -pt.graph.height;
		newDy = newPosy - trans[1];
	}else if(newPosy > 0){
		newPosy = 0;
		newDy = newPosy - trans[1];
	}

    //this.attr({transform: ['t',trans[0], newPosy]});
    this.transform('t' + trans[0] + ","  + newPosy)
    pt.label.transform('t' + trans[0] + "," + newPosy);
    delta = [dx, newDy];

    var bbox = this.getBBox();
    pt.position = pt.graph.getGraphCoords(bbox.x + bbox.width/2, bbox.y + bbox.height/2);
    pt.label.attr("text", pt.labelText + " = " + pt.position.y).attr("text-anchor", "start");
    updateAccelGraphics();
}

//TODO: redraw velocity graphic
function updateAccelGraphics(){
	chart.eixos4.updateSegment("a0", 0, pts["a0"].position.y, pts["t1-4"].position.x, pts["a0"].position.y);
	chart.eixos4.updateSegment("a1", pts["t1-4"].position.x, pts["a1"].position.y, pts["t2-4"].position.x, pts["a1"].position.y);

	var force0 = mass * pts["a0"].position.y;
	var force1 = mass * pts["a1"].position.y;
	var f0Stage = chart.eixos1.getStageCoords(0, force0);
	var f1Stage = chart.eixos1.getStageCoords(0, force1);

	var ptF0 = pts["f0"];
	var ptF1 = pts["f1"];

	ptF0.position = {x:0, y:force0};
	ptF0.graphics.transform("t0," + (f0Stage.y - chart.eixos1.y0));
	ptF0.graphics.data("t", [0, f0Stage.y - chart.eixos1.y0]);
	ptF0.label.transform("t0," + (f0Stage.y - chart.eixos1.y0));

	ptF1.position = {x:0, y:force1};
	ptF1.graphics.transform("t0," + (f1Stage.y - chart.eixos1.y0));
	ptF1.graphics.data("t", [0, f1Stage.y - chart.eixos1.y0]);
	ptF1.label.transform("t0," + (f1Stage.y - chart.eixos1.y0));

	chart.eixos1.updateSegment("f0", 0, pts["f0"].position.y, pts["t1-1"].position.x, pts["f0"].position.y);
	chart.eixos1.updateSegment("f1", pts["t1-1"].position.x, pts["f1"].position.y, pts["t2-1"].position.x, pts["f1"].position.y);
	showHidePts();
	updateVelGraphics();
	updateSpaceGraphics();
}

function accelUp(){
	this.data("t", [trans[0], trans[1] + delta[1]]);
    trans = null;
    delta = null;
    pt = null;
}

//----------------------------------------------------------------------------
//Force move handlers
function forceMove(dx, dy){
    var newPosy = trans[1] + dy;
	var newDy = dy;
	if(newPosy < -pt.graph.height) {
		newPosy = -pt.graph.height;
		newDy = newPosy - trans[1];
	}else if(newPosy > 0){
		newPosy = 0;
		newDy = newPosy - trans[1];
	}

    //this.attr({transform: ['t',trans[0], newPosy]});
    this.transform('t' + trans[0] + ","  + newPosy)
    pt.label.transform('t' + trans[0] + "," + newPosy);
    delta = [dx, newDy];

    var bbox = this.getBBox();
    pt.position = pt.graph.getGraphCoords(bbox.x + bbox.width/2, bbox.y + bbox.height/2);
    pt.label.attr("text", pt.labelText + " = " + pt.position.y).attr("text-anchor", "start");
    updateForceGraphics();
}

//TODO: redraw velocity graphic
function updateForceGraphics(){
	chart.eixos1.updateSegment("f0", 0, pts["f0"].position.y, pts["t1-1"].position.x, pts["f0"].position.y);
	chart.eixos1.updateSegment("f1", pts["t1-1"].position.x, pts["f1"].position.y, pts["t2-1"].position.x, pts["f1"].position.y);

	var accel0 = pts["f0"].position.y/mass;
	var accel1 = pts["f1"].position.y/mass;
	var a0Stage = chart.eixos4.getStageCoords(0, accel0);
	var a1Stage = chart.eixos4.getStageCoords(0, accel1);

	var ptA0 = pts["a0"];
	var ptA1 = pts["a1"];

	ptA0.position = {x:0, y:accel0};
	ptA0.graphics.transform("t0," + (a0Stage.y - chart.eixos4.y0));
	ptA0.graphics.data("t", [0, a0Stage.y - chart.eixos4.y0]);
	ptA0.label.transform("t0," + (a0Stage.y - chart.eixos4.y0));

	ptA1.position = {x:0, y:accel1};
	ptA1.graphics.transform("t0," + (a1Stage.y - chart.eixos4.y0));
	ptA1.graphics.data("t", [0, a1Stage.y - chart.eixos4.y0]);
	ptA1.label.transform("t0," + (a1Stage.y - chart.eixos4.y0));

	chart.eixos4.updateSegment("a0", 0, pts["a0"].position.y, pts["t1-4"].position.x, pts["a0"].position.y);
	chart.eixos4.updateSegment("a1", pts["t1-4"].position.x, pts["a1"].position.y, pts["t2-4"].position.x, pts["a1"].position.y);
	showHidePts();
	updateVelGraphics();
	updateSpaceGraphics();
}

function forceUp(){
	this.data("t", [trans[0], trans[1] + delta[1]]);
    trans = null;
    delta = null;
    pt = null;
}

//----------------------------------------------------------------------------
//Time move handlers
function timeMove(dx, dy){

	var newPosx = trans[0] + dx;
	//var newDx = dx;
	var marginPt = 2 * pointr;

	var id0 = this.id.split("-")[0];
	var id1 = this.id.split("-")[1];
	if(id0 == "t1"){
		var pt2Trans = pts["t2-" + id1].graphics.data("t")[0];
		if(newPosx > pt2Trans - marginPt){
			newPosx = pt2Trans - marginPt;
			//newDx = newPosx - trans[0];
		}
	}else{
		var pt1Trans = pts["t1-" + id1].graphics.data("t")[0];
		if(newPosx < pt1Trans + marginPt){
			newPosx = pt1Trans + marginPt;
			//newDx = newPosx - trans[0];
		}
	}

	if(newPosx < 0) {
		newPosx = 0;
		//newDx = newPosx - trans[1];
	}else if(newPosx > pt.graph.width){
		newPosx = pt.graph.width;
		//newDx = newPosx - trans[1];
	}

    //this.attr({transform: ['t',trans[0], newPosy]});
    //this.transform('t' + newPosx + "," + trans[1])
    //pt.label.transform('t' + newPosx + "," + trans[1]);
    //pt.label.hide();
    //delta = [newDx, trans[1]];

    var bbox = this.getBBox();
    pt.position = pt.graph.getGraphCoords(bbox.x + bbox.width/2, bbox.y + bbox.height/2);    

    updateTimeGraphics(this.id, [newPosx, trans[1]]);
}

//TODO: redraw velocity graphic
function updateTimeGraphics(id, trans){
	var timeMoving = pts[id].labelText;
	//console.log(timeMoving);

	for (var i = 1; i <= 4; i++) {
		var tg = r.getById(timeMoving + "-" + i.toString());
		tg.attr({transform: ['t',trans[0], trans[1]]});

		var ptsi = pts[tg.id];
		ptsi.label.attr({transform: ['t',trans[0], trans[1]]});
		ptsi.graphics.data("t", [trans[0], trans[1]]);

		var bbox = tg.getBBox();
    	ptsi.position = ptsi.graph.getGraphCoords(bbox.x + bbox.width/2, bbox.y + bbox.height/2);
    	ptsi.label.attr("text", ptsi.labelText + " = " + ptsi.position.x).attr("text-anchor", "middle");
	};

	updateAccelGraphics();
	updateVelGraphics();
	updateSpaceGraphics();
}

function timeUp(){
    trans = null;
    delta = null;
    pt = null;
}

function changeF(){
	var newMass = Number($('#fPicker option:selected').text());

	chart.eixos1.ymax = 10 * newMass;
	chart.eixos1.ticky = newMass;
	chart.eixos1.subticky = newMass/10;
	mass = newMass;
	chart.eixos1.redraw();
}

function updateAll(){
	for (var i = 0; i < ptsIds.length; i++) {
		var pt = pts[ptsIds[i]];
		var stageCoords = pt.graph.getStageCoords(pt.position.x, pt.position.y);
		var newPosy = stageCoords.y - pt.graph.y0;
		pt.graphics.transform('t0,' + newPosy)
    	pt.label.transform('t0,' + newPosy);
    	pt.graphics.data("t", [0,newPosy]);
	};

	//updateForceGraphics();
	updateAccelGraphics();
	showHidePts();
}

function showHidePts(){
	for (var i = 0; i < ptsIds.length; i++) {
		var pt = pts[ptsIds[i]];
		//var stageCoords = pt.graph.getStageCoords(pt.position.x, pt.position.y);
		var newPosy = pt.graphics.data("t")[1];
		//pt.graphics.transform('t0,' + newPosy)
    	//pt.label.transform('t0,' + newPosy);
    	//pt.graphics.data("t", [0,newPosy]);
    	if(newPosy < -pt.graph.height){
    		pt.graphics.hide();
    		//pt.label.hide();
    		if(segments[ptsIds[i]]) segments[ptsIds[i]].graphics.hide();
    	}else{
    		pt.graphics.show();
    		//pt.label.show();
    		if(segments[ptsIds[i]]) segments[ptsIds[i]].graphics.show();
    	}
	}
}