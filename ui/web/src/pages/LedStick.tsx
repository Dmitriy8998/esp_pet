import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ChromePicker, type ColorResult } from 'react-color'

export default function LedStick() {
    const [background, setBackground] = useState<string>("#fff")

    useEffect(() => {
        const colorLed = async () => {
            try {
                await fetch('http://192.168.0.120/color', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: background
                });
            } catch (err) {
                console.error(err)
            }
        }
        
        colorLed()
    }, [background])
    
    const handleChangeComplete = (color: ColorResult) => {setBackground(color.hex)}

    return(
        <Box component="div">
            <Box component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h3">
                    LED staff
                </Typography>
            </Box>
            <Box component="div" sx={{ display: 'flex' }}>
            </Box>
            <Box component="div" sx={{ display: 'flex' }} >
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
        </Box>
    )
}
