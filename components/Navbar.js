import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import PersonTwoTone from '@mui/icons-material/PersonTwoTone';
import { getUserDetails } from "../controllers/auth/auth";
import Link from 'next/link';
import { ArrowDropDown, SearchRounded, SearchTwoTone } from '@mui/icons-material';
import { TextField } from '@mui/material';
import { useRouter } from 'next/router';

import { UserContext } from "../providers/user";
import { faL } from '@fortawesome/free-solid-svg-icons';


function NavBar({ session, loggedIn, user, searchQ = '' }) {

    const settings = ['Profile', 'Logout'];
    const router = useRouter();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState(searchQ);
    const pathname = router.pathname;
    const userCtx = React.useContext(UserContext)
    const groupID = userCtx?.groups[0]?.id
    const [pages, setPages] = React.useState([
        { name: 'Home', link: '/', protected: false },
        { name: 'Dashboard', link: '/dashboard', protected: true, allowedGroups: [7,2,3,4] },
        { name: 'About', link: '/about', protected: false },
        { name: 'Facilities', link: '/public/facilities', protected: false },
        { name: 'Facilities', link: '/facilities', protected: true, allowedGroups: [7,2,3,4] },
        { name: 'Community Units', link: '/public/community-units' },
        { name: 'Community Units', link: '/community-units', protected: true, allowedGroups: [7,2,3,4] },
        { name: 'Users', link: '/users', protected: true, allowedGroups: [7, 2, 3] },
        { name: 'System setup', link: '/system_setup', protected: true, allowedGroups: [7] },
        { name: 'Reports', link: '/reports', protected: true, allowedGroups: [7,2,3,4] },
        { name: 'Contact us', link: '/about#contacts', protected: false }
      ])

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    React.useEffect(() => {
        let mounted = true;
        if (mounted) {
            console.log('NavBar: ', user)
        }
        return () => { mounted = false }
    }, [groupID, loggedIn, user])

    return (
        <AppBar position="fixed" color="default" variant="outlined" elevation={0}>
            <Container maxWidth="2xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, mr: 1 }}>
                        <Link href={'/'}><a>
                            <img src="/moh-logo-alt.png" alt="MoH KMHFR" style={{ height: '50px' }} />
                        </a>
                        </Link>
                    </Box>

                    {/* mobile */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                            <MenuIcon />
                        </IconButton>
                        <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left' }} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{ display: { xs: 'block', md: 'none' } }}>
                            
                            {pages.map((page) => {
                                const allowed = (
                                    (!loggedIn && !page.protected) ||
                                    (page.protected && loggedIn && page.allowedGroups?.includes(groupID))
                                )
                                if (!allowed) return
                                return (
                                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                    <Link style={{ textDecoration: 'none', color: '#1651B6' }} href={page.link}><a>{page.name}</a></Link>
                                </MenuItem>
                            )})}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <Link href={'/'}><a>

                                <img src="/moh-logo-alt.png" alt="MoH KMHFR"  style={{ height: '44px' }} />
                            </a>
                            </Link>
                        </Box>
                        {/* desktop */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'row', gap: { md: 3, lg: 5 } }}>

                            {pages.map((page) => {
                                const allowed = (
                                    (!loggedIn && !page.protected) ||
                                    (page.protected && loggedIn && page.allowedGroups?.includes(groupID))
                                )
                                if (!allowed) return;
                                let active = (page.link.toLocaleLowerCase() == router.asPath?.toLocaleLowerCase())
                                return (
                                    <Link key={page.name} href={page.link}><a style={{ textDecoration: 'none', color: (active ? '#333' : '#1651B6'), borderBottom: `2px solid ${(active ? '#333' : 'transparent')}` }}>{page.name}</a></Link>
                                )
                            })}

                        </Box>
                    </Box>
                    {/* {!['/'].includes(pathname) && <Box sx={{ display: 'flex', flexGrow: 1 }}>
                        <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center' }}>
                            {/-* mobile view *-/}
                        </Box>
                            {/-* desktop view *-/}
                            <Box variant="outlined" sx={{ display: { md: 'none', lg: 'flex' }, alignItems: 'center', px: 2 }}>
                                <TextField variant="outlined" color="primary" id="search" label="Search" name='q' size="small" sx={{ display: { xs: 'none', md: 'flex' }, width: 'auto' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                <Button variant="outlined" size='small' sx={{ display: { xs: 'none', md: 'flex' }, p: 1 }} onClick={ev=>{
                                    router.push('/search?q='+searchQuery)
                                }}><SearchRounded m={4} /></Button>
                            </Box>
                    </Box>} */}

                    {(loggedIn && user) ? (
                        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: { xs: 0, md: 1 }, border: '1px solid #ccc', color: 'black', py: 1, px: 1, borderRadius: '8px' }}>
                            <Button onClick={ev => {
                                if (anchorElUser) {
                                    handleCloseUserMenu()
                                } else {
                                    handleOpenUserMenu(ev)
                                }
                            }} sx={{ display: 'flex', color: 'black', justifyContent: 'space-between', py: 0, px: { xs: 0, md: 1 } }}>
                                <Box sx={{ display: 'flex' }}>
                                    <PersonTwoTone />
                                    <div className='d-flex flex-col'>
                                        <Typography variant="p" sx={{ display: { xs: 'none', md: 'block', lineHeight: 'inherit' }, fontSize: '0.9em' }}>{user.first_name} {user.last_name}</Typography>
                                        {/* <small>{user.}</small> */}
                                    </div>

                                    <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                                        <MenuItem onClick={ev => {
                                            handleCloseUserMenu()
                                            router.push('/account')
                                        }}>
                                            Profile
                                        </MenuItem>
                                        <MenuItem onClick={ev => {
                                            handleCloseUserMenu()
                                            router.push('/about#faq')
                                        }}>
                                            Help & FAQ
                                        </MenuItem>
                                        <MenuItem onClick={ev => {
                                            handleCloseUserMenu()
                                            router.push('/logout')
                                        }}>
                                            Log out
                                        </MenuItem>
                                    </Menu>
                                </Box>
                                <ArrowDropDown />
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ flexGrow: 0 }}>
                            <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}> <PersonTwoTone /> </IconButton>
                                </Tooltip>
                                <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">Login</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                                <Button sx={{ borderRadius: '3em', mr: 2, backgroundColor: '#1651B6' }} size='large' variant="contained" color="primary" href="/auth/login">Login</Button>
                            </Box>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default NavBar;
