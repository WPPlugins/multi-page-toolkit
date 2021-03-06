/**
 * $Id: editor_plugin_src.js $
 *
 * @author Tarkan Akdam
 * @copyright Copyright � 2006-2008, Tarkan Akdam, All rights reserved.
 */
			
(function() {
	tinymce.create('tinymce.plugins.MultipageButtons', {
				   
		init:function(ed,url) {
			
            var pb = '<img src="' + url + '/img/trans.gif" class="mceNextPage mceItemNoResize" title="Next Page ..." />';
			
			// Register commands
			ed.addCommand('mceNextPage', function() {
				ed.execCommand('mceInsertContent', 0, pb);
			});
			
			ed.addCommand('mcePageTitle', function() {
				ed.windowManager.open({
					file : url + '/dialog.htm',
					width : 320 + parseInt(ed.getLang('pagetitle.delta_width', 0)),
					height : 80 + parseInt(ed.getLang('pagetitle.delta_height', 0)),
					inline : 1
				}, {
					plugin_url:url // Plugin absolute URL
				});
			});

			// Register buttons
			ed.addButton('nextpage', {title : 'Insert Next Page', cmd: 'mceNextPage', image: url + '/img/nextpageicon.gif'});
			ed.addButton('pagetitle', {title : 'Insert Page Title', cmd : 'mcePageTitle', image : url + '/img/pagetitleicon.gif'});

			ed.onInit.add(function() {
				if (ed.settings.content_css !== false)
					ed.dom.loadCSS(url+"/css/content.css");
			});

			// Display icon instead if img in element path
			ed.onPostRender.add(function() {
				if (ed.theme.onResolveName) {
					ed.theme.onResolveName.add(function(th, o) {
						if (o.node.nodeName == 'IMG') {
                            if ( ed.dom.hasClass(o.node, 'mceNextPage') )
                                o.name = 'nextpage';
                            if ( ed.dom.hasClass(o.node, 'mcePageTitle') )
                                o.name = 'pagetitle';
                        }
							
					});
				}
			});
			
//			ed.onClick.add(function(ed, e) {
//				e = e.target;
				
//				if(e.nodeName === 'IMG' && ed.dom.hasClass(e, 'mceNextPage'))
//					ed.selection.select(e);
					
//				if (e.nodeName === 'IMG' && ed.dom.hasClass(e, 'mcePageTitle'))
//					ed.selection.select(e);
//			});

			ed.onNodeChange.add(function(ed, cm, n) {
				cm.setActive('nextpage', n.nodeName === 'IMG' && ed.dom.hasClass(n, 'mceNextPage'));
				cm.setActive('pagetitle', n.nodeName == 'IMG' && ed.dom.hasClass(n, 'mcePageTitle'));
			});
			
			var pageHTML = '<img src="' + url + '/img/trans.gif" title="Page Title : ';
			var pageHTML2 = '" class="mcePageTitle mceItemNoResize" />';
			
			ed.onBeforeSetContent.add(function(ed, o) {
				o.content = o.content.replace(/<!--nextpage-->/g, pb);
				o.content = o.content.replace(/<!--pagetitle:([^>]*)-->/g, pageHTML + '$1' + pageHTML2);

			});			

			// Replace images with quicktags
			ed.onPostProcess.add(function(ed, o) {
				if (o.get)
					o.content = o.content.replace(/<img[^>]+>/g, function(im) {
																		  
						if (im.indexOf('class="mcePageTitle') !== -1) {
                            var m;
                            var titletext = (m = im.match(/title="Page Title : (.*?)"/)) ? m[1] : '';

                            im = '<!--pagetitle:'+titletext+'-->';
                        }

						if (im.indexOf('class="mceNextPage') !== -1 )
							im = '<!--nextpage-->';
							
                        return im;
					});
			});


		},

		getInfo : function() {
			return {
				longname : 'Multipage Buttons',
				author : 'Tarkan Akdam',
				authorurl : 'http://www.tarkan.info',
				infourl : 'http://www.tarkan.info',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('multipagebuttons', tinymce.plugins.MultipageButtons);
})();