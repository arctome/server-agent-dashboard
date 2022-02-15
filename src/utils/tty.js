export function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

export class TerminalUI {
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
        this.fitAddon = new window.FitAddon.FitAddon()
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