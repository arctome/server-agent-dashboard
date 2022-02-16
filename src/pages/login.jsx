import React from 'react'
import { Button, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react'
import { toast } from 'react-toastify'

function LoginForm() {
    function submitHandler(e) {
        e.preventDefault();
        var request = new XMLHttpRequest();
        request.open('POST', '/api/login', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.withCredentials = true;
        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                const data = JSON.parse(this.response)
                if (!data.ok) {
                    toast("fetch token failed");
                    console.log(this.response);
                    return;
                }
                window.localStorage.setItem("Server-Agent-Token", data.token)
                window.location.href = "/"
            } else {
                // FIXME: catch ajax error
                toast("ajax to `/api/login` failed");
                console.log(this.response)
            }
        };
        request.onerror = function (e) {
            console.log(e);
            toast("Login request error, please try again later!")
        };
        request.send(JSON.stringify(Object.fromEntries(new FormData(e.target))));
    }

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    Log-in to Dashboard
                </Header>
                <Form size='large' onSubmit={submitHandler}>
                    <Segment stacked>
                        <Form.Input fluid icon='user' iconPosition='left' name="user" placeholder='User name' />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            name="pass"
                        />

                        <Button color='teal' fluid size='large'>
                            Login
                        </Button>
                    </Segment>
                </Form>
                <Message>
                    <p>See open source: </p>
                    <p><Button color='black' as="a" href="https://github.com/arctome/server-agent" >
                        <Icon name='github' /> Server Agent
                    </Button>
                        <Button color='black' as="a" href="https://github.com/arctome/server-agent-dashboard">
                            <Icon name='github' /> Server Agent Dashboard
                        </Button></p>
                </Message>
            </Grid.Column>
        </Grid>
    )
}

export default LoginForm