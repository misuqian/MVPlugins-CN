//=============================================================================
// MOG_ComboCounter.js
//=============================================================================

/*:
* @plugindesc (v1.4) Displays the number of hits on the target.连击数量显示
* @author Moghunter
*
* @param C HIT Layout X-Axis
* @desc X-Axis position of the HIT layout.
* @default 118
*
* @param C HIT Layout Y-Axis
* @desc Position Y-Axis of HI layout.
* @default 124
*
* @param C DMG Layout X-Axis
* @desc X-Axis position of the DMG layout.
* @default 10
*
* @param C DMG Layout Y-Axis
* @desc Y-Axis position of the DMG layout.
* @default 90
*
* @param C HIT Number X-Axis
* @desc X-Axis position of the HIT number.
* @default 115
*
* @param C HIT Number Y-Axis
* @desc Y-Axis position of the HIT number.
* @default 135
*
* @param C DMG Number X-Axis
* @desc X-Axis position of the DMG number.
* @default 150
*
* @param C DMG Number Y-Axis
* @desc Position Y-Axis of the DMG number.
* @default 93
*
* @help
* ================================================================= ============================
* +++ MOG - Combo Counter (v1.4) +++
* By Moghunter
* https://atelierrgss.wordpress.com/
* ================================================================= ============================
* Displays the number of Hits while attacking the enemy.
* The files will be needed. (img/system/)
* (显示攻击敌人的连击次数,需要img/system目录有以下图片文件:)
* Combo_A.png
* Combo_B.png
* Combo_C.png
* Combo_D.png
*
* ================================================================= ============================
* ** Historic **
* ================================================================= ============================
* V1.4 - Correction in plugin setup.
* V1.3 - Improvement in the counter presentation time.
* V1.2 - Correction of plugin setup.
* V1.1 - Fix glitch to blink the layout at the beginning of the battle.
*
*
* 更多翻译插件:https://github.com/misuqian/MVPlugins-CN
*/

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_ComboCounter = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_ComboCounter');
    Moghunter.combo_hit_layout_x = Number(Moghunter.parameters['C HIT Layout X-Axis'] || 118);
    Moghunter.combo_hit_layout_y = Number(Moghunter.parameters['C HIT Layout Y-Axis'] || 124);
    Moghunter.combo_dmg_layout_x = Number(Moghunter.parameters['C DMG Layout X-Axis'] || 10);
    Moghunter.combo_dmg_layout_y = Number(Moghunter.parameters['C DMG Layout Y-Axis'] || 90);
    Moghunter.combo_hit_number_x = Number(Moghunter.parameters['C HIT Number X-Axis'] || 115);
    Moghunter.combo_hit_number_y = Number(Moghunter.parameters['C HIT Number Y-Axis'] || 135);	
    Moghunter.combo_dmg_number_x = Number(Moghunter.parameters['C DMG Number X-Axis'] || 150);
    Moghunter.combo_dmg_number_y = Number(Moghunter.parameters['C DMG Number Y-Axis'] || 93);


//=============================================================================
// ** Game Temp
//=============================================================================

//==============================
// * Initialize
//==============================
var _alias_mog_combocounter_initialize = Game_Temp.prototype.initialize
Game_Temp.prototype.initialize = function() {
	_alias_mog_combocounter_initialize.call(this);
	this.combo_data = [false,0,0,false,false];
};

//=============================================================================
// ** Game Action
//=============================================================================

//==============================
// * Apply
//==============================
var _alias_mog_combocounter_apply = Game_Action.prototype.apply
Game_Action.prototype.apply = function(target) {
	_alias_mog_combocounter_apply.call(this,target);
	if (this.subject().isActor() && target.isEnemy() && !target.result().isHit()) {
		$gameTemp.combo_data[3] = true;
	};
};

//==============================
// * executeDamage
//==============================
var _alias_mog_combocounter_executeDamage = Game_Action.prototype.executeDamage
Game_Action.prototype.executeDamage = function(target, value) {
	_alias_mog_combocounter_executeDamage.call(this,target, value);
	if (this.subject().isActor() && target.isEnemy()) {
		$gameTemp.combo_data[0] = true;
		$gameTemp.combo_data[1] += 1;
		$gameTemp.combo_data[2] += value;}
	else if (this.subject().isEnemy() && target.isActor()) {
		$gameTemp.combo_data[3] = true;	
		$gameTemp.combo_data[4] = false;
	};
};

//=============================================================================
// ** BattleManager
//=============================================================================

//==============================
// * Start Action
//==============================
var _mog_ccount_bmngr_startAction = BattleManager.startAction;
BattleManager.startAction = function() {
    $gameTemp.combo_data[4] = true;
	_mog_ccount_bmngr_startAction.call(this);
};

//==============================
// * End Action
//==============================
var _mog_ccount_bmngr_endAction = BattleManager.endAction;
BattleManager.endAction = function() {
	_mog_ccount_bmngr_endAction.call(this);
	$gameTemp.combo_data[4] = false;
};

//=============================================================================
// ** Spriteset_Battle
//=============================================================================	

//==============================
// * CreateLowerLayer
//==============================
var _alias_mog_combocounter_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer
Spriteset_Battle.prototype.createLowerLayer = function() {
	_alias_mog_combocounter_createLowerLayer.call(this);
	this.create_combo_sprites();
};

//==============================
// * Update
//==============================
var _alias_mog_combocounter_update = Spriteset_Battle.prototype.update
Spriteset_Battle.prototype.update = function() {
	_alias_mog_combocounter_update.call(this);
	this.update_combo_sprites();
};

//==============================
// * Create Combo Sprites
//==============================
Spriteset_Battle.prototype.create_combo_sprites = function() {
	$gameTemp.combo_data = [false,0,0,false,false];
	this.combo_sprite_data = [0,[],[],0,0];
    this.combo_sprite_a = new Sprite(ImageManager.loadSystem("Combo_A"));
    this.combo_sprite_a.opacity = 0;
	this.combo_sprite_b = new Sprite(ImageManager.loadSystem("Combo_B"));
	this.combo_sprite_b.opacity = 0;
    this.combo_sprite_n1 = [];
	this.combo_sprite_n2 = [];
	this.combo_number1 = ImageManager.loadSystem("Combo_C");
	this.combo_number2 = ImageManager.loadSystem("Combo_D");	
	this.addChild(this.combo_sprite_a);
	this.addChild(this.combo_sprite_b);
};

//==============================
// * Update Combo Sprites
//==============================
Spriteset_Battle.prototype.update_combo_sprites = function() {	
   if ($gameTemp.combo_data[0]) {this.refresh_combo_sprite()};
   if (this.combo_sprite_data[0] <= 0 && this.combo_sprite_a.opacity > 0) {
      this.combo_sprite_a.opacity -= 10;
	  this.combo_sprite_b.opacity -= 10;
	  this.combo_sprite_data[3] += 1;
   };   
   this.combo_sprite_a.x = this.combo_sprite_data[3] + Moghunter.combo_hit_layout_x;
   this.combo_sprite_a.y = Moghunter.combo_hit_layout_y;
   this.combo_sprite_b.x = this.combo_sprite_data[3] + Moghunter.combo_dmg_layout_x;
   this.combo_sprite_b.y = Moghunter.combo_dmg_layout_y;
   for (var i = 0; i < this.combo_sprite_n1.length; i++) {
	   this.combo_sprite_n1[i].x = this.combo_sprite_data[3] + this.combo_sprite_data[1][i]  + Moghunter.combo_hit_number_x;
	   this.combo_sprite_n1[i].y = Moghunter.combo_hit_number_y;
	   if (this.combo_sprite_n1[i].scale.x > 1.00) {this.combo_sprite_n1[i].scale.x -= 0.1;
	   this.combo_sprite_n1[i].scale.y = this.combo_sprite_n1[i].scale.x};
	   if (this.combo_sprite_data[0] <= 0) { this.combo_sprite_n1[i].opacity -= 10};
   };
   for (var i = 0; i < this.combo_sprite_n2.length; i++) {
	   this.combo_sprite_n2[i].x = this.combo_sprite_data[3] + this.combo_sprite_data[2][i]  + Moghunter.combo_dmg_number_x;
	   this.combo_sprite_n2[i].y = Moghunter.combo_dmg_number_y;
	   if (this.combo_sprite_data[0] <= 0) { this.combo_sprite_n2[i].opacity -= 10};
   };
   if (this.combo_sprite_data[0] > 0) {
	   if (!$gameTemp.combo_data[4]) {this.combo_sprite_data[0] -= 1};
       if ($gameTemp.combo_data[3]) {this.combo_sprite_data[0] = 0};
	   if (this.combo_sprite_data[0] == 0) {$gameTemp.combo_data = [false,0,0,false]};
   };
   
};

//==============================
// * Refresh Combo Sprite
//==============================
Spriteset_Battle.prototype.refresh_combo_sprite = function() {
	if (!this.combo_number1.isReady()) {return};
	$gameTemp.combo_data[0] = false;
	$gameTemp.combo_data[3] = false;
	this.combo_sprite_data[0] = 90;
    this.combo_sprite_a.opacity = 255;
    this.combo_sprite_b.opacity = 255;
	this.combo_sprite_data[3] = 0;	
	this.refresh_combo_hit();
	this.refresh_combo_damage();
};

//==============================
// * Refresh Combo Hit
//==============================
Spriteset_Battle.prototype.refresh_combo_hit = function() {
	var w = this.combo_number1.width / 10;
	var h = this.combo_number1.height;
	var dmg_number =  Math.abs($gameTemp.combo_data[1]).toString().split("");
	for (var i = 0; i <  this.combo_sprite_n1.length; i++) {this.removeChild(this.combo_sprite_n1[i]);};
    for (var i = 0; i <  dmg_number.length; i++) {
		var n = Number(dmg_number[i]);
		     this.combo_sprite_n1[i] = new Sprite(this.combo_number1);
			 this.combo_sprite_n1[i].setFrame(n * w, 0, w, h);
		     this.combo_sprite_data[1][i] = (i * w) - (dmg_number.length *  (w));
			 this.combo_sprite_n1[i].anchor.x = 0.5;
			 this.combo_sprite_n1[i].anchor.y = 0.5;
		     this.combo_sprite_n1[i].scale.x = 2;
			 this.combo_sprite_n1[i].scale.y = 2;			 
		     this.addChild(this.combo_sprite_n1[i]);
	};
};

//==============================
// * Refresh Combo Damage
//==============================
Spriteset_Battle.prototype.refresh_combo_damage = function() {
	var w = this.combo_number2.width / 10;
	var h = this.combo_number2.height;
	var dmg_number =  Math.abs($gameTemp.combo_data[2]).toString().split("");
	for (var i = 0; i <  this.combo_sprite_n2.length; i++) {this.removeChild(this.combo_sprite_n2[i]);};
    for (var i = 0; i <  dmg_number.length; i++) {
		var n = Number(dmg_number[i]);
		     this.combo_sprite_n2[i] = new Sprite(this.combo_number2);
			 this.combo_sprite_n2[i].setFrame(n * w, 0, w, h);
			 this.combo_sprite_data[2][i] = i * w;
		     this.addChild(this.combo_sprite_n2[i]);
	};
};
