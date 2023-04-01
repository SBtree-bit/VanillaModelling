(async function () {
    let namespace_button;
    let functions_button;
    let datapack_menu;
    let jszip = await fetch("https://raw.githubusercontent.com/Stuk/jszip/main/dist/jszip.min.js");
    eval(jszip);

    Plugin.register('vanilla_modelling', {
        title: 'Vanilla Modelling',
        author: 'SBtree',
        description: 'This plugin can make a custom datapack that adds your model to minecraft (no resource pack required).',
        icon: 'icon-player',
        version: '0.0.1',
        variant: 'both',
        onload() {
            namespace_button = new Action('create_namespace', {
                name: 'Create Namespace',
                description: 'Make a namespace for the current model',
                icon: 'icon-player',
                click: async function () {
                    let zip = new JSZip();
                    let cubes = Cube.all;
                    let file = "";
                    cubes.forEach(element => {
                        console.log(element);
                        file = file + "summon block_display ~ ~ ~"
                            + " {block_state:{Name:'minecraft:quartz_block'},Tags:['new']}\n"
                            + "data merge entity @e[type=block_display,tag=new,limit=1] {"
                            + "transformation:{translation:[" + element.from[0] / 16
                            + ", " + element.from[1] / 16 + ", " + element.from[2] / 16
                            + "],scale:[" + element.size(0) / 16 + ", " + element.size(1) / 16
                            + "," + element.size(2) / 16 + "]},start_interpolation:-1}\n";
                    });
                    zip.folder("model." + Project.name)
                        .folder("functions")
                        .file("summon.mcfunction", file);
                    let zip_file;
                    if (JSZip.support.uint8array) {
                        zip_file = await zip.generateAsync({ type: "uint8array" });
                    } else {
                        zip_file = await zip.generateAsync({ type: "string" });
                    }
                    Blockbench.export({
                        type: "application/zip",
                        extensions: "zip",
                        name: Project.name + "_namespace.zip",
                        content: zip_file
                    })
                }
            });
            functions_button = new Action('create_functions', {
                name: 'Create Functions',
                description: 'Make a folder of the functions for the current model',
                icon: 'icon-player_head',
                click: async function () {
                    let zip = new JSZip();
                    let cubes = Cube.all;
                    let file = "";
                    cubes.forEach(element => {
                        console.log(element);
                        file = file + "summon block_display ~ ~ ~"
                            + " {block_state:{Name:'minecraft:quartz_block'},Tags:['new']}\n"
                            + "data merge entity @e[type=block_display,tag=new,limit=1] {"
                            + "transformation:{translation:[" + element.from[0] / 16
                            + ", " + element.from[1] / 16 + ", " + element.from[2] / 16
                            + "],scale:[" + element.size(0) / 16 + ", " + element.size(1) / 16
                            + "," + element.size(2) / 16 + "]},start_interpolation:-1}\n";
                    });
                    zip.folder(Project.name)
                        .file("summon.mcfunction", file);
                    let zip_file;
                    if (JSZip.support.uint8array) {
                        zip_file = await zip.generateAsync({ type: "uint8array" });
                    } else {
                        zip_file = await zip.generateAsync({ type: "string" });
                    }
                    Blockbench.export({
                        type: "application/zip",
                        extensions: "zip",
                        name: Project.name + "_functions.zip",
                        content: zip_file
                    })
                }
            });
            datapack_button = new Action('create_datapack', {
                name: 'Create Datapack',
                description: 'Make a folder of the functions for the current model',
                icon: 'icon-ground',
                click: async function () {
                    let zip = new JSZip();
                    let cubes = Cube.all;
                    let file = "";
                    let MathScene = new THREE.Scene()
                    cubes.forEach(element => {
			let object = new THREE.Object3D();
                        MathScene.add(object);
                    	let direction = new THREE.Vector3();
                        let position = new THREE.Vector3(((element.size(0)/2)+element.from[0], (element.size(1)/2)+element.from[1], (element.size(2)/2)+element.from[2]);
			let rotation = new THREE.Vector3(element.rotation[0], element.rotation[1], element.rotation[2]);
			object.position.copy(position);
                        object.rotation.copy(rotation);
			for (let i = 0; i < 6; i++) {
				switch (Math.floor(i/2)) {
					case 0:
						break;
					case 1:
						rotation = new THREE.Vector3(element.rotation[0], element.rotation[1] - 90, element.rotation[2]);
                        			object.rotation.copy(rotation);
						break;
					case 2:
						rotation = new THREE.Vector3(element.rotation[0], element.rotation[1], element.rotation[2] + 90);
                        			object.rotation.copy(rotation);
						break;
				}
                        	object.getWorldDirection(direction);
                        	direction.normalize()
				if (i % 2) {
					direction.negate()
				}
                        	let ray = new THREE.Ray(position, direction);
                        	let rayhit = new THREE.Vector3();
                        	ray.at(element.size(Math.floor(i/2))/2, rayhit);
                        	console.log(direction);
                        	console.log(rayhit);
                        	file = file + `summon block_display ~ ~ ~ {block_state:{Name:'minecraft:quartz_block'},Tags:['new']}\ndata merge entity @e[type=block_display,tag=new,limit=1] {transformation:{translation:[${rayhit.x/16}f,${rayhit.y/16}f,${rayhit.z/16}f],scale:[0.0625f,0.0625f,0.0f]},start_interpolation:-1}\ntag @e[tag=new] remove new\n`;
                    	}
		    });
                    let project_folder = zip.folder(Project.name)
                    let functions_folder = project_folder.folder("data")
                        .folder("model." + Project.name)
                        .folder("functions")
                    functions_folder.file("summon.mcfunction", file);
                    project_folder.file("pack.mcmeta", `{"pack": {"description": "A datapack that adds the model '${Project.name}' to vanilla minecraft.","pack_format": 12}}`)
                    let zip_file;
                    if (JSZip.support.uint8array) {
                        zip_file = await zip.generateAsync({ type: "uint8array" });
                    } else {
                        zip_file = await zip.generateAsync({ type: "string" });
                    }
                    Blockbench.export({
                        type: "application/zip",
                        extensions: "zip",
                        name: Project.name + "_datapack.zip",
                        content: zip_file
                    })
                }
            });
            datapack_menu = new Menu("vanilla_modelling_menu", [namespace_button])
            MenuBar.addAction(namespace_button, 'filter');
            MenuBar.addAction(functions_button, 'filter')
            MenuBar.addAction(datapack_button, 'filter')
        },
        onunload() {
            namespace_button.delete();
            functions_button.delete();
            datapack_button.delete();
        }
    });

})();
