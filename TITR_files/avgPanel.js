'use strict';

$(document).ready(function(){

console.log('hello');
	
	var avgPanel = new AvgPanel('TeamVerif');
	// console.log(avgPanel.columns);

});


class AvgPanel {
	constructor(panelType, columns) {
		this.panelType = panelType;

		this.columns = function() {

			var columns = [];
			$('table.normal').first().find('th').each(function(index) {
				if (index == 0) return true;
				columns.push($(this).html());
			});

			return columns;

		}();

		this.colors = ['#0AAB7F', '#4675AE', '#FFBE58', '#D04B00'];
		this.icons = ['user', 'home', 'asterisk', 'phone-alt'];

		this.body = this.create_htmml_body();
		this.currentPanel = {};
		this.avg_Panels = [];

		this.options_on_plus();
	}

	create_htmml_body() {
		var body = $('<div class="Avg_Panel"><h4>Avg Panel</h4><div><p id="add_panel_button">+</p><div></div>');
		$('div.data').append(body);

		return body;
	}

	options_on_plus() {
		this.body.on('click', '#add_panel_button', $.proxy(function() {

			if (this.body.find('div.options').length > 0) {

				this.body.children('div').show(500);
				// $('div.Avg_Panel > div:nth-child(3)').addClass('panel_buttons_show');

				console.log('New panel');
				this.init_preview_panel();

				this.body.find('input').val('');

			} else {

				// this.body.children('div').hide(500);
				
				this.body.append(
					$('<div>\
						<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>\
					  <div>')
					.on('click', $.proxy(this.apply_panels, this)).hide()
				);

				this.body.append(
					$('<div>\
						<span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>\
					  <div>')
					.on('click', $.proxy(this.save_color_range, this)).hide()
				);

				var options = $('<div class="options"><h5>Options</h5></div>');
				this.render_columns(options);
				this.render_color_range(options);
				this.render_incons(options);
				this.body.append(options.hide());
				this.body.children('div').show(500);

				this.init_preview_panel();
				
			}

		}, this));
	}

	addPreview_currentPanel() {
		this.currentPanel.on('keyup click', {currentPanel : this.currentPanel}, $.proxy(function(event) {

			if (event.type == 'click') {
				this.currentPanel = event.data.currentPanel;

				this.body.find('div.build_panel').css('box-shadow', 'none');
				this.currentPanel.css('box-shadow', '0px 1px 4px 0px rgba(0,0,0,0.5)');

				this.updateColorRange(this.body, this.currentPanel.color_range);

			}

			let value = Number(event.data.currentPanel.find('input').val());

			for (let color in event.data.currentPanel.color_range) {
				if ((event.data.currentPanel.color_range[color].down <= value) && (event.data.currentPanel.color_range[color].up >= value)) {
					event.data.currentPanel.css('background-color', color);
					break;
				} else {
					event.data.currentPanel.css('background-color', '#D2D7D9');
				}
			}

		}, this));
	}

	init_preview_panel() {
		this.body.find('div.build_panel').css('box-shadow', 'none');
		this.currentPanel = $(
			'<div class="build_panel">\
				<div><span class="glyphicon" aria-hidden="true"></span></div>\
				<input></input>\
				<p></p>\
				<h3> X </h3>\
			</div>'
		);

		this.currentPanel.color_range = {};
		this.currentPanel.css('background-color', '#D2D7D9');
		this.currentPanel.find('span').addClass('glyphicon-asterisk');

		this.currentPanel.find('h3').on('click', {currentPanel : this.currentPanel} , $.proxy(function(event) {
			
			for (let i = 0;  i < this.avg_Panels.length; i++) {
				if (event.data.currentPanel === this.avg_Panels[i]) {
					console.log('panel removed');

					this.avg_Panels.splice(i, 1);
					$('div.names').each(function(index, el) {
						$(el).find('div.build_panel').eq(i).hide(200);
						setTimeout(function() { $(el).find('div.build_panel').eq(i).remove() }, 500);
					}); 

				}
			}
			event.data.currentPanel.removeClass('show_nice');
			setTimeout(function(){event.data.currentPanel.remove()}, 700);

		}, this));

		this.addPreview_currentPanel();
		this.body.append(this.currentPanel);
		setTimeout(function(){$('div.build_panel').addClass('show_nice')}, 300); 
		this.avg_Panels.push(this.currentPanel);
	}

	render_columns (options) {
		var columns_body = $('<div class="columns"><p>Columns</p></div>');
		
		for (var colum of this.columns) {
			var current_col = $('<p>' + colum + '</p>').on('click', $.proxy(function(event) {
				
				
				let currentPanel_p = this.currentPanel.find('p');
				currentPanel_p.addClass('update');

				setTimeout(	
					function() {
						currentPanel_p.text($(event.delegateTarget).text());
						currentPanel_p.removeClass('update');
					}
				, 400);
				
		
			}, this));

			columns_body.append(current_col);
		}
		
		options.append(columns_body);
	}

	render_incons (options) {
		var icons_body = $('<div class="icons"><p>Incons</p></div>');

		for (var icon of this.icons) {
			var current_icon = $('<div><span class="glyphicon" aria-hidden="true"></span></div>');
			current_icon.find('span').addClass('glyphicon-' + icon);
			current_icon.on('click', 'span', $.proxy(function(event) {
				
				let currentPanel = this.currentPanel;
				currentPanel.find('span').css('background-color', 'white');
				setTimeout(	
					function() {
						currentPanel.find('span').removeClass().addClass($(event.delegateTarget).find('span').attr("class"));
						currentPanel.find('span').css('background-color', '#5E82B2');
					}
				, 400);
			
			}, this));

			// current_icon.wrap('<div></div>')
			icons_body.append(current_icon);
		}

		options.append(icons_body);
	}

	render_color_range (options) {
		var color_range = $('<div class="color_range"><p>Color Ranges</p></div>');

		for (let color of this.colors) {
			var current_color = $(`<input color="${color}" style="border-color: ${color}"></input>`);
			current_color.on('keyup', $.proxy(function(event) {

				let current_input = $(event.delegateTarget);

				let match;
				if (match = /^([\d\.]+)-([\d\.]+)$/.exec(current_input.val())) {
					
					console.log("ok can save range")
					this.currentPanel.color_range[color] = { down: Number(match[1]) , up : Number(match[2])};
				}

			}, this));

			color_range.append(current_color);
		}

		options.append(color_range);
	}

	updateColorRange(body, color_range) {

		if (Object.keys(color_range).length > 0) {
			body.find('div.color_range input').each(function(index, el) {

				if (color_range[$(el).attr('color')]) {

					$(el).addClass('update');
					setTimeout(function() {
						$(el).val(color_range[$(el).attr('color')].down + '-' + color_range[$(el).attr('color')].up);
						$(el).removeClass('update');
					}, 500);

				} else {
					$(el).addClass('update');
					setTimeout(function() {
						$(el).val('');
						$(el).removeClass('update');
					}, 500);
				}
			
			});
		} else {
			body.find('div.color_range input').each(function(index, el) {

				if ($(el).val()) {
					$(el).addClass('update');
					setTimeout(function() {
						$(el).val('');
						$(el).removeClass('update');
					}, 500);
				}

			});

		}

		

		
	}

	apply_panels(event) {

		let panels = this.avg_Panels;
		$('div.names').each(function(index, el) {
			if (index === 0) return true;

			for (let i = 0; i < panels.length; i++) {

				let column = panels[i].find('p').text();
				let avg_value_index;
				$(el).find('th').each(function(index, el) {
					if ($(el).text() == column) {
						avg_value_index = index;
						return false;
					}
				});
				let avg_value = Number($(el).find( "td:contains('TOTAL_Avg')" ).parent().find('td').eq(avg_value_index).text());
				let color = get_color(panels[i].color_range, avg_value);

				let panel_on_table = $(el).find('div.build_panel').eq(i);
				if (panel_on_table.length > 0) {
					
					let span_class = panels[i].find('span').attr('class');
					panel_on_table.find('span').attr('class', span_class);

					panel_on_table.css('background-color', color);
					panel_on_table.find('p').eq(0).text(column);
					panel_on_table.find('p').eq(1).text(avg_value);

				} else {

					panel_on_table = panels[i].clone();
					panel_on_table.find('input').remove();
					panel_on_table.find('h3').remove();
					panel_on_table.append('<p>' + avg_value + '</p>');
					panel_on_table.css('background-color', color);

					$(el).find('h4').append(panel_on_table);
					setTimeout(function() { panel_on_table.css('opacity', '1') }, 200);
				}

			}

		});


		function get_color (color_range, val) {

			for (let color in color_range) {

				if (color_range[color].up >= val && color_range[color].down <= val) return color;

			}

			return '#D2D7D9';

		}

	}

	save_color_range(event) {
		this.body.children('div').hide(500);
		this.body.children('div').eq(0).show(500);

		console.log(this.avg_Panels);

		let send_data = [];

		for (let panel of this.avg_Panels) {
			for(let color in panel.color_range) {
				send_data.push({
					tabel_type : this.panelType,
					column : panel.find('p').text(),
					color : color,
					up : panel.color_range[color].up,
					down : panel.color_range[color].down
				});
			}
		}

		console.log(send_data);

		$.ajax({
		    url: 'http://10.103.227.51:8001/type/' + this.panelType,
		    data: JSON.stringify(send_data),
		    type: "post",
		    dataType : "json"
		})
		.done(function( json ) {
		  	alert(JSON.stringify(json));
		})
		.fail(function( xhr, status, errorThrown ) {
		    // alert(errorThrown);
		});
	}

}

