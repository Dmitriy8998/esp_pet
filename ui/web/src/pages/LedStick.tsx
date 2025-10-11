import { Box, Typography } from "@mui/material";

export default function LedStick() {

    const fetchData = async () => {
        try {
        const res = await fetch('http://localhost:5000/', {method: 'GET'})
        
        const data = await res.json();
        console.log("ESP___", data)

        } catch (err) {
        console.error(err)
        }
    }

    return(
        <Box component="div">
            <Box component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography fontSize={36}>
                    LED stick
                </Typography>
            </Box>
            <Box component="div" sx={{ display: 'flex' }}>
                <button onClick={fetchData}>ESP_8266_fetch</button>
            </Box>
        </Box>
    )
}
