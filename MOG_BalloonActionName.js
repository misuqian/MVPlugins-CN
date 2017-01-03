//=============================================================================
// MOG_BalloonActionName.js
//=============================================================================

/*:
* @plugindesc (v1.0) Displays a balloon with the action name.显示动作名字气泡
* @author Moghunter
*
* @param Wait Mode
* @desc Wait for the balloon to disappear to continue the battle.
* @default false
*
* @param Duration
* @desc Duration of the name submission time.
* @default 60
*
* @param X-Axis
* @desc Definition of the X-Axis position of the balloon.
* @default -10
*
* @param Y-Axis
* @desc Definition of the Y-Axis position of the balloon.
* @default 0
*
* @param Name X-Axis
* @desc Definition of the X-Axis position of the name.
* @default 0
*
* @param Name Y-Axis
* @desc Definition of the Y-Axis position of the name.
* @default 0
*
* @help BalloonActionName
* ================================================================= ============================
* +++ MOG - Balloon Action Name (v1.0) +++
* By Moghunter
* https://atelierrgss.wordpress.com/
* ================================================================= ============================
* Displays a balloon with the action name.
* You will need to have the file. (Img / system /)
*(显示动作名字气泡.img/system目录下必须有以下文件:)
* ActionNameB.png
*
* ================================================================= ============================
* Disable Name
* ================================================================= ============================
* Initially all actions will have the name activated, in case you want to deactivate
* Any name, use the comment below in the Item / Skill box.
* (如果你想关闭物品或者技能名字显示，在注释栏写上:)
* Disable Balloon Name
*
* 更多翻译插件:https://github.com/misuqian/MVPlugins-CN
*/

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================

　　var Imported = Imported || {};
　　Imported.MOG_BalloonActionName = true;
　　var Moghunter = Moghunter || {}; 	
	Moghunter.parameters = PluginManager.parameters('MOG_BalloonActionName');
	Moghunter._sagaNameDuration = Number(Moghunter.parameters['Duration'] || 60);
	Moghunter._sagaNameX = Number(Moghunter.parameters['X-Axis'] || -10);
    Moghunter._sagaNameY = Number(Moghunter.parameters['Y-Axis'] || 0);
	Moghunter._sagaNameNameX = Number(Moghunter.parameters['Name X-Axis'] || 0);
    Moghunter._sagaNameNameY = Number(Moghunter.parameters['Name Y-Axis'] || 0);
    Moghunter._sagaNameWait = String(Moghunter.parameters['Wait Mode'] || "false");
	
//=============================================================================
// ** Game Temp
//=============================================================================

//==============================
// * Initialize
//==============================
var _alias_mog_saganame_initialize = Game_Temp.prototype.initialize
Game_Temp.prototype.initialize = function() {
	_alias_mog_saganame_initialize.call(this);
	this._sagaNameRunning = [false,false];
	this._sagaNameRunning[0] = Moghunter._sagaNameWait === "true" ? true : false;
};

//=============================================================================
// ** Game Battler
//=============================================================================

//==============================
// ** Init Members
//==============================
var _mog_saganame_gbat_initMembers = Game_Battler.prototype.initMembers;
Game_Battler.prototype.initMembers = function() {
	_mog_saganame_gbat_initMembers.call(this);
	this._actionNameData = [false,false,false,null];
};

//=============================================================================
// ** Battle Manager
//=============================================================================

//==============================
// ** process Turn
//==============================
var _mog_sagaName_bmng_startAction = BattleManager.startAction;
BattleManager.startAction = function() {
	if (this._subject.isActor()) {this.setActionName();};
	_mog_sagaName_bmng_startAction.call(this);
};

//==============================
// * set Action Name
//==============================
BattleManager.setActionName = function() {
	this._subject._actionNameData[0] = true;
    if (!this._subject.currentAction() || !this._subject.currentAction().item()) {return};
	var item = this._subject.currentAction().item();
	var notes = item.note.split(/[\r\n]+/);
	var enableName = true;
    notes.forEach(function(note) {
    if (note == "Disable Balloon Name" ) {enableName = false};
	},this);		
	if (enableName) {
		this._subject._actionNameData = [true,true,true,item];
	};
};

//==============================
// * End Turn
//==============================
var _mog_sagaName_bmngr_endAction  = BattleManager.endAction;
BattleManager.endAction = function() {
	_mog_sagaName_bmngr_endAction.call(this);
	if (this._subject) {this._subject._actionNameData = [false,false,false,null]};
};

//=============================================================================
// ** Sprite Actor
//=============================================================================

//==============================
// * iniMembers
//==============================
var _mog_sagaName_sprAct_initMembers = Sprite_Actor.prototype.initMembers; 
Sprite_Actor.prototype.initMembers = function() {
	_mog_sagaName_sprAct_initMembers.call(this);
	this.createNameBalloon();
};

//==============================
// * create Name Balloon
//==============================
Sprite_Actor.prototype.createNameBalloon = function() {
	this._ballonName = new SpriteBalloonName();
	this._ballonName.z = 20;
	this.addChild(this._ballonName);
};

//==============================
// * setBattler
//==============================
var _mog_sagaName_sprAct_setBattler = Sprite_Actor.prototype.setBattler;
Sprite_Actor.prototype.setBattler = function(battler) {
	_mog_sagaName_sprAct_setBattler.call(this,battler);
	if (this._ballonName && this._actor) {this._ballonName._actor = this._actor};
};

//=============================================================================
// * Sprite Balloon Name
//=============================================================================
function SpriteBalloonName() {
    this.initialize.apply(this, arguments);
};

SpriteBalloonName.prototype = Object.create(Sprite.prototype);
SpriteBalloonName.prototype.constructor = SpriteBalloonName;

//==============================
// * Initialize
//==============================
SpriteBalloonName.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);	
	this.z = 20;
	this._duration = [false,0];
	this._cwh = [-1,-1];
    this._balloonNameImg = ImageManager.loadSystem("ActionNameB");
	this._balloon = [];
    for (var i = 0; i < 4; i++) {
		this._balloon[i] = new Sprite(this._balloonNameImg);
		this._balloon[i].anchor.x = 0.5;
		this._balloon[i].opacity = 0;
		this._balloon[i].z = 20;
		this.addChild(this._balloon[i]);
	};
	this._name = new Sprite(new Bitmap(120,32));
	this._name.bitmap.fontSize = 20;
	this._name.anchor.x = 0.5;
	this._name.opacity = 0;
	this._name.z = 21;
	this.addChild(this._name);
};

//==============================
// * Need Refresh
//==============================
SpriteBalloonName.prototype.needRefresh = function() {
  return this._actor._actionNameData[2];
};

//==============================
// * get Sprite Data
//==============================
SpriteBalloonName.prototype.getSpriteData = function() {
    this._cwh[0] = this._balloonNameImg.width;
	this._cwh[1] = Math.floor(this._balloonNameImg.height / 3);
	this._cwh[2] = Moghunter._sagaNameX;
	this._cwh[3] = -((this._cwh[1] * 2) + 36) + Moghunter._sagaNameY;
	this._name.x = Moghunter._sagaNameX + Moghunter._sagaNameNameX;
	this._name.y = this._cwh[3] + Moghunter._sagaNameNameY;
};

//==============================
// * Refresh Name
//==============================
SpriteBalloonName.prototype.refreshName = function() {
	$gameTemp._sagaNameRunning[1] = true;
	this._actor._actionNameData[2] = false;
	this._duration = [true,Moghunter._sagaNameDuration];
	var text = this._actor._actionNameData[3].name;
	var textsize = Math.floor((text.length * 7) + this._cwh[0]);
	var wsize = Math.min(Math.max(textsize,48),120);
	var wposX = Math.floor((wsize / 2) + (this._cwh[0] / 2));
    for (var i = 0; i < this._balloon.length; i++) {
		 this._balloon[i].x = this._cwh[2];
		 this._balloon[i].y = this._cwh[3];
		 this._balloon[i].opacity = 255;
		 if (i === 0) {
			 this._balloon[i].setFrame(0,0,this._cwh[0],this._cwh[1]);
			 this._balloon[i].x += (this._cwh[0] / 4);
			 this._balloon[i].y += this._cwh[1];			 
		 } else if (i === 1) {
		     this._balloon[i].setFrame(0,this._cwh[1],this._cwh[0],this._cwh[1]);
			 this._balloon[i].scale.x = wsize / this._cwh[0];
		 } else if (i === 2) {
			 this._balloon[i].setFrame(0,this._cwh[1] * 2,this._cwh[0],this._cwh[1]);
		     this._balloon[i].x -= wposX;
		 } else if (i === 3) {	 
		     this._balloon[i].setFrame(0,this._cwh[1] * 2,this._cwh[0],this._cwh[1]);
			 this._balloon[i].x += wposX;
			 this._balloon[i].scale.x = -1;
		 };
	};
	this._name.opacity = 255;
    this._name.bitmap.clear();
	this._name.bitmap.drawText(text,0,0,120,32,'center');
};

//==============================
// * Update
//==============================
SpriteBalloonName.prototype.update = function() {
    Sprite.prototype.update.call(this);	
	if (this._cwh[0] === -1) {
		if (this._balloonNameImg.isReady()) {this.getSpriteData()};
	    return;
	};
	if (!this._actor) {return};
    if (this.needRefresh()) {this.refreshName()};
	if (this._duration[0]) {this.updateSprites()};
};

//==============================
// * Update Sprites
//==============================
SpriteBalloonName.prototype.updateSprites = function() {
   if (this._duration[1] > 0) {this._duration[1] --
   } else {this._name.opacity = 0;
		  this._duration = [false,0];
		  this._actor._actionNameData = [true,false,false,null];
		  $gameTemp._sagaNameRunning[1] = false;
   };
   for (var i = 0; i < this._balloon.length; i++) {
       this._balloon[i].opacity = this._name.opacity;
   };
};

if (Imported.MOG_BattleCamera ) { 
//==============================
// * Update Focus
//==============================
var _mog_saganame_sprbat_updateFocus = Spriteset_Battle.prototype.updateFocus;
Spriteset_Battle.prototype.updateFocus = function() {	
	if ($gameTemp._sagaNameRunning[1]) {$gameTemp._bcam_user[2] = 2};
	_mog_saganame_sprbat_updateFocus.call(this);
};
};

//=============================================================================
// * Scene Battle
//=============================================================================

//==============================
// * Update 
//==============================
var _mog_sagaName_sbat_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
	if (this.isBalloonNameRunning()) {this._spriteset.update();return}
	_mog_sagaName_sbat_update.call(this);
};

//==============================
// * is Balloon NameRunning 
//==============================
Scene_Battle.prototype.isBalloonNameRunning = function() {
	if (!$gameTemp._sagaNameRunning[0]) {return false};
	if ($gameTemp._sagaNameRunning[1]) {return true};
	return false;
};
