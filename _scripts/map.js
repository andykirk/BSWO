//Leaflet-SVGIcon
//SVG icon for any marker class
//Ilya Atkin
//ilya.atkin@unh.edu

L.DivIcon.SVGIcon = L.DivIcon.extend({
    options: {
        "circleText": "",
        "className": "svg-icon",
        "circleAnchor": null, //defaults to [iconSize.x/2, iconSize.x/2]
        "circleColor": null, //defaults to color
        "circleOpacity": null, // defaults to opacity
        "circleFillColor": "rgb(255,255,255)",
        "circleFillOpacity": null, //default to opacity 
        "circleRatio": 0.5,
        "circleWeight": null, //defaults to weight
        "color": "rgb(0,102,255)",
        "fillColor": null, // defaults to color
        "fillOpacity": 0.4,
        "fontColor": "rgb(0, 0, 0)",
        "fontOpacity": "1",
        "fontSize": null, // defaults to iconSize.x/4
        "iconAnchor": null, //defaults to [iconSize.x/2, iconSize.y] (point tip)
        "iconSize": L.point(32,48),
        "opacity": 1,
        "popupAnchor": null,
        "weight": 2
    },
    initialize: function(options) {
        options = L.Util.setOptions(this, options)
        
        //iconSize needs to be converted to a Point object if it is not passed as one
        options.iconSize = L.point(options.iconSize)

        //in addition to setting option dependant defaults, Point-based options are converted to Point objects
        if (!options.circleAnchor) {
            options.circleAnchor = L.point(Number(options.iconSize.x)/2, Number(options.iconSize.x)/2)
        }
        else {
            options.circleAnchor = L.point(options.circleAnchor)
        }
        if (!options.circleColor) {
            options.circleColor = options.color
        }
        if (!options.circleFillOpacity) {
            options.circleFillOpacity = options.opacity
        }
        if (!options.circleOpacity) {
            options.circleOpacity = options.opacity
        }
        if (!options.circleWeight) {
            options.circleWeight = options.weight
        }
        if (!options.fillColor) { 
            options.fillColor = options.color
        }
        if (!options.fontSize) {
            options.fontSize = Number(options.iconSize.x/4) 
        }
        if (!options.iconAnchor) {
            options.iconAnchor = L.point(Number(options.iconSize.x)/2, Number(options.iconSize.y))
        }
        else {
            options.iconAnchor = L.point(options.iconAnchor)
        }
        if (!options.popupAnchor) {
            options.popupAnchor = L.point(0, (-0.75)*(options.iconSize.y))
        }
        else {
            options.popupAnchor = L.point(options.popupAnchor)
        }

        var path = this._createPath()
        var circle = this._createCircle()

        options.html = this._createSVG()
    },
    _createCircle: function() {
        var cx = Number(this.options.circleAnchor.x)
        var cy = Number(this.options.circleAnchor.y)
        var radius = this.options.iconSize.x/2 * Number(this.options.circleRatio)
        var fill = this.options.circleFillColor
        var fillOpacity = this.options.circleFillOpacity
        var stroke = this.options.circleColor
        var strokeOpacity = this.options.circleOpacity
        var strokeWidth = this.options.circleWeight
        var className = this.options.className + "-circle"        
       
        var circle = '<circle class="' + className + '" cx="' + cx + '" cy="' + cy + '" r="' + radius +
            '" fill="' + fill + '" fill-opacity="'+ fillOpacity + 
            '" stroke="' + stroke + '" stroke-opacity=' + strokeOpacity + '" stroke-width="' + strokeWidth + '"/>'
        
        return circle
    },
    _createPathDescription: function() {
        var height = Number(this.options.iconSize.y)
        var width = Number(this.options.iconSize.x)
        var weight = Number(this.options.weight)
        var margin = weight / 2

        var startPoint = "M " + margin + " " + (width/2) + " "
        var leftLine = "L " + (width/2) + " " + (height - weight) + " "
        var rightLine = "L " + (width - margin) + " " + (width/2) + " "
        var arc = "A " + (width/4) + " " + (width/4) + " 0 0 0 " + margin + " " + (width/2) + " Z"

        var d = startPoint + leftLine + rightLine + arc

        return d
    },
    _createPath: function() {
        var pathDescription = this._createPathDescription()
        var strokeWidth = this.options.weight
        var stroke = this.options.color
        var strokeOpacity = this.options.Opacity
        var fill = this.options.fillColor
        var fillOpacity = this.options.fillOpacity
        var className = this.options.className + "-path"

        var path = '<path class="' + className + '" d="' + pathDescription +
            '" stroke-width="' + strokeWidth + '" stroke="' + stroke + '" stroke-opacity="' + strokeOpacity +
            '" fill="' + fill + '" fill-opacity="' + fillOpacity + '"/>'

        return path
    },
    _createSVG: function() {
        var path = this._createPath()
        var circle = this._createCircle()
        var text = this._createText()
        var className = this.options.className + "-svg"

        var style = "width:" + this.options.iconSize.x + "; height:" + this.options.iconSize.y + ";"

        var svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="' + className + '" style="' + style + '">' + path + circle + text + '</svg>'

        return svg
    },
    _createText: function() {
        var fontSize = this.options.fontSize + "px"
        var lineHeight = Number(this.options.fontSize)

        var x = Number(this.options.iconSize.x) / 2
        var y = x + (lineHeight * 0.35) //35% was found experimentally 
        var circleText = this.options.circleText
        var textColor = this.options.fontColor.replace("rgb(", "rgba(").replace(")", "," + this.options.fontOpacity + ")")

        var text = '<text text-anchor="middle" x="' + x + '" y="' + y + '" style="font-size: ' + fontSize + '" fill="' + textColor + '">' + circleText + '</text>'

        return text
    }
})

L.divIcon.svgIcon = function(options) {
    return new L.DivIcon.SVGIcon(options)
}

L.Marker.SVGMarker = L.Marker.extend({
    options: {
        "iconFactory": L.divIcon.svgIcon,
        "iconOptions": {}
    },
    initialize: function(latlng, options) {
        options = L.Util.setOptions(this, options)
        options.icon = options.iconFactory(options.iconOptions)
        this._latlng = latlng
    },
    onAdd: function(map) {
        L.Marker.prototype.onAdd.call(this, map)
    },
    setStyle: function(style) {
        if (this._icon) {
            var svg = this._icon.children[0]
            var iconBody = this._icon.children[0].children[0]
            var iconCircle = this._icon.children[0].children[1]

            if (style.color && !style.iconOptions) {
                var stroke = style.color.replace("rgb","rgba").replace(")", ","+this.options.icon.options.opacity+")")
                var fill = style.color.replace("rgb","rgba").replace(")", ","+this.options.icon.options.fillOpacity+")")
                iconBody.setAttribute("stroke", stroke)
                iconBody.setAttribute("fill", fill)
                iconCircle.setAttribute("stroke", stroke)

                this.options.icon.fillColor = fill
                this.options.icon.color = stroke
                this.options.icon.circleColor = stroke
            }
            if (style.opacity) {
                this.setOpacity(style.opacity)
            }
            if (style.iconOptions) {
                if (style.color) { style.iconOptions.color = style.color }
                var iconOptions = L.Util.setOptions(this.options.icon, style.iconOptions)
                this.setIcon(L.divIcon.svgIcon(iconOptions))
            }
        }
    }
})

L.marker.svgMarker = function(latlng, options) {
    return new L.Marker.SVGMarker(latlng, options)
};

(function () {

L.Control.FullScreen = L.Control.extend({
    options: {
        position: 'topleft',
        title: 'Full Screen',
        titleCancel: 'Exit Full Screen',
        forceSeparateButton: false,
        forcePseudoFullscreen: false,
        fullscreenElement: false
    },
    
    onAdd: function (map) {
        var className = 'leaflet-control-zoom-fullscreen', container, content = '';
        
        if (map.zoomControl && !this.options.forceSeparateButton) {
            container = map.zoomControl._container;
        } else {
            container = L.DomUtil.create('div', 'leaflet-bar');
        }
        
        if (this.options.content) {
            content = this.options.content;
        } else {
            className += ' fullscreen-icon';
        }

        this._createButton(this.options.title, className, content, container, this.toggleFullScreen, this);

        this._map.on('enterFullscreen exitFullscreen', this._toggleTitle, this);

        return container;
    },
    
    _createButton: function (title, className, content, container, fn, context) {
        this.link = L.DomUtil.create('a', className, container);
        this.link.href = '#';
        this.link.title = title;
        this.link.innerHTML = content;

        L.DomEvent
            .addListener(this.link, 'click', L.DomEvent.stopPropagation)
            .addListener(this.link, 'click', L.DomEvent.preventDefault)
            .addListener(this.link, 'click', fn, context);
        
        L.DomEvent
            .addListener(container, fullScreenApi.fullScreenEventName, L.DomEvent.stopPropagation)
            .addListener(container, fullScreenApi.fullScreenEventName, L.DomEvent.preventDefault)
            .addListener(container, fullScreenApi.fullScreenEventName, this._handleFullscreenChange, context);
        
        L.DomEvent
            .addListener(document, fullScreenApi.fullScreenEventName, L.DomEvent.stopPropagation)
            .addListener(document, fullScreenApi.fullScreenEventName, L.DomEvent.preventDefault)
            .addListener(document, fullScreenApi.fullScreenEventName, this._handleFullscreenChange, context);

        return this.link;
    },
    
    toggleFullScreen: function () {
        var map = this._map;
        map._exitFired = false;
        if (map._isFullscreen) {
            if (fullScreenApi.supportsFullScreen && !this.options.forcePseudoFullscreen) {
                fullScreenApi.cancelFullScreen();
            } else {
                L.DomUtil.removeClass(this.options.fullscreenElement ? this.options.fullscreenElement : map._container, 'leaflet-pseudo-fullscreen');
            }
            map.fire('exitFullscreen');
            map._exitFired = true;
            map._isFullscreen = false;
        }
        else {
            if (fullScreenApi.supportsFullScreen && !this.options.forcePseudoFullscreen) {
                fullScreenApi.requestFullScreen(this.options.fullscreenElement ? this.options.fullscreenElement : map._container);
            } else {
                L.DomUtil.addClass(this.options.fullscreenElement ? this.options.fullscreenElement : map._container, 'leaflet-pseudo-fullscreen');
            }
            map.fire('enterFullscreen');
            map._isFullscreen = true;
        }
    },
    
    _toggleTitle: function () {
        this.link.title = this._map._isFullscreen ? this.options.title : this.options.titleCancel;
    },
    
    _handleFullscreenChange: function () {
        var map = this._map;
        map.invalidateSize();
        if (!fullScreenApi.isFullScreen() && !map._exitFired) {
            map.fire('exitFullscreen');
            map._exitFired = true;
            map._isFullscreen = false;
        }
    }
});

L.Map.addInitHook(function () {
    if (this.options.fullscreenControl) {
        this.fullscreenControl = L.control.fullscreen(this.options.fullscreenControlOptions);
        this.addControl(this.fullscreenControl);
    }
});

L.control.fullscreen = function (options) {
    return new L.Control.FullScreen(options);
};

/* 
Native FullScreen JavaScript API
-------------
Assumes Mozilla naming conventions instead of W3C for now

source : http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/

*/

    var 
        fullScreenApi = { 
            supportsFullScreen: false,
            isFullScreen: function () { return false; }, 
            requestFullScreen: function () {}, 
            cancelFullScreen: function () {},
            fullScreenEventName: '',
            prefix: ''
        },
        browserPrefixes = 'webkit moz o ms khtml'.split(' ');
    
    // check for native support
    if (typeof document.exitFullscreen !== 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++) {
            fullScreenApi.prefix = browserPrefixes[i];
            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen'] !== 'undefined') {
                fullScreenApi.supportsFullScreen = true;
                break;
            }
        }
        if (typeof document['msExitFullscreen'] !== 'undefined') {
            fullScreenApi.prefix = 'ms';
            fullScreenApi.supportsFullScreen = true;
        }
    }
    
    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        if (fullScreenApi.prefix === 'ms') {
            fullScreenApi.fullScreenEventName = 'MSFullscreenChange';
        } else {
            fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
        }
        fullScreenApi.isFullScreen = function () {
            switch (this.prefix) {
                case '':
                    return document.fullscreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                case 'ms':
                    return document.msFullscreenElement;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        };
        fullScreenApi.requestFullScreen = function (el) {
            switch (this.prefix) {
                case '':
                    return el.requestFullscreen();
                case 'ms':
                    return el.msRequestFullscreen();
                default:
                    return el[this.prefix + 'RequestFullScreen']();
            }
        };
        fullScreenApi.cancelFullScreen = function () {
            switch (this.prefix) {
                case '':
                    return document.exitFullscreen();
                case 'ms':
                    return document.msExitFullscreen();
                default:
                    return document[this.prefix + 'CancelFullScreen']();
            }
        };
    }

    // jQuery plugin
    if (typeof jQuery !== 'undefined') {
        jQuery.fn.requestFullScreen = function () {
            return this.each(function () {
                var el = jQuery(this);
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.requestFullScreen(el);
                }
            });
        };
    }

    // export api
    window.fullScreenApi = fullScreenApi;
})();
function leafletMapInitialize(map_container_id, map_data, markers) {
    // @TODO: should check for SVG support before proceeding.
    markers = markers ? markers : null;


    var map_js_classname = 'js-map';

    //console.log(map_data);
    //console.log(markers);

    var $mapEl = document.getElementById(map_container_id);
    var map_id = map_container_id + '__map';
    
    var default_icon_colour = 'red';
    var icon_colours = {
        'red':    'rgb(253,117,103)',
        'orange': 'rgb(255,153,0)',
        'yellow': 'rgb(253,245,105)',
        'green':  'rgb(0,230,77)',
        'blue':   'rgb(105,145,253)',
        'purple': 'rgb(142,103,253)',
        'pink':   'rgb(230,97,172)'
    };

    var html_el = document.querySelector('html');
    console.log(html_el);

    // Add the JS class name ...
    if (html_el.classList) {
        html_el.classList.add(map_js_classname);
    } else {
        html_el.className += ' ' + map_js_classname;
    }

    $mapEl.innerHTML = '';

    var map_div = document.createElement('div');
    map_div.id = map_id;
    $mapEl.appendChild(map_div);// ($('<div id="' + map_id + '" class="' + classes + '" />'));

    var map = L.map(map_id, {
        center: [map_data.lat, map_data.lng],
        minZoom: 2,
        zoom: map_data.zoom,
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    });

    // Mapbox tiles (https://www.mapbox.com/)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: map_data.token
    }).addTo(map);

    if (markers) {
        markers.forEach(function(marker, i) {
            if (marker.lat == 'true') {
                marker.lat = map_data.lat;
            }

            if (marker.lng == 'true') {
                marker.lng = map_data.lng;
            }

            var icon_colour = (marker.color == '') ? default_icon_colour : marker.color;
            var svg_marker = new L.Marker.SVGMarker([marker.lat, marker.lng], {
                iconOptions: {
                    fillOpacity: 1,
                    iconSize: [21,32],
                    circleFillColor: 'rgb(0,0,0)',
                    circleWeight: 0,
                    circleRatio: 0.15,
                    weight: 1.5,
                    color: 'rgb(0,0,0)',
                    fillColor: icon_colours[icon_colour]
                }
            });

            if (typeof marker.popup == 'string') {
                // Individual marker popup content;
                svg_marker.bindPopup(marker.popup);
            }/* else if (typeof map_data.popuptemplate == 'string') {
                // Global popup template present, check there's data:
                if (typeof marker.popupdata == 'object') {
                    //console.log( marker_data.popupdata );

                    // Render the template:
                    template = twig({
                        data: map_data.popuptemplate
                    });
                    svg_marker.bindPopup(template.render(marker.popupdata));
                }
            }*/

            svg_marker.addTo(map);
        });
    }

    // For some reason if the map is in a left pane, the centering isn't correct until a resize
    // event is fired. I can't figure out why, so I'm just firing the event manually for now:
    //window.dispatchEvent(new Event('resize'));
    if (typeof (Event) === 'function') {
        // modern browsers
        window.dispatchEvent(new Event('resize'));
    } else {
        //This will be executed on old browsers and especially IE
        var resizeEvent = window.document.createEvent('UIEvents');
        resizeEvent.initUIEvent('resize', true, false, window, 0);
        window.dispatchEvent(resizeEvent);
    }

    return;
}
