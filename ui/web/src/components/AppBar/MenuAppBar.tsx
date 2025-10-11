import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Drawer, List, ListItemButton } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MenuAppBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false)

  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const handleNavigation = (path: string) => {
    toggleDrawer(false)
    navigate(`/${path}`)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      
      <AppBar>
        <Toolbar sx={{display: 'flex'}} >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon onClick={() => toggleDrawer(true)}/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ESP8266
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={open}
        onClose={() => {toggleDrawer(false)}}
        transitionDuration={300}
      >
        <Box component="div" sx={{ width: 250, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Devices
          </Typography>
          {/* TODO: This need use the .map method */}
          <List>
            <ListItemButton onClick={() => {handleNavigation('stick')}}>
              <Typography>
                LED stick
              </Typography>
            </ListItemButton>
            <ListItemButton onClick={() => {handleNavigation('lamp')}}>
              <Typography>
                Smart lamp
              </Typography>
            </ListItemButton>
            <ListItemButton onClick={() => {handleNavigation('empty')}} >
              <Typography>
                Devices is empty...
              </Typography>
            </ListItemButton>
            <ListItemButton onClick={() => {handleNavigation('empty')}}>
              <Typography>
                Devices is empty...
              </Typography>
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      
    </Box>
  );
}
