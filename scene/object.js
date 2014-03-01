var objPosTable = [
//					[0,0], [1,0], [2,0], [3,0], [4,0], [5,0],
														[5,1],
					[5,2], [4,2], [3,2], [2,2], [1,2], [0,2],
					[0,3],
					[0,4], [1,4], [2,4], [3,4], [4,4], [5,4],
														[5,5],
					[5,6], [4,6], [3,6], [2,6], [1,6], [0,6],
					[0,7],
					[0,8], [1,8], [2,8], [3,8], [4,8], [5,8],
					[0,9],
					[5,10], [4,10], [3,10], [2,10], [1,10], [0,10],
					[0,11],
					[0,12], [1,12], [2,12], [3,12], [4,12], [5,12],
					[0,13]
					]; 

var Obj = function()
{
	this.screenPos = 0;
	this.x = 0;
	this.y = 0;
	this.width = 1;
	this.height = 1;
	this.stats = [];

	this.type = 0;
	this.portrait = 0;
	this.component = [];
	this.targets = [];

	this.isPlayer = false;
	this.flip = true;
	this.isDead = false;
	this.isRemoved = false;

	this.Update = function()
	{
		if(this.isRemoved)
			return;
	}

	this.Render = function()
	{ 
		if(this.isRemoved)
			return;

		var img = g_imgs[this.stats[STAT_CHAR_IMG]];

		if(img)
		{
			Renderer.SetAlpha(1);
			var x = this.x;
			var y = this.y;

			x = objPosTable[this.screenPos][0];
			y = objPosTable[this.screenPos][1];

			x = (x - g_cameraX) * TILE_WIDTH;
			y = (y - g_cameraY) * TILE_HEIGHT;

//			if(this.flip == false) 
//				Renderer.Img(x, y, img);
//			else
//				Renderer.ImgFlipH(x, y, img);

			Renderer.Text(x, y, this.screenPos);
		}

		if(this.isDead)
		{ 
			Renderer.SetAlpha(0.8);
			Renderer.SetColor("#000000"); 
			Renderer.Rect((this.x - g_cameraX) * TILE_WIDTH, this.y * TILE_HEIGHT , TILE_WIDTH, TILE_HEIGHT);
			return;
		}


		if(this.stats[STAT_HP] > 0)
		{
			Renderer.SetColor("#ffff00");
			Renderer.Rect((this.x - g_cameraX) * TILE_WIDTH, this.y * TILE_HEIGHT + TILE_HEIGHT - 3, TILE_WIDTH, 3);

			Renderer.SetColor("#ff0000"); 
			var width = this.stats[STAT_HP] / this.stats[STAT_MAX_HP] * TILE_WIDTH;
			Renderer.Rect((this.x - g_cameraX) * TILE_WIDTH, this.y * TILE_HEIGHT + TILE_HEIGHT - 2, width, 1); 
		}


		if(this.stats[STAT_ATTACK_DELAY_MAX] > 0)
		{
			Renderer.SetFont('8pt Arial');

			Renderer.SetAlpha(1);
			Renderer.SetColor("#ffffff"); 
			Renderer.Rect((this.x - g_cameraX) * TILE_WIDTH, this.y * TILE_HEIGHT, TILE_WIDTH, 5) ;

			if(this.stats[STAT_ATTACK_DELAY] <= 0)
				Renderer.SetColor("#ff0000"); 
			else
				Renderer.SetColor("#0000ff"); 

			Renderer.Rect((this.x - g_cameraX) * TILE_WIDTH, this.y * TILE_HEIGHT, TILE_WIDTH * ((this.stats[STAT_ATTACK_DELAY]+1)/(this.stats[STAT_ATTACK_DELAY_MAX]+1)), 5) ;
		} 
	}

	this.RenderTargets = function()
	{
		if(this.isDead)
			return;
		
		Renderer.SetAlpha(0.5); 
		if(this.isPlayer)
			Renderer.SetColor("#000000");
		else
			Renderer.SetColor("#ff0000");

		var center = this.GetCenter();
		
		for(var i = 0; i < this.targets.length; ++i)
		{
			if(i >= 1)
				break;

			var target = this.targets[i];
			var tcenter = target.GetCenter();
			if(this.isPlayer)
				Renderer.Line(center.x - g_cameraX * TILE_WIDTH, center.y - 5, tcenter.x - g_cameraX * TILE_WIDTH, tcenter.y - 5); 
			else
				Renderer.Line(center.x - g_cameraX * TILE_WIDTH, center.y, tcenter.x - g_cameraX * TILE_WIDTH, tcenter.y); 
		}
	}
		
	this.GetCenter = function()
	{
		var x = this.x * TILE_WIDTH + this.width * TILE_WIDTH/ 2;
		var y = this.y * TILE_HEIGHT + this.height * TILE_HEIGHT / 2;

		return {x : x, y : y};
	}

	this.PlayerNextStepAble = function(x, y, objList)
	{ 
		if(this.isDead)
			return true;

		var newX = this.x + x;
		var newY = this.y + y;

		if(newY < 1 || newY >= Renderer.height / TILE_HEIGHT)
			return false; 

		for(var i in objList)
		{
			var item = objList[i];
			if(item == this)
				continue;

			if(item.isDead)
				continue;

			if(item.checkCompo(COMPONENT_STACK_ABLE))
				continue;
			
			if(item.y == newY && item.x == newX)
				return false;
		}

		return true;
	}

	this.PlayerNextStep = function(x, y)
	{
		if(this.isDead)
			return;

		this.x += x;
		this.y += y;
	}

	this.GetDistance = function(obj)
	{
		var myCenter = this.GetCenter();
		var otherCenter = obj.GetCenter();


		return Math.sqrt( Math.pow(myCenter.x - otherCenter.x, 2) + Math.pow(myCenter.y - otherCenter.y, 2)) / BLOCK_DISTANCE;
	}

	this.getTargets = function(list, range)
	{
		var myCenter = this.GetCenter();
		var retList = [];

		for(var i in list)
		{
			var item = list[i];

			if(item.isRemoved)
				continue;
			
			if(item.isDead)
				continue;

			if(item.checkCompo(COMPONENT_INVINCIBLE))
				continue;
			
			if(this.GetDistance(item) < range)
				retList.push(item);
			
		}

		var chr = this;
		retList.sort(function(a, b)
		{
			return chr.GetDistance(a) - chr.GetDistance(b);
		});
		return retList;
	}

	this.checkCompo = function(type)
	{
		for(var i in this.component)
		{
			var item = this.component[i];
			if(item.type == type)
				return item;
		}

		return null;
	}

	this.AddCompo = function(type, op)
	{
		this.component.push({type:type, op : op});
	}
	

	this.AIMove = function(myTeamList, otherTeamList)
	{
		var newX = this.x;
		var newY = this.y;

		if(this.checkCompo(COMPONENT_MOVE_LEFT))
		{
			newX -= 1;
			newY += 0;
		}


		if(newY < 1 || newY >= Renderer.height / TILE_HEIGHT)
			return false;

		var teamList = [myTeamList, otherTeamList];
		for( j = 0; j < 2; j++)
		{
			var list = teamList[j];
			for(var i in list)
			{
				var item = list[i];
				if(item == this)
					continue;

				if(item.checkCompo(COMPONENT_STACK_ABLE))
					continue;

				if(item.isDead)
					continue;

				if(item.y == newY && item.x == newX)
					return false;
			}
		}

		this.x = newX;
		this.y = newY; 
	}

	this.Dead = function(myTeamList, otherTeamList)
	{
		if(this.isDead == true)
			return;

		if(this.stats[STAT_HAVE_COIN] != 0)
			coinChange(this.stats[STAT_HAVE_COIN]);
		
		this.isDead = true;

		if(!this.checkCompo(COMPONENT_INVINCIBLE))
			PlaySound('die');

		if(this.checkCompo(COMPONENT_DEAD_REMOVE))
			this.isRemoved = true;

		if(this.isPlayer)
		{
			var deadCnt = 0;
			for(var i in myTeamList)
				if(myTeamList[i].isDead)
					deadCnt++;

			if(deadCnt == myTeamList.length)
			{
				g_gameOver = true;
			}
			
		}

	}

	this.DoTurn = function(myTeamList, otherTeamList, playerMoved)
	{ 
		if(g_cameraX - this.x + 1 >= FOWARD_LIMIT)
			this.isRemoved = true;

		if(this.isRemoved)
			return;

		if(this.isDead)
			return; 

		for(var i in otherTeamList)
		{ 
			var item = otherTeamList[i];
			if(item == this)
				continue;

			if(item.isDead)
				continue;

			if(item.y == this.y && item.x == this.x)
			{
				if(this.checkCompo(COMPONENT_STACK_DIE))
				{
					this.Dead(myTeamList, otherTeamList);
				} 
			} 
		}

		if(this.isDead)
			return; 

		var m = this.stats;
		
		if(this.isPlayer == false && playerMoved == false)
			this.AIMove(myTeamList, otherTeamList);

		this.targets = this.getTargets(otherTeamList, this.stats[STAT_RANGE]);

		if(this.targets.length <= 0)
			return;
		
		var target = this.targets[0];

		if(!target.checkCompo(COMPONENT_INVINCIBLE))
		{
			var damage = 0;
			if( (this.checkCompo(COMPONENT_ATTACK_FORWARD) && this.x < target.x) ||
				(this.checkCompo(COMPONENT_ATTACK_BACK) && this.x > target.x) ||
				(this.checkCompo(COMPONENT_SWIPE) && this.x == target.x) ||
				(this.checkCompo(COMPONENT_FIRE_BALL)
				)
			)
			{
				if(this.stats[STAT_ATTACK_DELAY_MAX] >= 0)
					this.stats[STAT_ATTACK_DELAY]--;

				if(this.stats[STAT_ATTACK_DELAY] < 0)
				{
					this.stats[STAT_ATTACK_DELAY] = this.stats[STAT_ATTACK_DELAY_MAX];
					var t = target.stats;
					var byWhat = 'normal_attack';
					var compo;
					if(this.checkCompo(COMPONENT_FIRE_BALL))
					{
						var compo = g_componentType[COMPONENT_FIRE_BALL][3];

						if(this.stats[STAT_MP] >= compo.mp) 
						{
							damage = -10;
							this.stats[STAT_MP] -= 10;
							byWhat = 'fire_ball';
							g_effectManager.Add(target.x * TILE_WIDTH, target.y * TILE_HEIGHT, "", "", g_imgs[IMG_FIRE_BALL]);
							
						}
					}
					else
						damage = t[STAT_DEF] - m[STAT_STR];

					t[STAT_HP] = t[STAT_HP] + damage;

					if(t[STAT_HP] <= 0)
						target.Dead(otherTeamList, myTeamList);

					if(damage < 0) 
					{
						g_effectManager.Add(target.x * TILE_WIDTH , target.y * TILE_HEIGHT, "#ff0000", damage);
						PlaySound(byWhat);
					}
				}
			}
		}

	} 
};

var ObjManager = function()
{ 
	this.m_list = [];

	this.Add = function(type, x, y, pos)
	{

		var obj = new Obj();
		
		for(var i in g_statTable)
		{
			var item = g_statTable[i];
			if(item[0] != type)
				continue;	

			obj.stats = item.slice(); //deep copy
			for(var i in obj.stats[STAT_BASE_COMPONENT])
				obj.AddCompo(obj.stats[STAT_BASE_COMPONENT][i]);
		}

		obj.x = x;
		obj.y = y;
		obj.screenPos = pos;
		this.m_list.push(obj);

		return obj;
	}

	this.Update = function()
	{
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			item.Update();
		}
	}

	this.Render = function()
	{
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			item.Render();
		}

		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			item.RenderTargets();
		}
	}

	this.DoTurn = function(otherManager, playerMoved)
	{ 
		var removedList = [];
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			item.DoTurn(this.m_list, otherManager.m_list, playerMoved);
			if(item.isRemoved)
				removedList.push(item);
		}

		for(var i in removedList)
		{
			var item = removedList[i];
			removeFromList(this.m_list, item);
		} 
	}

	this.PlayerNextStepAble = function(x, y, otherManager)
	{
		var flag = false;
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			if(!item.PlayerNextStepAble(x, y, otherManager.m_list))
				return false;
		}

		return true;
	}

	this.PlayerNextStep = function(x, y)
	{
		var list = this.m_list;		

		for(var i in list)
		{
			var item = list[i];
			item.PlayerNextStep(x, y);
		}
	}

	this.GetChrFromScreenPos = function(_x, _y)
	{
		var x = parseInt(_x / TILE_WIDTH) + g_cameraX;
		var y = parseInt(_y / TILE_HEIGHT);

		return this.GetChrByPos(x, y);
	}

	this.GetChrByPos = function(x,y)
	{ 
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			if(item.x == x && item.y == y)
				return item;
		}
		return null;
	}

}; 
