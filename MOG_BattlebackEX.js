//=============================================================================
// MOG_BattlebackEX.js
//=============================================================================

/*:
* @plugindesc (v1.1) Adds multiple battlebacks on the battlefield.
* @author Moghunter
*
* @param Cam Rate
* @desc Setting the range of the camera.
* @default 50
*
* @param Cam Speed
* @desc Camera speed.
* @default 30
*
* @param Cam Focus Delay
* @desc Definition of the time to activate focus on the target.
* @default 20
*
* @param Cam X-Axis
* @desc Definition of the camera's X-axis.
* @default 0
*
* @param Cam Y-Axis
* @desc Y-axis definition of the camera.
* @default 0
*
* @help
* ================================================================= ============================
* +++ MOG Battleback EX (v1.1) +++
* By Moghunter
* https://atelierrgss.wordpress.com/
* ================================================================= ============================
* Adds multiple battlebacks on the battlefield.
*
* ================================================================= ============================
* PLUGIN COMMANDS
* ================================================================= ============================
* - To change the range of the camera.
* (在插件命令中输入如下格式的命令:)
* bb_ex: ID: FILE_NAME: PRIORITY_TYPE: Scroll_X: Scroll_Y: BLEND_MODE: CAMERA_RATE
*
* ID - Battleback Id (1 and 2 are standard battlebacks)
* FILE_NAME - Battleback name.
* PRIORITY_TYPE -
* Lower - Below battlers.
* Upper - Above the battlers.
* Scroll X - X-Axis sliding speed.
* Scroll Y - Y-Axis sliding speed.
* BLEND_MODE - Blend Type. (0 to 2).
* CAMERA RATE - Perspective effect from 0 to 100 (Battle Camera plugin required)
*
* Example.
*
* bb_ex: 3: Clouds: Lower: 5: 5: 100
* bb_ex: 4: Clouds: Upper: -10: 0: 80
*
* ================================================================= ============================
*
* To cancel all effects and layers of Battleback use the command below
*
* bb_ex_clear
*
* ================================================================= ============================
* HISTORIC
* ================================================================= ============================
* (1.1) - Improved compatibility of plugins.
*
*
* 更多翻译插件:https://github.com/misuqian/MVPlugins-CN
*/

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_BattlebackEX = true;
　　var Moghunter = Moghunter || {}; 

    Moghunter.parameters = PluginManager.parameters('MOG_BattlebackEX');
	
//=============================================================================
// ** Game_System
//=============================================================================

//==============================
// * Initialize
//==============================
var _alias_mog_bbex_sys_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	_alias_mog_bbex_sys_initialize.call(this);
    this._bbex_data = [];
};

//=============================================================================
// ** Game_Interpreter
//=============================================================================	

//==============================
// * PluginCommand
//==============================
var _alias_mog_bbex_pluginCommand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_alias_mog_bbex_pluginCommand.call(this,command, args)
	if (command === "bb_ex")  {
		var index =  Math.min(Math.max(args[1],1),100);index -= 1;		
		$gameSystem._bbex_data[index] = [];
		$gameSystem._bbex_data[index][0] = String(args[3]);
		$gameSystem._bbex_data[index][1] = String(args[5]);
		$gameSystem._bbex_data[index][2] = Number(args[7]);
		$gameSystem._bbex_data[index][3] = Number(args[9]);
		$gameSystem._bbex_data[index][4] =  Math.min(Math.max(Number(args[11]),0),2);
		if (args[13]) {
		   var rate = Math.min(Math.max(Number(args[13]),-100),100)
		   $gameSystem._bbex_data[index][5] = rate;}
	};
	if (command === "bb_ex_clear")  {$gameSystem._bbex_data = []};
	return true;
};

//=============================================================================
// ** SpritesetBattle Prototype
//=============================================================================	
var _alias_mog_sprt_createBattleField = Spriteset_Battle.prototype.createBattleField;
Spriteset_Battle.prototype.createBattleField = function() {    
	_alias_mog_sprt_createBattleField.call(this);
	this.bbexSetup();
};

//=============================================================================
// ** BbexSetup
//=============================================================================	
Spriteset_Battle.prototype.bbexSetup = function() {
	this._bbData = [];	
	for (var i = 0; i < $gameSystem._bbex_data.length; i++) {	 
	     if (i === 0 && !$gameSystem._bbex_data[0]) {this._bbData.push($gameSystem._bbex_data[0])};
		 if (i === 1 && !$gameSystem._bbex_data[1]) {this._bbData.push($gameSystem._bbex_data[1])};
		 if ($gameSystem._bbex_data[i]) {this._bbData.push($gameSystem._bbex_data[i])};
	};
    this._bbPlaneLower = new Sprite();
	this._bbPlaneLower.z = 0;
    this._battleField.addChild(this._bbPlaneLower);	
};

//==============================
// * createBBUperPlane
//==============================
Spriteset_Battle.prototype.createBbUpperPlane  = function() {
    this._bbPlaneUpper = new Sprite();
	this._bbPlaneUpper.z = 10;
    this._battleField.addChild(this._bbPlaneUpper);	
};

//==============================
// * setbbBitmap
//==============================
Spriteset_Battle.prototype.setbbBitmap = function(index) {
	if (this._bbData[index][1] === "Lower") {
        return ImageManager.loadBattleback1(this._bbData[index][0]);
	} else {
		return ImageManager.loadBattleback2(this._bbData[index][0]);
	};
};

//==============================
// * createActors
//==============================
var _alias_mog_bbex_createActors = Spriteset_Battle.prototype.createActors
Spriteset_Battle.prototype.createActors = function() {	
	_alias_mog_bbex_createActors.call(this);
	this.createBbUpperPlane();
};

//==============================
// * createLower Layer
//==============================
var _alias_mog_bbex_sprtbat_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer
Spriteset_Battle.prototype.createLowerLayer  = function() {
	_alias_mog_bbex_sprtbat_createLowerLayer.call(this);    
	this.createBattlebacks();
};
	
//==============================
// * createBattlebacks
//==============================
Spriteset_Battle.prototype.createBattlebacks = function() {
	this.addBattleback(this._back1Sprite,0);
	this.addBattleback(this._back2Sprite,1);
	this._backSpriteEx = [];
	for (var i = 2; i < this._bbData.length; i++) {
	    this._backSpriteEx[i] = new TilingSprite();
		this.addBattleback(this._backSpriteEx[i],i);
  	};
};	
	
//==============================
// * add BattleBack
//==============================
Spriteset_Battle.prototype.addBattleback = function(sprite,index) {
    var margin = 32;
    var x = -this._battleField.x - margin;
    var y = -this._battleField.y - margin;
    var width = Graphics.width + margin * 2;
    var height = Graphics.height + margin * 2;	
	if (this._bbData[index]) {
		sprite.bitmap = this.setbbBitmap(index)
	} else {
		if (index === 0) {
           sprite.bitmap = this.battleback1Bitmap();
		} else {
		   sprite.bitmap = this.battleback2Bitmap();
		};
	};
    sprite.move(x, y, width, height);
	if (!this._bbData[index] || this._bbData[index][1] === "Lower") {
        this._bbPlaneLower.addChild(sprite);
	} else {
		this._bbPlaneUpper.addChild(sprite);		
	};
	if (this._bbData[index]) {sprite.blendMode = this._bbData[index][4]};
};

//==============================
// * createBattleback
//==============================
Spriteset_Battle.prototype.createBattleback = function() {
	this._back1Sprite = new TilingSprite();
    this._back2Sprite = new TilingSprite();
};

//==============================
// * updateBattleback
//==============================
var _alias_mog_bbex_updateBattleback = Spriteset_Battle.prototype.updateBattleback;
Spriteset_Battle.prototype.updateBattleback = function() {
	_alias_mog_bbex_updateBattleback.call(this);
    this.updateBattlebackEffects();
};

//==============================
// * updateScroll
//==============================
Spriteset_Battle.prototype.updateScroll = function(sprite,index) {
	 sprite.origin.x += this._bbData[index][2];
	 sprite.origin.y += this._bbData[index][3];
};

//==============================
// * updateBattlebackEffects
//==============================
Spriteset_Battle.prototype.updateBattlebackEffects = function() {	
	if (this._bbData[0]) {this.updateScroll(this._back1Sprite,0);};
	if (this._bbData[1]) {this.updateScroll(this._back2Sprite,1);};	
	for (var i = 2; i < this._bbData.length; i++) {	   
	   this.updateScroll(this._backSpriteEx[i],i);
	};
};