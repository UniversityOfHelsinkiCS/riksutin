import { useRef, useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  MenuItem,
  Box,
  Container,
  MenuList,
  Button,
  Paper,
  ClickAwayListener,
  Grow,
  Popper,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
} from '@mui/material'
import { AdminPanelSettingsOutlined, Language } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

import { Link, useNavigate } from 'react-router-dom'
import useLoggedInUser from '../../hooks/useLoggedInUser'

import styles from '../../styles'
import hyLogo from '../../assets/hy_logo.svg'

const NavBar = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, isLoading } = useLoggedInUser()
  const [openLanguageSelect, setOpenLanguageSelect] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // HACK:
    if (user?.language === 'en') {
      i18n.changeLanguage('en').catch(_ => {})
    }
  }, [user, i18n])

  const { language } = i18n
  const languages = ['fi', 'en']

  const handleLanguageChange = (newLanguage: string) => {
    // HACK:
    i18n.changeLanguage(newLanguage).catch(_ => {})
    setOpenLanguageSelect(false)
  }

  const navigateToMainPage = () => {
    sessionStorage.clear()
    navigate('/')
  }

  const { navStyles } = styles

  if (isLoading) {
    return null
  }

  const { isAdmin } = user as any

  const handleAdminToggle = async () => {
    const type = isAdmin ? 'normal' : 'admin'
    await fetch(`/api/mock/user?type=${type}`)
    window.location.reload()
  }

  const adminToggleStyle = {
    '& .MuiFormControlLabel-label': { color: 'black', fontSize: '0.8rem' },
  }

  return (
    <AppBar elevation={0} position="relative" sx={navStyles.appbar}>
      <Container maxWidth={false}>
        <Toolbar sx={navStyles.toolbar} disableGutters>
          <Box sx={navStyles.navBox}>
            <img src={hyLogo} alt="University of Helsinki" width="40" />
            <Box ml="2rem">
              <Button onClick={() => navigateToMainPage()}>
                <Typography sx={navStyles.appName}>{t('appName')}</Typography>
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: 'flex' }}>
            {import.meta.env.MODE === 'development' && (
              <FormGroup aria-label="position" row>
                <FormControlLabel
                  value="bottom"
                  control={<Switch color="primary" />}
                  label="Admin"
                  labelPlacement="bottom"
                  checked={isAdmin}
                  onChange={handleAdminToggle}
                  sx={adminToggleStyle}
                />
              </FormGroup>
            )}
            {user?.isAdmin && (
              <Link to="/admin/summary" style={{ textDecoration: 'none' }}>
                <Button sx={{ marginRight: '25px' }}>
                  <AdminPanelSettingsOutlined sx={navStyles.icon} /> {t('admin')}
                </Button>
              </Link>
            )}
            <Button variant="outlined" sx={{ marginRight: '25px' }}>
              <Link to="/user" style={{ textDecoration: 'none', color: 'inherit' }}>
                {t('userPage:userPageButton')}
              </Link>
            </Button>
            <Button
              ref={anchorRef}
              id="composition-button"
              data-cy="language-select"
              aria-controls={openLanguageSelect ? 'composition-menu' : undefined}
              aria-expanded={openLanguageSelect ? 'true' : undefined}
              aria-haspopup="true"
              onClick={() => setOpenLanguageSelect(!openLanguageSelect)}
            >
              <Language sx={navStyles.language} /> {language}
            </Button>
            <Popper
              open={openLanguageSelect}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={() => setOpenLanguageSelect(!openLanguageSelect)}>
                      <MenuList
                        autoFocusItem={openLanguageSelect}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                      >
                        {languages.map(l => (
                          <MenuItem
                            key={l}
                            sx={[navStyles.item, language === l && navStyles.activeItem]}
                            onClick={() => {
                              handleLanguageChange(l)
                            }}
                          >
                            {l.toUpperCase()}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default NavBar
