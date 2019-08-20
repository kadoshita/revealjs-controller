import Peer from 'skyway-js';

interface Window {
    RevealJSController: any;
}
declare var window: Window;

class RevealJSController {
    private peer: Peer;
    private dataConnection: any;
    private isMaster: boolean = false;
    constructor(skywayKey: string, Reveal: any) {
        let params: { [key: string]: string } = {};
        if (location.search !== '') {
            params = this.parseQueryParameter(location.search.split('?')[1]);
        }
        if (params.mode === 'master') {
            this.isMaster = true;
        } else {
            Reveal.configure({ controls: false });
        }

        this.peer = new Peer({
            key: skywayKey,
            debug: 2
        });
        this.peer.on('open', peerId => {
            console.log(`my peer id : ${peerId}`);
            if (!this.isMaster) {
                this.dataConnection = this.peer.connect(params.peerId);
                this.dataConnection.on('data', (data: any) => {
                    Reveal.slide(data.indexh, data.indexv);
                });
            } else {
                let viewerLink: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById('viewer-link');
                viewerLink.href = `${location.href.split('?')[0]}?peerId=${peerId}`;
            }
        });
        this.peer.on('connection', dc => {
            this.dataConnection = dc;
        });

        Reveal.addEventListener("slidechanged", (event: any) => {
            if (this.isMaster) {
                this.dataConnection.send({
                    indexh: event.indexh,
                    indexv: event.indexv
                });
            }
        });
    }

    private parseQueryParameter(query: string): { [key: string]: string } {
        if (query === '') {
            return {};
        }
        let params: Array<string> = query.split('&');
        let paramObject: { [key: string]: string } = {};
        params.forEach(p => {
            let key = p.split('=')[0];
            let value = p.split('=')[1];
            paramObject[key] = value;
        });

        return paramObject;
    }
}

window.RevealJSController = RevealJSController;