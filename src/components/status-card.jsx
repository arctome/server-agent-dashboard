import React, { useState, useEffect } from 'react'
import { Progress, Icon, Card, Flag } from 'semantic-ui-react'
import ComDetailModal from './detail-modal'
import PureOperatingOs from './pure--os-icon'

function LoadingState() {
    return (
        <div></div>
    )
}
function UpdatingState(state) {
    return (
        <div style={{ paddingBottom: 20 }}>
            {/* CPU */}
            <Progress progress percent={state.Percent.CPU}
                success={state.Percent.CPU < 50}
                warning={state.Percent.CPU >= 50 && state.Percent.CPU < 80}
                error={state.Percent.CPU >= 80}>
                <p className="justify-between-label"><span><Icon name='dashboard' />CPU Load 1/5/15:</span> <span>{state.Load.CPU.load1}/{state.Load.CPU.load5}/{state.Load.CPU.load15}</span></p>
            </Progress>
            {/* Memory */}
            <Progress percent={state.Percent.Mem} progress
                success={state.Percent.Mem < 50}
                warning={state.Percent.Mem >= 50 && state.Percent.Mem < 80}
                error={state.Percent.Mem >= 80}>
                <p className="justify-between-label"><span><Icon name='microchip' />Memory:</span> <span>{state.Load.Mem.Used}MB/{state.Load.Mem.Total}MB</span></p>
            </Progress>
            {/* Swap */}
            <Progress percent={state.Percent.Swap} progress
                success={state.Percent.Swap < 50}
                warning={state.Percent.Swap >= 50 && state.Percent.Swap < 80}
                error={state.Percent.Swap >= 80}>
                <p className="justify-between-label"><span><Icon name='disk' />Swap:</span> <span>{state.Load.Swap.Used}MB/{state.Load.Swap.Total}MB</span></p>
            </Progress>
            {/* Disk */}
            <Progress percent={state.Percent.Disk} progress
                success={state.Percent.Disk < 50}
                warning={state.Percent.Disk >= 50 && state.Percent.Disk < 80}
                error={state.Percent.Disk >= 80}>
                <p className="justify-between-label"><span><Icon name='disk' />Disk</span></p>
            </Progress>
        </div>
    )
}

export default function ComStatusCard(props) {
    const server = props.server;
    const key = props.key;

    useEffect(() => {
        console.log(server)
    }, [])

    return (
        <Card className="server-card" key={key}>
            <Card.Content>
                {server.state ? <UpdatingState state={server.state} /> : <LoadingState />}
            </Card.Content>
            {
                server.info ?
                (
                    <Card.Header><Flag name={server.Location} /> <PureOperatingOs os={server.info.System.Os} /> {server.Host} </Card.Header>
                ) : ""
            }
            {
                server.state ?
                    (
                        <Card.Meta>
                            <div className="flex-justify-between">
                                <p><Icon name='power off' /> Uptime: {dayjs(Date.now() - (server.state.Host.Uptime * 1000)).fromNow(true)}</p>
                                <p><Icon name='docker' /> {server.state.Container.filter(c => c.State === 'running').length}/{server.state.Container.length}</p>
                            </div>
                        </Card.Meta>
                    ) : ""
            }
            <Card.Content extra>
                <div className="flex-justify-between">
                    <ComDetailModal data={server.info} container={(server.state && server.state.Container) ? server.state.Container : []} />
                </div>
            </Card.Content>
        </Card>
    )
}