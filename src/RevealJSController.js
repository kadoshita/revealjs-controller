"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var skyway_js_1 = __importDefault(require("skyway-js"));
var RevealJSController = /** @class */ (function () {
    function RevealJSController(skywayKey, Reveal) {
        var _this = this;
        this.isMaster = false;
        var params = {};
        if (location.search !== '') {
            params = this.parseQueryParameter(location.search.split('?')[1]);
        }
        if (params.mode === 'master') {
            this.isMaster = true;
        }
        else {
            Reveal.configure({ controls: false });
        }
        this.peer = new skyway_js_1.default({
            key: skywayKey,
            debug: 2
        });
        this.peer.on('open', function (peerId) {
            console.log("my peer id : " + peerId);
            if (!_this.isMaster) {
                _this.dataConnection = _this.peer.connect(params.peerId, {
                    dcInit: {
                        ordered: false
                    }
                });
                console.log(_this.dataConnection.dcInit);
                _this.dataConnection.on('data', function (data) {
                    Reveal.slide(data.indexh, data.indexv);
                });
            }
            else {
                var viewerLink = document.getElementById('viewer-link');
                viewerLink.href = location.protocol + "//" + location.host + "?peerId=" + peerId;
            }
        });
        this.peer.on('connection', function (dc) {
            console.log(dc.dcInit);
            _this.dataConnection = dc;
        });
        Reveal.addEventListener("slidechanged", function (event) {
            if (_this.isMaster) {
                _this.dataConnection.send({
                    indexh: event.indexh,
                    indexv: event.indexv
                });
            }
        });
    }
    RevealJSController.prototype.parseQueryParameter = function (query) {
        if (query === '') {
            return {};
        }
        var params = query.split('&');
        var paramObject = {};
        params.forEach(function (p) {
            var key = p.split('=')[0];
            var value = p.split('=')[1];
            paramObject[key] = value;
        });
        return paramObject;
    };
    return RevealJSController;
}());
window.RevealJSController = RevealJSController;
//# sourceMappingURL=RevealJSController.js.map