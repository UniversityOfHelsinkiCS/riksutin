import { useState } from 'react'
import { IconButton, Collapse, Box } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import Markdown from './Markdown'

const ShowMore = ({ text, expanded = false }: { text: string | undefined | null; expanded?: boolean }) => {
  const [expand, setExpand] = useState(expanded)

  if (!text) {
    return null
  }

  return (
    <>
      <IconButton onClick={() => setExpand(!expand)}>
        <HelpOutlineOutlinedIcon />
        {!expand ? <ExpandMore /> : <ExpandLess />}
      </IconButton>
      <Collapse in={expand} timeout="auto" unmountOnExit>
        <Box sx={{ padding: '10px' }}>
          <Markdown>{text}</Markdown>
        </Box>
      </Collapse>
    </>
  )
}

export default ShowMore
