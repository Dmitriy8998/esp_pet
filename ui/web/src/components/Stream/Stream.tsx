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
    

    // const handlerButtonClick = async () => {
    //     const music = await fetch('/Otshelnik.mp3')
    //     const arrayBuffer = await music.arrayBuffer();
        
    //     const chunkSize = 2048;
    //     let offset = 0;

    //     while (offset < arrayBuffer.byteLength) {
    //         const chunk = arrayBuffer.slice(offset, offset + chunkSize)
            
    //         // for logs
    //         // const byteArray = new Uint8Array(chunk);
    //         // console.log('byteArray - ', byteArray);

    //         if (ws.current && ws.current.readyState === WebSocket.OPEN) {
    //             ws.current.send(chunk);
    //         } else {
    //             console.error("esp8266 is disconect!");
    //             break;
    //         }

    //         offset += chunkSize;

    //         await new Promise(resolve => setTimeout(resolve, 50));
    //     }
    //     console.log("STOP_STREEM!!");
    // };


    // const handlerButtonClick = async () => {
    //     const music = await fetch('/Otshelnik.mp3')
    //     const arrayBuffer = await music.arrayBuffer();
   
    //     const audioCtx = new AudioContext({
    //         sampleRate: 10000
    //     });

    //     const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    //     const float32Samples = audioBuffer.getChannelData(0);

    //     const int32Samples = new Int32Array(float32Samples.length);
    //     for (let i = 0; i < float32Samples.length; i++) {
    //         let s = float32Samples[i];
    //         if (s > 1.0) s = 1.0;
    //         if (s < -1.0) s = -1.0;
    //         int32Samples[i] = s < 0 ? s * 0x80000000 : s * 0x7FFFFFFF;
    //     }

    //     const chunkSize = 512; 
    //     let offset = 0;
        
    //     while (offset < int32Samples.length) {
    //         const chunk = int32Samples.subarray(offset, offset + chunkSize);

    //         if (ws.current && ws.current.readyState === WebSocket.OPEN) {
    //             ws.current.send(chunk);
    //         } else {
    //             console.error("esp8266 is disconnect!");
    //             break;
    //         }
            
    //         offset += chunkSize;
           
    //         await new Promise(resolve => setTimeout(resolve, 50));
    //     }


        const handlerButtonClick = async () => {
        const music = await fetch('/Otshelnik.mp3')
        const arrayBuffer = await music.arrayBuffer();

        const audioCtx = new AudioContext({
            sampleRate: 10000
        });

        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        const float32Samples = audioBuffer.getChannelData(0);

        const int32Samples = new Int32Array(float32Samples.length);
        for (let i = 0; i < float32Samples.length; i++) {
            let s = float32Samples[i];
            if (s > 1.0) s = 1.0;
            if (s < -1.0) s = -1.0;
            
            
            let sample16 = s < 0 ? s * 0x8000 : s * 0x7FFF;
            
            
            int32Samples[i] = ((sample16 & 0xFFFF) << 16) | (sample16 & 0xFFFF);
        }

        const chunkSize = 512; 
        let offset = 0;
        
        while (offset < int32Samples.length) {
            const chunk = int32Samples.subarray(offset, offset + chunkSize);

            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(chunk);
            } else {
                console.error("esp8266 is disconnect!");
                break;
            }
            
            offset += chunkSize;
        
            // Рассчитываем точную задержку: 512 сэмплов при 10000 Гц воспроизводятся ~51.2 мс
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
