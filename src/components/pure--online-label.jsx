import React from 'react'
import { Label } from 'semantic-ui-react'

export default function PureOnlineLabel({ code }) {
    if(!code) code = 3
    // 0: not connected, 1: connection online, 2: connection lost
    const colors = ['grey', 'green', 'red', 'grey']
    const texts = ['Connecting...', "Online", "Offline", "Not defined"]

    return <Label color={colors[code]} size="medium" style={{marginRight: 5}}>{texts[code]}</Label>
}