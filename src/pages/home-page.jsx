import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ComStatusCard from '../components/status-card'
import { useNavigate } from 'react-router-dom'

dayjs.extend(relativeTime)

export default function PageHome() {
    const [servers, setServers] = useState([])
    let navigate = useNavigate();

    function loadServerList() {
        const trustToken = window.localStorage.getItem("Server-Agent-Token");
        if (!trustToken) {
            navigate("/login")
        }
        return fetch("/api/list", {
            method: "GET",
            headers: {
                'Server-Agent-Token': trustToken
            },
            redirect: "follow"
        }).then(res => {
            if (res.ok && res.status === 200) return res.json()
        })
    }
    function getAgentUrl(server) {
        if (server.UseProxy) return 'wss://' + window.location.host
        return (server.EnableSSL ? 'wss' : 'ws') + '://' + server.Host + (server.EnableSSL && server.Port === '443' ? "" : ":" + server.Port)
    }
    function getAgentPath(server, token) {
        return server.UseProxy ? '/socket/proxy?host=' + server.Host + '&port=' + server.Port + '&token=' + token : '/socket/server?token=' + token
    }
    function establishWSConnection(server) {
        let socket = new WebSocket(getAgentUrl(server) + getAgentPath(server, window.localStorage.getItem("Server-Agent-Token")));
        server.socket = socket;
        server.socket.onopen = function () {
            server.socket.send("info")
            server.state = {}
        }
        server.socket.onmessage = function (event) {
            // ignore sent data
            if (event.data === 'info' || event.data === 'state' || event.data === 'ping') return;
            let data;
            try {
                data = JSON.parse(event.data)
            } catch (e) {
                console.log("Failed to parse websocket data:");
                console.log(event.data);
                throw e;
            }
            switch (data.MessageType) {
                case "info": {
                    server._info = data;
                    server.__UPDATE_TIMER__ = setInterval(() => {
                        server.socket.send("state");
                    }, 10000)
                    break;
                }
                case "state": {
                    server._proxy_state.state = data;
                    break;
                }
                case "pong": {
                    console.log("keeping connection...")
                    break;
                }
                default: {
                    console.warn("Unrecognized message type:")
                    console.log(event.data)
                }
            }
        }
        server.socket.onclose = function () {
            console.log("connection lost.");
            disconnectWSConnections();
        }
        return server;
    }
    function disconnectWSConnections() {
        if (
            servers.length < 1
        ) return;
        servers.forEach(server => {
            if (server.__UPDATE_TIMER__) clearInterval(server.__UPDATE_TIMER__);
            server.socket && server.socket.close && server.socket.close();
        })
    }

    useEffect(async () => {
        let data = await loadServerList().catch(e => { console.log(e) });
        let _servers = data.map(server => establishWSConnection(server))
        console.log(_servers)
        setServers(_servers)

        // Clean function
        return function () {
            disconnectWSConnections()
        }
    }, [])

    return (
        <main className="page-home">
            <div className="server-list">
                {
                    servers.map(server => {
                        return <ComStatusCard server={server} key={server.Host} />
                    })
                }
            </div>
        </main>
    )
}