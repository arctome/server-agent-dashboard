import React from 'react'
import { Message, Button, Icon } from 'semantic-ui-react'

export default function PageNotFound() {
    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "80%", maxWidth: 413 }}>
                <h3>404 Not Found... But</h3>
                <Message>
                    <p>How about see the code: </p>
                    <p>
                        <Button color='black' as="a" href="https://github.com/arctome/server-agent" >
                            <Icon name='github' /> Server Agent
                        </Button>
                        <Button color='black' as="a" href="https://github.com/arctome/server-agent-dashboard">
                            <Icon name='github' /> Server Agent Dashboard
                        </Button>
                    </p>
                </Message>
            </div>
        </div>
    )
}