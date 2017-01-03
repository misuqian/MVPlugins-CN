//=============================================================================
// MOG_Credits.js
//=============================================================================

/*:
* @plugindesc (v1.1) Adds the credits scene to the title screen.
* @author Moghunter
*
* @param Command Name
* @desc Definition of the command name on the title screen.
* @default Credits
*
* @param Scrolling Speed
* @desc Scroll Speed.
* @default 1
*
* @help
* ================================================================= ============================
* +++ MOG - Credits (v1.1) +++
* By Moghunter
* https://atelierrgss.wordpress.com/
* ================================================================= ============================
* Adds the credits scene to the title screen.
*
* ================================================================= ============================
* USE
* ================================================================= ============================
* Images will be needed (img / system)
*
* CreditsA.png
* CreditsB.png
*
* The height of the image can be any size.
*
* ================================================================= ============================
* HISTORIC
* ================================================================= ============================
* (V1.1) - Correction in the Background effect in the other scenes.
*/

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_Credits = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_Credits');
	Moghunter.credits_commandName = String(Moghunter.parameters['Command Name'] || "Credits");
    Moghunter.credits_scrollSpeed = Number(Moghunter.parameters['Scrolling Speed'] || 1);
	
//=============================================================================
// ** Window Title Command
//=============================================================================	

//==============================
// * make Command List
//==============================
var _mog_credits_wtc_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function() {
    _mog_credits_wtc_makeCommandList.call(this);
	this.addCommand(String(Moghunter.credits_commandName),   'mcredits');
};	
	
//=============================================================================
// ** Scene Tittle
//=============================================================================	

//==============================
// * create Command Window
//==============================
var _mog_credits_createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
    _mog_credits_createCommandWindow.call(this);
	this._commandWindow.setHandler('mcredits',  this.commandMCredits.bind(this));
};

//==============================
// * command MCredits
//==============================
Scene_Title.prototype.commandMCredits = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_MCredits);
};


//=============================================================================
// ** Scene M Credits
//=============================================================================	

//==============================
// * create Command Window
//==============================
function Scene_MCredits() {
    this.initialize.apply(this, arguments);
}

Scene_MCredits.prototype = Object.create(Scene_MenuBase.prototype);
Scene_MCredits.prototype.constructor = Scene_MCredits;

//==============================
// * initialize
//==============================
Scene_MCredits.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

//==============================
// * Create Mbackground
//==============================
Scene_MCredits.prototype.create_mbackground = function() {
};

//==============================
// * create
//==============================
Scene_MCredits.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createPictureCredit();
};

//==============================
// * create
//==============================
Scene_MCredits.prototype.createPictureCredit = function() {
	this._creditsSpeed = Math.min(Math.max(Moghunter.credits_scrollSpeed,0.5),10);
    this.pictureCredit = [];
	this.pictureCredit[0] = new Sprite(ImageManager.loadSystem("CreditsA"));
	this.addChild(this.pictureCredit[0]);
	if (Imported.MOG_MenuParticles && !this.skip_particles()) {this.create_mparticles()};
	this.pictureCredit[1] = new Sprite(ImageManager.loadSystem("CreditsB"));
	this.pictureCredit[1].y = Graphics.boxHeight / 2;
	this.pictureCredit[1].opacity = 0;	
	this.addChild(this.pictureCredit[1]);
};

//==============================
// * Press Any Key
//==============================
Scene_MCredits.prototype.pressAnyKey = function() {
    if (TouchInput.isTriggered()) {return true};
	if (TouchInput.isCancelled()) {return true};
	if (Input.isTriggered("ok")) {return true};
	if (Input.isTriggered("cancel")) {return true};
    return false;
};

//==============================
// * Update
//==============================
Scene_MCredits.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    this.pictureCredit[1].opacity += 1;
	this.pictureCredit[1].y -= this._creditsSpeed;
	if (this.pressAnyKey()) {SoundManager.playCursor();SceneManager.pop()};	 
	if (this.pictureCredit[1].y < -this.pictureCredit[1].height) {SceneManager.pop()};
	if (this._backgroundSprite) {this._backgroundSprite.visible = false};
};