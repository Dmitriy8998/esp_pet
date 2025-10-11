import { Box, styled } from "@mui/material";
import { Outlet } from "react-router-dom";
import MenuAppBar from "../AppBar/MenuAppBar";
import Footer from "../Footer/Footer";

export default function Layout() {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    }));

    return (
        <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
            <MenuAppBar />
            <Box component="main"  sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: '100vh' }}>
                <DrawerHeader />
                <Outlet />
                <Footer />
            </Box>
        </Box>
    )
}
