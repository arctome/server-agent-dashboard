import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ComStatusCard from '../components/status-card'
import { useNavigate } from 'react-router-dom'
import "../styles/home-page.css"

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

    useEffect(async () => {
        let data = await loadServerList().catch(e => { console.log(e) });
        setServers(data)
    }, [])

    return (
        <main className="page-home">
            <div className="server-list">
                <div className="list-wrapper">
                    {
                        servers.map(server => {
                            return <ComStatusCard server={server} key={server.Host} className="server-card" />
                        })
                    }
                </div>
            </div>
        </main>
    )
}