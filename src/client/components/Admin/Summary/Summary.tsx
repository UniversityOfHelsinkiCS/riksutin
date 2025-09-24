import { useMemo, useState } from 'react'
import { MRT_Row, MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { Box, Button, IconButton, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { utils, writeFile } from 'xlsx'
import { Link } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import { useEntries } from '../../../hooks/useEntry'
import useQuestions from '../../../hooks/useQuestions'
import useDeleteEntryMutation from '../../../hooks/useDeleteEntryMutation'
import styles from '../../../styles'
import useFaculties from '../../../hooks/useFaculties'
import { extraOrganisations } from '@common/organisations'
import createTableData from './utils'

import type { TableValues } from './utils'

const { riskColors } = styles

type TableProps = {
  tableValues: TableValues[]
  questionTitles: TableValues
  isOutdated: any
}

const additionalColumnNames: TableValues = {
  id: 'ID',
  date: 'Päivämäärä',
  total: 'Kokonaisriskitaso',
  faculty: 'Tiedekunta',
  unit: 'Yksikkö',
}

const Table = ({ tableValues, questionTitles, isOutdated }: TableProps) => {
  const deleteMutation = useDeleteEntryMutation()
  const columns = useMemo<MRT_ColumnDef<TableValues>[]>(() => {
    const outdatedWarning = { paddingRight: 10, color: 'red', fontSize: 'x-large' }
    return tableValues.length
      ? Object.keys(tableValues[0]).map(columnId => ({
          header: questionTitles[columnId] ?? additionalColumnNames[columnId] ?? columnId,
          accessorKey: columnId,
          id: columnId,
          Cell: ({ cell, row }) => (
            <Box
              component="span"
              sx={() => ({
                ...(columnId === 'total' && {
                  backgroundColor: riskColors[cell.getValue<number>()] ?? riskColors[3],
                  borderRadius: '0.25rem',
                  fontWeight: 'bold',
                  p: '0.75rem',
                }),
              })}
            >
              {columnId === '3' ? (
                <>
                  {isOutdated(row.getValue('id')) && <span style={outdatedWarning}>!</span>}
                  <Link to={`/admin/entry/${row.getValue('id')}`}>{cell.getValue<string>()}</Link>
                </>
              ) : (
                cell.getValue<number>()
              )}
            </Box>
          ),
        }))
      : []
  }, [tableValues, questionTitles, isOutdated])

  const columnIds = Object.keys(tableValues[0])

  const [columnOrder, setColumnOrder] = useState(['3', 'date', 'total', '1', 'faculty', '2', 'unit', ...columnIds])

  const handleDeleteRiskAssessment = (row: MRT_Row<TableValues>) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Haluatko poistaa valitun riskiarvion?')) return

    try {
      deleteMutation.mutate(row.original.id!.toString())
      enqueueSnackbar('Riskiarvio poistettu', { variant: 'success' })
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  const handleExportRows = (rows: MRT_Row<TableValues>[]) => {
    const date = new Date()
    const timeStamp = `${date.getDate()}${
      date.getMonth() + 1
    }${date.getFullYear()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
    const fileName = `risk_i_summary_${timeStamp}.xlsx`

    const data = rows.map(r => Object.values(r.original))
    const sheetData = [Object.values(questionTitles).concat(Object.values(additionalColumnNames))].concat(data)
    const worksheet = utils.json_to_sheet(sheetData)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Riskiarviot')
    writeFile(workbook, fileName, { compression: true })
  }

  const tableInstance = useMaterialReactTable({
    columns,
    data: tableValues,
    enableColumnOrdering: true,
    enableGlobalFilter: false,
    enableRowActions: true,
    muiTableBodyRowProps: { hover: false },
    muiTableBodyCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
      },
    },
    muiTablePaperProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .2)',
      },
    },
    initialState: { columnVisibility: { id: false } },
    renderRowActions: ({ row }) => (
      <IconButton onClick={() => handleDeleteRiskAssessment(row)}>
        <DeleteIcon color="error" />
      </IconButton>
    ),
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: '',
      },
    },
    state: {
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
          startIcon={<FileDownloadIcon />}
          variant="outlined"
        >
          Luo XLSX-tiedosto
        </Button>
      </Box>
    ),
  })

  return <MaterialReactTable table={tableInstance} />
}

const Summary = () => {
  const { entries } = useEntries()
  const { questions } = useQuestions(1)
  const { faculties, isLoading: facultiesLoading } = useFaculties()

  if (!questions || !entries || facultiesLoading || !faculties) return null

  const organisations = faculties.concat(extraOrganisations)

  const entriesWithData = entries.filter(entry => entry.data.answers && entry.data.country && entry.data.risks)

  if (entriesWithData.length === 0)
    return (
      <Box sx={{ m: 3 }}>
        <Typography variant="h6" sx={{ my: 4, pl: 1 }}>
          Ei täytettyjä kyselyitä
        </Typography>
      </Box>
    )

  const tableData = createTableData(entriesWithData, questions, organisations)

  const headerTitle = q => {
    if (q.shortTitle.fi) {
      return q.shortTitle.fi
    }
    return q.title.fi ?? q.title.fi
  }

  const questionTitles = Object.fromEntries(questions.map(q => [q.id.toString(), headerTitle(q)]))

  const isOutdated = id => {
    const { answers, multilateralCountries } = entries.find(e => e.id === Number(id))?.data as any
    const hyMultilateral = answers['9'] === 'coordinator' && answers['4'] === 'multilateral'

    return hyMultilateral && !multilateralCountries
  }

  return (
    <>
      <Typography variant="h5" m={4}>
        Kaikki valmiit riskiarviot
      </Typography>
      <Box
        sx={{
          width: '100%',
          px: 8,
        }}
      >
        <Table tableValues={tableData} questionTitles={questionTitles} isOutdated={isOutdated} />
      </Box>
    </>
  )
}

export default Summary
