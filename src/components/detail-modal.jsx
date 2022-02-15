import React, { useState } from 'react'

export default function ComDetailModal(props) {
    const data = props.data;
    const dockerM = props.container;
    if (!data) return (
        <div>No data found!</div>
    )

    const [open, setOpen] = useState(false)

    return (
        <Modal
            closeIcon
            open={open}
            trigger={<Button content='Detail' icon='file alternate outline' labelPosition='left' />}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            <Header>Host: {data.Host}</Header>
            <Modal.Content>
                <Grid divided='vertically'>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <h4>Server Detail Infomation: </h4>
                            <p>CPU: {data.CPU.ModelName} x{data.CPU.Cores}</p>
                            <p>Exposed IP Address: {data.OuterIPAddr}</p>
                            <p>OS: {data.System.Os}@{data.System.OsVersion}</p>
                            <p>Arch: {data.System.Architecture}</p>
                            <p>Virtualization: {data.System.Virtualization}</p>
                        </Grid.Column>
                        {dockerM && dockerM.length > 0 ? (
                            <Grid.Column>
                                <h4>Docker Status</h4>
                                {dockerM.map(c => {
                                    return (
                                        <p className="flex-justify-between" key={c.ID}>
                                            <span>{c.Name[0].replace("/", "")}</span>
                                            <span style={{
                                                color: c.State === 'running' ? "green" : "orange"
                                            }}>{c.State}</span>
                                        </p>
                                    )
                                })}
                            </Grid.Column>
                        ) : null}
                    </Grid.Row>
                </Grid>
            </Modal.Content>
        </Modal>
    )
}