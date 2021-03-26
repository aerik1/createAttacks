on("chat:message",function(msg){
	if(msg.type=="api" && msg.content.indexOf("!createAttacks")==0)
	{
	    //Must have a token selected
		var selected = msg.selected;
		if (selected===undefined)
		{
			sendChat("API","Please select a character.");
			return;
		};
		
		function toProperCase(s) {
            //split the string by space
			let parts = s.split(" ");
			let sb = [];
				
			for(i=0;i<parts.length;i++) {
			    if (parts[i] != 'of') {           
                    sb.push(parts[i].substring(0,1).toUpperCase() + parts[i].substring(1).toLowerCase() + ' ');
			    } else {
			        sb.push(parts[i] + ' ');
			    };
            };
			return sb.join(' ').toString().trim();
		};
		
		//selected token 
		var token = getObj("graphic",selected[0]._id);
		var character = getObj("character",token.get("represents"));
		
		//Sheet with GM attack abilities
		var charGM = getObj("character","-M99ceDu7rTmyBrbWRdu");
		
		//Output arrays
		var meleeOutput = [];
		var rangedOutput = [];
		var abilityOutput = [];
		
			
		//Melee Attacks
        let meleerx = /^repeating_melee-strikes_([^_]+?)_weapon$/g;
        let meleeAttacks = findObjs({ type: 'attribute', characterid: character.id})
            .filter(s => meleerx.test(s.get('name')))
            .map(s => { return { id: s.id, lbl: toProperCase(s.get('current')) }; })              // start creating the object of component parts
            


			//Populate output array 
            for (i=0;i<meleeAttacks.length;i++){
        		meleeOutput.push({ id: meleeAttacks[i].id, lbl: meleeAttacks[i].lbl, command: 'Melee' + (i + 1) + '}' });
        	    };
            
            
			//map the new meleeOutput array into the needed buttons based on above for loop
			meleeOutput = meleeOutput.map(s => `[${s.lbl}](!&#13;&#37;{GMMacro|${s.command})`).join('');
			
			
			//Ranged Attacks
        let rangedrx = /^repeating_ranged-strikes_([^_]+?)_weapon$/g;
        let rangedAttacks = findObjs({ type: 'attribute', characterid: character.id})
            .filter(s => rangedrx.test(s.get('name')))
            .map(s => { return { id: s.id, lbl: toProperCase(s.get('current')) }; })              // start creating the object of component parts
            


			//Populate output array 
            for (i=0;i<rangedAttacks.length;i++){
        		rangedOutput.push({ id: rangedAttacks[i].id, lbl: rangedAttacks[i].lbl, command: 'Ranged' + (i+1) + '}' });
        	    };
            
            
			//map the new rangedOutput array into the needed buttons based on above for loop
			rangedOutput = rangedOutput.map(s => `[${s.lbl}](!&#13;&#37;{GMMacro|${s.command})`).join('');			


			//Offensive or Proactive abilities
        let abilityrx = /^repeating_actions-activities_([^_]+?)_name$/g;
        let abilityAttacks = findObjs({ type: 'attribute', characterid: character.id})
            .filter(s => abilityrx.test(s.get('name')))
            .map(s => {
	            abilityrx.lastIndex =0;		
				elem = abilityrx.exec(s.get('name'));				   
				return { id: s.id, lbl: s.get('current'), act: getAttrByName(character.id, `repeating_actions-activities_${elem[1]}_actions`) };             
            });


 			//map to Powercard output for abilities
			for (i=0;i<abilityAttacks.length;i++) {
			    if (abilityAttacks[i].act.length != 0) {
			        abilityOutput.push (`^^//[${abilityAttacks[i].lbl}](!&#13;&#37;{${character.get('name')}|repeating_actions-activities_$` + i + `_action-npc}) (${abilityAttacks[i].act} actions)//^^`) 
			    } else {
			        abilityOutput.push (`^^//[${abilityAttacks[i].lbl}](!&#13;&#37;{${character.get('name')}|repeating_actions-activities_$` + i + `_action-npc})//^^`)
			    };
			};
			
			
		//format to Powercard
		var printMelee = '';
		var printRanged = '';
		var printAbilities = '';

		
		if (meleeAttacks.length != 0) {
		    printMelee = ' --Melee Attacks:|' + meleeOutput
		};
		
		if (rangedAttacks.length != 0) {
		    printRanged = ' --Ranged Attacks:|' + rangedOutput
		};
		
		if (abilityAttacks.length != 0) {
		    printAbilities = ' --Special Abilities:|' + abilityOutput.join('')
		};

			    

    sendChat("Create Attacks", `!power {{ --name|${character.get('name')} Attacks --format|gmspells --whisper|GM  ${printMelee} ${printRanged} ${printAbilities}`);

		
	};
});