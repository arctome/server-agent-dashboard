import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Segment } from 'semantic-ui-react'
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from 'xterm-addon-fit';
import "../styles/terminal.css"

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}
class TerminalUI {
    constructor(socket) {
        this.terminal = new Terminal({
            theme: {
                background: "#ffffff",
                foreground: "#111",
                cursor: '#333'
            },
            screenKeys: true,
            useStyle: true,
            cursorBlink: true,
        });
        this.fitAddon = new FitAddon();
        this.socket = socket;
        this.aliveKeeper = null;
        this.inited = false;
    }

    /**
     * Attach event listeners for terminal UI and customized websocket client
     */
    startListening(preHandler) {
        if (!this.inited) {
            if (typeof preHandler === 'function') preHandler && preHandler()
            this.inited = true;
        }
        this.terminal.onData(data => {
            this.sendInput(data)
        });

        // this.terminal.onResize(function (evt) {
        //     this.socket.send(new TextEncoder().encode("\x01" + JSON.stringify({ cols: evt.cols, rows: evt.rows })))
        // });
    }

    stopListening() {
        console.log('running stop listening')
        this.socket.close();
        this.terminal.dispose();
    }

    /**
     * Send custom ping signal to keep-alive.
     */
    keepAlive(time) {
        if (!time) time = 30 * 1000;
        this.aliveKeeper = setInterval(() => {
            console.log("running alive keeper")
            this.socket.send("__AGENT_SIGNAL_PING__")
        }, time)
    }

    /**
     * Print something to terminal UI.
     */
    write(text) {
        this.terminal.write(text);
    }

    /**
     * Utility function to print new line on terminal.
     */
    prompt() {
        this.terminal.write(`\r\n$ `);
    }

    /**
     * Send whatever you type in Terminal UI to PTY process in server.
     * @param {*} input Input to send to server
     */
    sendInput(input) {
        // this.socket.send(new TextEncoder().encode("\x00" + input));
        this.socket.send(input)
    }

    /**
     *
     * @param {HTMLElement} container HTMLElement where xterm can attach terminal ui instance.
     */
    attachTo(container) {
        this.terminal.loadAddon(this.fitAddon);
        this.terminal.open(container);
        this.fitAddon.fit()
        // Default text to display on terminal.
        this.terminal.write("[Server Agent] Monitor's Terminal Connected. \r\n");
    }

    clear() {
        if (this.aliveKeeper) clearInterval(this.aliveKeeper);
        this.terminal.clear();
    }
}

function getTerminalWSEndpoint() {
    let ws_protocol = 'wss'
    if(window.location.protocol === "http:") ws_protocol = 'ws';
    let ws_host = window.location.host
    return ws_protocol + ":" + ws_host;
}

export default function PageTerminal() {
    const [searchParams, setSearchParams] = useSearchParams();
    let host = searchParams.get('host');
    let port = searchParams.get('port');
    let user = searchParams.get('user') || "root";
    let socket, term;

    useEffect(() => {
        const token = window.localStorage.getItem("Server-Agent-Token")
        if (!token) {
            alert("No token detected!")
        }

        const container = document.getElementById("terminal");
        socket = new WebSocket(getTerminalWSEndpoint() + `/socket/terminal?token=${token}`);
        socket.binaryType = "arraybuffer";
        socket.onopen = function () {
            term = new TerminalUI(socket);
            term.attachTo(container);
            term.prompt();
            term.startListening(() => {
                term.sendInput(`ssh -p ${port} ${user}@${host}\r\n`)
            });
            term.keepAlive(10000);
        }
        socket.onclose = function () {
            term.clear()
        }
        socket.onmessage = e => {
            if (e.data instanceof ArrayBuffer) {
                term.write(ab2str(e.data));
            } else {
                switch (e.data) {
                    case "__AGENT_SIGNAL_CLOSE__": {
                        socket.close()
                        return;
                    }
                    case "__AGENT_SIGNAL_PONG__": {
                        return;
                    }
                    case "__AGENT_SIGNAL_PING__": {
                        return;
                    }
                    default: {
                        alert(e.data);
                    }
                }
            }
        }
    }, [])

    return (
        <main className="page-terminal">
            <Segment style={{width: "80%", margin: "10px auto"}}>
                <div id="terminal"></div>
            </Segment>
        </main>
    )
}