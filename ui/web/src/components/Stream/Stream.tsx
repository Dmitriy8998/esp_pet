import { Box, Button, Typography } from "@mui/material";
import { arSA } from "@mui/material/locale";
import { useEffect, useRef, useState } from "react";


export default function Stream() {

    const [send, setSend] = useState<boolean>(false);
    const [response, setResponse] = useState<string>('');

    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://192.168.0.120:81");
        return () => ws.current?.close();
    }, [])
    

    const handlerButtonClick = async () => {
        const music = await fetch('/music.mp3')
        const arrayBuffer = await music.arrayBuffer();
        
        const chunkSize = 2048;
        let offset = 0;

        while (offset < arrayBuffer.byteLength) {
            const chunk = arrayBuffer.slice(offset, offset + chunkSize)
            
            // for logs
            // const byteArray = new Uint8Array(chunk);
            // console.log('byteArray - ', byteArray);

            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(chunk);
            } else {
                console.error("esp8266 is disconect!");
                break;
            }

            offset += chunkSize;

            await new Promise(resolve => setTimeout(resolve, 50));
        }
        console.log("STOP_STREEM!!");
    };
    
    return (
        <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box component="div" sx={{ display: 'flex', width: '35vh' }}>
                <Typography fontSize={24}>
                    Web Cocket
                </Typography>
            </Box>
            <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
                <Button
                    onClick={handlerButtonClick}
                >
                    <Typography fontSize={16}>
                        {!send ? 'send' : 'data sent'}
                    </Typography>
                </Button>
            </Box>
        </Box>
    )
}
