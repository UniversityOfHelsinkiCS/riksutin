import { Box, Container, Typography } from '@mui/material'

const Unauthorized = () => {
  return (
    <Box
      sx={{
        my: 8,
        minHeight: '100vh',
      }}
    >
      <Container>
        <Typography variant="h2" sx={{ my: 4, fontWeight: 'bold' }}>
          UNAUTHORIZED
        </Typography>
        <Typography variant="h6">Sorry, but you do not have the needed access to this page.</Typography>
      </Container>
    </Box>
  )
}

export default Unauthorized
