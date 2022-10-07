const WebSocket = require('ws');
const { EventEmitter } = require('events')

module.exports = class extends EventEmitter {
    constructor(config) {
        super()
        if(!config || !config.origin || !config.token || !config.socket) throw 'Wrapdactyl - The origin, token and socket must be present'
        this.origin = config.origin
        this.token = config.token
        this.socket = config.socket
    }

    connect = async () => {
        if(this.ws) this.close()

        this.ws = new WebSocket(this.socket, {
            origin: this.origin
        });

        this.ws.on('open', () => {
            this.ws.send(JSON.stringify({"event":"auth","args":[this.token]}));
        })

        this.ws.on('close', () => {
            this.close()
        })

        this.ws.on('error', () => {
            this.close()
        })

        this.ws.on('message', (data) => {
            let message = JSON.parse(data.toString())
            if(message.event === 'auth success') {
                this.ready = true;
                this.emit('connected');
            }
            else if(message.event === "status") {
                this.emit('status', message.args[0])
            }
            else if(message.event === 'stats') {
                message.args = message.args.map(x => JSON.parse(x))
                this.emit('stats', message.args[0]);
            }
            else if(message.event === 'console output') {
                message.args = message.args.map(x => x.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''))
                this.emit('console', message.args[0])
            } else if(message.event === 'token expired') {
                this.emit('expired');
            }
        });
    }
    
    send = (command) => {
        command = command?.toString()
        if(!command.length) return 'Command is invalid'
        if(!this.ws || !this.ready) return 'Connection not ready'
        this.ws.send(JSON.stringify({"event":"send command","args":[command]}))
        return true
    }

    power = (power) => {
        if(!['start', 'stop', 'restart', 'kill'].includes(power?.toLowerCase())) throw 'invalid power state... start/stop/restart/kill'
        if(!this.ws || !this.ready) return 'Connection not ready'
        this.ws.send(JSON.stringify({"event":"set state","args":[power.toLowerCase()]}))
        return true
    }

    close = () => {
        this.ws.close();
        this.ready=false
        this.ws=undefined;
        this.emit("disconnected");
    }
}