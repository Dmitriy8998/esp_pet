import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";


export default function Stream() {
    const [send, ] = useState<boolean>(false);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://192.168.0.120:81");
        return () => ws.current?.close();
    }, [])
    
    const handlerButtonClick = async () => {
        const audioCtx = new AudioContext({
            sampleRate: 10000
            // sampleRate: 12000
            // sampleRate: 16000
            // sampleRate: 22000
            // sampleRate: 44000
            // sampleRate: 48000
        });

        const response = await fetch('/music.mp3');
        const binary = await response.arrayBuffer();

        const audioBuffer = await audioCtx.decodeAudioData(binary);

        const chLeft = audioBuffer.getChannelData(0);
        const chRight = audioBuffer.getChannelData(1);

        const monoSamples = new Int32Array(audioBuffer.length);
        // const leftSamples = new Int32Array(chLeft.length);
        // const rightSamples = new Int32Array(chRight.length);
        
        const chunkSize = 512; 
        let offset = 0;

        
        for (let i = 0; i < audioBuffer.length; i++) {
            let s = (chLeft[i] + chRight[i]) / 2;

            if (s > 1.0) s = 1.0;
            if (s < -1.0) s = -1.0;
            
            const sample16 = s < 0 ? s * 0x8000 : s * 0x7FFF;
            monoSamples[i] = ((sample16 & 0xFFFF) << 16) | (sample16 & 0xFFFF);
        }

        
        while (offset < monoSamples.length) {
            const chunk = monoSamples.subarray(offset, offset + chunkSize);

            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(chunk);
            } else {
                console.error("esp8266 is disconnect!");
                break;
            }
            
            offset += chunkSize;
        
            await new Promise(resolve => setTimeout(resolve, 51));
        }
    }
    
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
