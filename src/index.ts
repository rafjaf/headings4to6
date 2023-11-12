import joplin from 'api';
import { MenuItemLocation, ToolbarButtonLocation } from 'api/types';

joplin.plugins.register({
	onStart: async function() {
		
		// Load CSS
		const installDir = await joplin.plugins.installationDir();		
		const chromeCssFilePath = installDir + '/buttons.css';
		await (joplin as any).window.loadChromeCssFile(chromeCssFilePath);
		
		// For each heading level
		for (let i: number = 1; i < 7; i++) {
			const level: string = i.toString();
			// Register command
			await joplin.commands.register({
				name: 'applyHeading' + level,
				label: 'Heading ' + level,
				iconName: 'btnh' + level,
				enabledCondition: "richTextEditorVisible",
				execute: async () => {
					await (async (lvl: string) => {
						await joplin.commands.execute('editor.execCommand', {
							name: 'mceToggleFormat',
							args: [],
							ui: false,
							value: 'h' + lvl,
						});
					})(level);
				},
			});
			// Create menu item with keyboard shortcut
			await joplin.views.menuItems.create('menuH' + level, 'applyHeading' + level, MenuItemLocation.Edit, { accelerator: 'CmdOrCtrl+' + level });
			// Create toolbar button H4 to H6
			if (i >= 4) {
				await joplin.views.toolbarButtons.create('btnH' + level, 'applyHeading' + level, ToolbarButtonLocation.EditorToolbar);
			}
		}
	},
});
