import React, { useState, useEffect } from 'react'
import { Progress, Icon, Card, Flag, Button, Placeholder } from 'semantic-ui-react'
import ComDetailModal from './detail-modal'
import PureOperatingOs from './pure--os-icon'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import '../styles/status-card.css'
import { useNavigate } from 'react-router-dom'
import PureOnlineLabel from './pure--online-label'

dayjs.extend(relativeTime)

function LoadingState() {
    return (
        <div>
            <Progress percent={0} ><p style={{textAlign: "left"}}><span><Icon name='dashboard' />CPU Load 1/5/15:</span></p></Progress>
            <Progress percent={0} ><p style={{textAlign: "left"}}><span><Icon name='microchip' />Memory:</span></p></Progress>
            <Progress percent={0} ><p style={{textAlign: "left"}}><span><Icon name='disk' />Swap:</span></p></Progress>
            <Progress percent={0} ><p style={{textAlign: "left"}}><span><Icon name='disk' />Disk</span></p></Progress>
        </div>
    )
}
function UpdatingState(props) {
    let state = props.state
    return (
        <div>
            {/* CPU */}
            <Progress progress={state.Percent.CPU > 20} percent={state.Percent.CPU}
                success={state.Percent.CPU < 50}
                warning={state.Percent.CPU >= 50 && state.Percent.CPU < 80}
                error={state.Percent.CPU >= 80}>
                <p className="justify-between-label"><span><Icon name='dashboard' />CPU Load 1/5/15:</span> <span>{state.Load.CPU.load1}/{state.Load.CPU.load5}/{state.Load.CPU.load15}</span></p>
            </Progress>
            {/* Memory */}
            <Progress percent={state.Percent.Mem} progress={state.Percent.Mem > 20}
                success={state.Percent.Mem < 50}
                warning={state.Percent.Mem >= 50 && state.Percent.Mem < 80}
                error={state.Percent.Mem >= 80}>
                <p className="justify-between-label"><span><Icon name='microchip' />Memory:</span> <span>{state.Load.Mem.Used}MB/{state.Load.Mem.Total}MB</span></p>
            </Progress>
            {/* Swap */}
            <Progress percent={state.Percent.Swap} progress={state.Percent.Swap > 20}
                success={state.Percent.Swap < 50}
                warning={state.Percent.Swap >= 50 && state.Percent.Swap < 80}
                error={state.Percent.Swap >= 80}>
                <p className="justify-between-label"><span><Icon name='disk' />Swap:</span> <span>{state.Load.Swap.Used}MB/{state.Load.Swap.Total}MB</span></p>
            </Progress>
            {/* Disk */}
            <Progress percent={state.Percent.Disk} progress={state.Percent.Disk > 20}
                success={state.Percent.Disk < 50}
                warning={state.Percent.Disk >= 50 && state.Percent.Disk < 80}
                error={state.Percent.Disk >= 80}>
                <p className="justify-between-label"><span><Icon name='disk' />Disk</span></p>
            </Progress>
        </div>
    )
}

export default function ComStatusCard(props) {
    let server = props.server;
    let timer = null;
    const [info, setInfo] = useState(server.info || {})
    const [state, setState] = useState(server.state || {})
    const [connectionFlag, setConnFlag] = useState(0) // 0: not connected, 1: connection online, 2: connection lost
    let navigate = useNavigate();

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
            setConnFlag(1)
            server.socket.send("info")
            setState({})
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
                    setInfo(data)
                    timer = setInterval(() => {
                        server.socket.send("state");
                    }, 10000)
                    break;
                }
                case "state": {
                    setState(data)
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
            setConnFlag(2)
        }
        return server;
    }

    useEffect(() => {
        establishWSConnection(server)

        return function () {
            if (timer) clearInterval(timer);
            server.socket && server.socket.close && server.socket.close();
        }
    }, [])

    return (
        <Card className="server-card">
            <Card.Content>
                {(state && state.Percent && state.Load) ? <UpdatingState state={state} /> : <LoadingState />}
            </Card.Content>
            {
                info ?
                    (
                        <Card.Header className="justify-between-label card-section-padding"><span><Flag name={server.Location} /> {server.Name}</span> <span><PureOnlineLabel code={connectionFlag} /><PureOperatingOs os={info.System ? info.System.Os : null} /></span> </Card.Header>
                    ) : ""
            }
            {
                (state && state.Host && state.Container) ?
                    (
                        <Card.Meta className="card-section-padding">
                            <div className="justify-between-label">
                                <p><Icon name='power off' /> Uptime: {dayjs(Date.now() - (state.Host.Uptime * 1000)).fromNow(true)}</p>
                                <p><Icon name='docker' /> {state.Container.filter(c => c.State === 'running').length}/{state.Container.length}</p>
                            </div>
                        </Card.Meta>
                    ) : ""
            }
            <Card.Content extra>
                <div className="justify-between-label">
                    <ComDetailModal host={server.Host} data={info} container={(state && state.Container) ? state.Container : []} />
                    <Button content='Connect...' icon='terminal' labelPosition='left' disabled={!server.EnableSSH} onClick={e => {
                        e.preventDefault();
                        navigate(`/terminal?host=${server.Host}&port=${server.SSHPort}&user=${server.SSHUser || ""}`)
                    }} />
                </div>
            </Card.Content>
        </Card>
    )
}