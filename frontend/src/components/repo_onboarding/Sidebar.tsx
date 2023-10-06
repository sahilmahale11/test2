import { List, Drawer, ListItem, ListItemButton, Divider, ListItemText, Box, Toolbar } from '@mui/material';

const drawerWidth = 240;

type propsType = {
    sideMenu: any;
};
const Sidebar = (props: propsType) => {
    return (
        <Drawer
            variant='permanent'
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                ['& .MuiDrawer-paper']: { width: drawerWidth, boxSizing: 'border-box' },
            }}>
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => props.sideMenu('tasks')}>
                            <ListItemText primary='Tasks' />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
            </Box>
        </Drawer>
    );
};

export default Sidebar;
