import { useEffect, useState } from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-ocean.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/keymap/sublime'
import io from 'socket.io-client'
import { Text } from '@chakra-ui/react'
import { useStore } from "@/shared";
import { createEditor, createWidget } from "@/entities/Editor/model/createEditor";

const RealTimeEditor = () => {
    const [users, setUsers] = useState([])
    const { username, roomId } = useStore(({ username, roomId }) => ({
        username,
        roomId,
    }))

    useEffect(() => {
        const editor = createEditor();

        const widget = createWidget();

        const socket = io('http://localhost:3001/', {
            transports: ['websocket'],
        })

        socket.on('CODE_CHANGED', (code) => {
            editor.setValue(code)
        })

        socket.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`)
        })

        socket.on('connect', () => {
            socket.emit('CONNECTED_TO_ROOM', { roomId, username })
        })

        socket.on('disconnect', () => {
            socket.emit('DISSCONNECT_FROM_ROOM', { roomId, username })
        })

        socket.on('ROOM:CONNECTION', (users) => {
            setUsers(users)
        })

        editor.on('change', (instance: { getValue: () => any }, changes: { origin: any }) => {
            const { origin } = changes
            if (origin !== 'setValue') {
                socket.emit('CODE_CHANGED', instance.getValue())
            }
        })
        // editor.on('cursorActivity', (instance) => {
        //     // console.log(instance.cursorCoords())
        // })

        return () => {
            socket.emit('DISSCONNECT_FROM_ROOM', { roomId, username })
        }
    }, [])

    return (
        <>
            <Text fontSize="2xl">Your username is: {username}</Text>
            <Text fontSize="2xl">The room ID is: {roomId}</Text>
            <Text fontSize="2xl">
                How many pople are connected: <b> {users.length}</b>
            </Text>

            <textarea id="ds" />
        </>
    )
}

export default RealTimeEditor