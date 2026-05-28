// import { Box, Button, Typography } from "@mui/material";
// import { useEffect, useRef, useState } from "react";


// export default function Stream() {

//     const [send, setSend] = useState<boolean>(false);
//     const [response, setResponse] = useState<string>('');

//     const ws = useRef<WebSocket | null>(null);
//     // ws.current = new WebSocket("wss://ws.ifelse.io") // https (wss)
//     // ws.current = new WebSocket("ws://ws.ifelse.io")     // http  (ws) // esp8266 - 07 - supported only this approach!

    
//     // TODO: Need added useEffect. WebSocked generaiting is many times.
//     ws.current = new WebSocket("ws://192.168.0.120:81")
    

//     // TODO: Data send from timer. Do not delete.

//     // ws.current.addEventListener("open", () => {
//     //     console.log("CONNECTED...");
        
//     //     const pingInterval = setInterval(() => {
//     //         console.log(`SET: ping: ${1000}`);
//     //         ws.current?.send("hello socket");
//     //     }, 1000)
//     // });


//     ws.current.addEventListener("message", (e) => {
//         console.log("message from server: ", e.data);

//         setResponse(e.data);
//     })

//     ws.current.addEventListener("error", () => {
//         console.log("WS IS ERROR");
//     })

//     ws.current.addEventListener("close", () => {
//         console.log("DISCONECTED");
//     })
    
    
//     const handlerButtonClick = () => {
        
//         if (!send) {
//             console.log("DATA SEND...");
        
//             ws.current?.send('Hello Web Socket !!!');
//             setSend(true);   
//         }

//         else if (send) {
//             console.log("CLOSE CONNECTION...");

//             ws.current?.close();
//             setSend(false);
//         }
//     }

    
//     return (
//         <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
//             <Box component="div" sx={{ display: 'flex', width: '35vh' }}>
//                 <Typography fontSize={24}>
//                     Web Cocket
//                 </Typography>
//             </Box>
//             <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
//                 <Button
//                     onClick={handlerButtonClick}
//                 >
//                     <Typography fontSize={16}>
//                         {!send ? 'send' : 'data sent'}
//                     </Typography>
//                 </Button>
//             </Box>
//         </Box>
//     )
// }




// WebSocketsServer webSocket = WebSocketsServer(81);


// void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
//  if (type == WStype_BIN) {
//     for(size_t i = 0; i < (length > 5 ? 5 : length); i++) {
//       Serial.print(payload[i]);
//     }
//     Serial.println();
//   } 
  
//   else if (type == WStype_CONNECTED) {
//     Serial.printf("[%u] React is connect\n", num);
//   } 
//   else if (type == WStype_DISCONNECTED) {
//     Serial.printf("[%u] React disconnect\n", num);
//   }
// }




// void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
//   if (type == WStype_BIN) {
    
//     //for(size_t i = 0; i < (length > 5 ? 5 : length); i++) {
//       //Serial.print(payload[i]);
//     //}
//     //Serial.println();
    
//     // Save in buffer
//     //if (audioBuffer) {
//       //audioBuffer->write(payload, length);
//     //}

//     musicBufferLen = (length < BUFFER_SIZE) ? length : BUFFER_SIZE;
//     memcpy(musicBuffer, payload, musicBufferLen);
//     musicBuffer[musicBufferLen] = '\0'; 
    
//     Serial.printf("Получено бинарных данных: %d байт\n", musicBufferLen);   
//   }
  
//   else if (type == WStype_CONNECTED) {
//     Serial.printf("[%u] React is connect\n", num);
//   }
//   else if (type == WStype_DISCONNECTED) {
//     Serial.printf("[%u] React disconnect\n", num);
//   }
// }
