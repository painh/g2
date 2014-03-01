var TILE_WIDTH  = 40;
var TILE_HEIGHT = 40;

var CHAR_WARRIOR		= 0;
var CHAR_MAGE			= 1;
var CHAR_THEIF			= 2;
var CHAR_GOBLIN			= 3;
var CHAR_COIN			= 4;
var CHAR_PUB			= 5;
var CHAR_INN			= 6;
var CHAR_GOBLIN_MAGE	= 7;

var IMG_WARRIOR			= 0;
var IMG_MAGE			= 1;
var IMG_THEIF			= 2;
var IMG_GOBLIN			= 3;
var IMG_COIN			= 4;
var IMG_PUB				= 5;
var IMG_FIRE_BALL		= 6;
var IMG_INN				= 7;
var IMG_GOBLIN_MAGE		= 8;
var IMG_MAX				= 9;


var g_statTable = [ 
					[	CHAR_WARRIOR,		IMG_WARRIOR,		'전사',			50,	50,	10,	8,	1.5,	1,		2,	0,	0,	0,	1, [],	0,		0	, 100,	0,	0, ],
					[	CHAR_MAGE,			IMG_MAGE,			'마법사',		20,	20,	1,	8,	1,		3,		0,	5,	0,	0,	1, [],	100,	100	, 100,	2,	2, ],
					[	CHAR_THEIF,			IMG_THEIF,			'도적',			40,	40,	5,	8,	2,		1,		1,	5,	0,	0,	1, [],	0,		0	, 100,	0,	0, ],
					[	CHAR_GOBLIN,		IMG_GOBLIN,			'고블린',		20,	20,	10,	8,	3,		1,		1,	1,	1,	0,	1, [],	0,		0	, 0,	0,	0, ],
					[	CHAR_COIN	,		IMG_COIN,			'황금',			0,	0,	0,	0,	0,		0,		0,	1,	0,	0,	0, [],	0,		0	, 0,	0,	0, ],
					[	CHAR_PUB,			IMG_PUB,			'선술집',		0,	0,	0,	0,	0,		0,		0,	0,	0,	0,	0, [],	0,		0	, 0,	0,	0, ],
					[	CHAR_INN,			IMG_INN,			'여관',			0,	0,	0,	0,	0,		0,		0,	0,	0,	0,	0, [],	0,		0	, 0,	0,	0, ],
					[	CHAR_GOBLIN_MAGE,	IMG_GOBLIN_MAGE,	'고마법사',		10,	10,	10,	8,	2,		3,		1,	1,	1,	0,	1, [],	20,		20	, 0,	3,	3, ],
				];

var STAT_CHAR_NO			= 0;
var STAT_CHAR_IMG			= 1;
var STAT_CHAR_TYPE_TEXT		= 2;
var STAT_HP					= 3;
var STAT_MAX_HP				= 4;
var STAT_STR				= 5;
var STAT_DEX				= 6;
var STAT_MOVE				= 7;
var STAT_RANGE				= 8;
var STAT_DEF				= 9;
var STAT_HAVE_COIN			= 10;
var STAT_GIVE_EXP			= 11;
var STAT_EXP				= 12;
var STAT_LEVEL				= 13;
var STAT_BASE_COMPONENT		= 14;
var STAT_MP					= 15;
var STAT_MAX_MP				= 16;
var STAT_CONTRACT_PRICE		= 17;
var STAT_ATTACK_DELAY		= 18;
var STAT_ATTACK_DELAY_MAX	= 19;

var FOWARD_LIMIT = 2;
var g_cameraX = 0;
var g_cameraY = 0;

var BLOCK_DISTANCE = 33;

var COMPONENT_STACK_ABLE		= 0;
var COMPONENT_SHOP				= 1;
var COMPONENT_COIN				= 2;
var COMPONENT_MOVE_LEFT			= 3;
var COMPONENT_STACK_DIE			= 4;
var COMPONENT_DEAD_REMOVE		= 5;
var COMPONENT_INVINCIBLE		= 6;
var COMPONENT_PUB				= 7;
var COMPONENT_SWIPE				= 8;
var COMPONENT_ATTACK_FORWARD	= 9;
var COMPONENT_ATTACK_BACK		= 10;
var COMPONENT_MANA_USER			= 11;
var COMPONENT_FIRE_BALL			= 12;
var COMPONENT_INN				= 13;

var g_coin = 10;
var g_distance = 0;
var g_gameOver = false;

g_statTable[CHAR_WARRIOR][STAT_BASE_COMPONENT]		= [COMPONENT_ATTACK_FORWARD, COMPONENT_SWIPE];
g_statTable[CHAR_MAGE][STAT_BASE_COMPONENT]			= [COMPONENT_MANA_USER, COMPONENT_FIRE_BALL];
g_statTable[CHAR_THEIF][STAT_BASE_COMPONENT]		= [COMPONENT_ATTACK_FORWARD, COMPONENT_ATTACK_BACK];
g_statTable[CHAR_GOBLIN][STAT_BASE_COMPONENT]		= [COMPONENT_MOVE_LEFT, COMPONENT_ATTACK_BACK];
g_statTable[CHAR_COIN][STAT_BASE_COMPONENT]			= [COMPONENT_STACK_ABLE, COMPONENT_STACK_DIE, COMPONENT_DEAD_REMOVE, COMPONENT_INVINCIBLE];
g_statTable[CHAR_PUB][STAT_BASE_COMPONENT]			= [COMPONENT_STACK_ABLE, COMPONENT_STACK_DIE, COMPONENT_DEAD_REMOVE, COMPONENT_INVINCIBLE, COMPONENT_PUB];
g_statTable[CHAR_INN][STAT_BASE_COMPONENT]			= [COMPONENT_STACK_ABLE, COMPONENT_STACK_DIE, COMPONENT_DEAD_REMOVE, COMPONENT_INVINCIBLE, COMPONENT_INN];
g_statTable[CHAR_GOBLIN_MAGE][STAT_BASE_COMPONENT]	= [COMPONENT_MANA_USER, COMPONENT_FIRE_BALL];

function removeFromList(list, obj)
{
	var idx = list.indexOf(obj);
	list.splice(idx, 1); 
}
function coinChange(change)
{
	g_coin += change;
	var eff;

	eff = g_effectManager.Add(6, 25, "#ffffff", "+ "+change+" coin");
	eff.font = '16pt Arial';
	eff.world = false;

	if(change > 0)
	{
		PlaySound('coinGet');
		eff = g_effectManager.Add(5, 24, "#ffff00", "+ "+change+" coin");
	}
	else 
	{
		PlaySound('coinOut');
		eff = g_effectManager.Add(5, 24, "#ff0000", ""+change+" coin");
	}
	eff.font = '16pt Arial';
	eff.world = false;
}

var g_effectManager = new EffectManager();
var g_gameUI = new BtnManager();
//-----------------------------------------------------------------------------------------------------

g_playerManager = new ObjManager();
g_otherManager = new ObjManager();

doTurn = function(playerMoved)
{
	if(playerMoved)
		g_distance++;
	g_playerManager.DoTurn(g_otherManager, playerMoved);
	g_otherManager.DoTurn(g_playerManager, playerMoved);
}

generate = function()
{
	var maxCnt = randomRange(1, 5);
	var x = parseInt(g_cameraX + Renderer.width / TILE_WIDTH);

	if((g_distance % 80) == 0 && randomRange(1, 5) <= 4)
	{
		var ranY = parseInt(randomRange(1, Renderer.height / TILE_HEIGHT - 1));
		if(g_otherManager.GetChrByPos(x, ranY) == null)
		{
			chr = g_otherManager.Add(CHAR_INN, x, ranY);
			chr.flip = false;
		}
	}
	
	if((g_distance % 100) == 0 && randomRange(1, 5) <= 4)
	{
		var ranY = parseInt(randomRange(1, Renderer.height / TILE_HEIGHT - 1));
		if(g_otherManager.GetChrByPos(x, ranY) == null)
		{
			chr = g_otherManager.Add(CHAR_PUB, x, ranY);
			chr.flip = false;
		}
	}

	for(var i = 0; i < maxCnt;++i)
	{

		var ran = randomRange(0, 100);

		if(ran < 10)
		{ 
			var ranY = parseInt(randomRange(1, Renderer.height / TILE_HEIGHT - 1));
			if(g_otherManager.GetChrByPos(x, ranY) != null)
				continue;
			chr = g_otherManager.Add(CHAR_COIN, x, ranY);
			chr.flip = false;
		}
		else if(ran < 15)
		{
			var ranY = parseInt(randomRange(1, Renderer.height / TILE_HEIGHT - 1));
			if(g_otherManager.GetChrByPos(x, ranY) != null)
				continue;
			chr = g_otherManager.Add(CHAR_GOBLIN, x, ranY);
		}
		else if(ran < 17)
		{
			var ranY = parseInt(randomRange(1, Renderer.height / TILE_HEIGHT - 1));
			if(g_otherManager.GetChrByPos(x, ranY) != null)
				continue;
			chr = g_otherManager.Add(CHAR_GOBLIN_MAGE, x, ranY);
		}
	}
}

function NextTurn(playerMoved)
{
	PlaySound('footstep');
	generate();
	doTurn(playerMoved);
}

var g_imgs = [];
var SceneIngame = function()
{ 
	this.Start = function()
	{
		for(var i = 0; i < IMG_MAX; ++i)
			g_imgs[i] = ImageManager.Register( "./img/char_"+i+".png", "img_"+i);

//		g_gameUI.Add(240, 30, 64, 32, '위로', this, "goUp");
//		g_gameUI.Add(240, 70, 64, 32, '아래로', this, "goDown");
//		g_gameUI.Add(240, 200, 64, 32, '앞으로', this, "goNext");
//
		for(var i = 0; i < 29; ++i)
			g_playerManager.Add(CHAR_WARRIOR, 0, 5, i);
	}
	
	this.End = function()
	{
	} 
	
	this.Update = function()
	{ 
		if(g_gameOver)
			return;

		g_playerManager.Update();
		g_otherManager.Update();

		g_effectManager.Update();

		g_gameUI.Update();
		if(MouseManager.Clicked != true)
			return;

		var chr = g_playerManager.GetChrFromScreenPos(MouseManager.x, MouseManager.y);
		if(!chr)
			return; 
	}
	
	this.Render = function()
	{
		Renderer.SetAlpha(1.0); 
		Renderer.SetColor("#bbbbbb"); 

		var ycnt = Math.abs(g_cameraX) % 2;
		for(var i = 0; i < Renderer.width; i += TILE_WIDTH)
		{
			var cnt = (ycnt%2);
			for(var j = 0; j < Renderer.height; j += TILE_HEIGHT)
			{
				if(cnt % 2)
					Renderer.Rect( i, j, TILE_WIDTH, TILE_HEIGHT);

				++cnt;
			}

			ycnt++;
		}	
		g_otherManager.Render();
		g_playerManager.Render();

		
//		Renderer.SetAlpha(0.8); 
//		Renderer.SetColor("#000000"); 
//		Renderer.Rect(0, 0, Renderer.width, TILE_HEIGHT);

//		Renderer.SetAlpha(1.0); 
//		Renderer.Img(0, 0, g_imgs[IMG_COIN]);
//		Renderer.SetColor("#ffffff"); 
//		Renderer.SetFont('16pt Arial');
//		Renderer.Text(24, 3, "x " + g_coin + "  거리 : "+g_distance); 
		g_gameUI.Render();

		g_effectManager.Render();
		Renderer.SetAlpha(1.0); 

		if(!g_gameOver)
			return; 

//		Renderer.SetAlpha(0.8); 
//		Renderer.SetColor("#000000"); 
//		Renderer.Rect(0, 0, Renderer.width, Renderer.height);
//
		Renderer.SetAlpha(1); 
		Renderer.SetColor("#ff0000"); 
		Renderer.SetFont('16pt Arial');
		Renderer.Text(24, 150, "Game Over"); 
	} 


	this.goUp = function()
	{
		if(g_playerManager.PlayerNextStepAble(0, -1, g_otherManager))
			g_playerManager.PlayerNextStep(0, -1);

		NextTurn(false);
	}

	this.goDown = function()
	{
		if(g_playerManager.PlayerNextStepAble(0, 1, g_otherManager))
			g_playerManager.PlayerNextStep(0, 1);

		NextTurn(false);
	}

	this.goNext = function()
	{ 
		if(g_playerManager.PlayerNextStepAble(1, 0, g_otherManager))
		{
			g_cameraX++;
			g_playerManager.PlayerNextStep(1, 0); 
		}

		NextTurn(true); 
	}
};
