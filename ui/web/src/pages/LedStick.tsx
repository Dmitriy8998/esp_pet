import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ChromePicker, type ColorResult } from 'react-color'
import MusicPlayerSlider from "../components/Player/Player";
import Stream from "../components/Stream/Stream";


export default function LedStick() {
    const [background, setBackground] = useState<string>("#0000")

    const [isDisabled, setIsDisabled] = useState<number>(0.3)
    const [stateOnOff, setStateOnOff] = useState<string>("ON")

    useEffect(() => {
        const colorLed = async () => {
            try {
                await fetch('http://192.168.0.120/color', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: background,
                });
            } catch (err) {
                console.error(err)
            };
        };
        
        colorLed()
    }, [background])

    const onOff = async () => {
        try {
            await fetch('http://192.168.0.120/onOff', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: stateOnOff,
            });
        } catch (err) {
            console.error(err)
        };
    };
    
    const handleClick = () => {
        if(isDisabled === 0.3) {
            setIsDisabled(1)
            setStateOnOff("OFF")

            onOff()
        } else {
            setIsDisabled(0.3)
            setStateOnOff("ON")
            
            onOff()
        }
    }
    
    const handleChangeComplete = (color: ColorResult) => {setBackground(color.hex)}

    return(
        <Box component="div">
            <Box component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h3">
                    LED staff
                </Typography>
            </Box>
            <Box component="div" sx={{ display: 'flex' }}>
                <Button onClick={handleClick}>
                    {stateOnOff}
                </Button>
            </Box>
            <Box component="div" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Box component="div" sx={{ display: 'flex', pointerEvents: stateOnOff === "OFF" ? 'auto' : 'none', opacity: isDisabled}} >
                    <ChromePicker 
                        styles={{
                            default: {
                                picker: {
                                    width: '500px',
                                    height: '500px',
                                },
                                controls: {
                                    fontSize: '20px'
                                }
                            }
                        }}
                        color={background}
                        onChange={handleChangeComplete}
                    />
                </Box>
                <Box component="div" sx={{ display: 'flex' }}>
                    <Stream/>
                </Box>
            </Box>
            <Box component="div" sx={{ display: 'flex' }}>
                <MusicPlayerSlider/>
            </Box>
        </Box>
    )
}
