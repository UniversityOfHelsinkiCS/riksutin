import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import {
  MRT_Row,
  MRT_PaginationState,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Updater,
} from 'material-react-table'
import { Box, Button, IconButton, Typography, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import WarningIcon from '@mui/icons-material/Warning'
import { utils, writeFile } from 'xlsx'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { useEntries } from '../../../hooks/useEntry'
import useQuestions from '../../../hooks/useQuestions'
import useDeleteEntryMutation from '../../../hooks/useDeleteEntryMutation'
import useLoggedInUser from '../../../hooks/useLoggedInUser'
import styles from '../../../styles'
import useFaculties from '../../../hooks/useFaculties'
import { extraOrganisations } from '@common/organisations'
import createTableData from './utils'
import { CONTROL_REPORT_CHECK_ENABLED } from '@config'

import type { TableValues } from './utils'

const { riskColors } = styles

type TableProps = {
  tableValues: TableValues[]
  questionTitles: TableValues
  isOutdated: any
  entries: any[]
}

const additionalColumnNames: TableValues = {
  id: 'ID',
  date: 'Päivämäärä',
  total: 'Kokonaisriskitaso',
  faculty: 'Tiedekunta',
  unit: 'Yksikkö',
}

const Table = ({ tableValues, questionTitles, isOutdated, entries }: TableProps) => {
  const deleteMutation = useDeleteEntryMutation()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  // Use ref to track if this is the first render
  const isFirstRender = useRef(true)

  // Initialize pagination from URL only on first render
  const [pagination, setPagination] = useState<MRT_PaginationState>(() => ({
    pageIndex: parseInt(searchParams.get('page') ?? '0', 10),
    pageSize: parseInt(searchParams.get('pageSize') ?? '10', 10),
  }))

  // Handle pagination change from the table
  const handlePaginationChange = useCallback((updaterOrValue: MRT_Updater<MRT_PaginationState>) => {
    setPagination(prev => {
      const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue
      return newValue
    })
  }, [])

  // Update URL when pagination changes (without triggering React Router re-render)
  useEffect(() => {
    // Skip URL update on first render since it's already in sync
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('page', pagination.pageIndex.toString())
    newUrl.searchParams.set('pageSize', pagination.pageSize.toString())
    window.history.replaceState({}, '', newUrl.toString())
  }, [pagination.pageIndex, pagination.pageSize])

  // Create stable references for row-level functions
  const entriesRef = useRef(entries)
  entriesRef.current = entries

  const isTestVersion = useCallback((id: string) => {
    return entriesRef.current.find(e => e.id === Number(id))?.testVersion || false
  }, [])

  const needsControlReport = useCallback((id: string) => {
    if (!CONTROL_REPORT_CHECK_ENABLED) {
      return false
    }
    const entry = entriesRef.current.find(e => e.id === Number(id))
    if (!entry) {
      return false
    }
    const totalRisk = entry.data?.risks?.find((r: any) => r.id === 'total')?.level
    return totalRisk === 3 && (!entry.controlReports || entry.controlReports.length === 0)
  }, [])

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
                <Box>
                  {isOutdated(row.getValue('id')) && <span style={outdatedWarning}>!</span>}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Link to={`/admin/entry/${row.getValue('id')}`}>{cell.getValue<string>()}</Link>
                    {needsControlReport(row.getValue('id')) && (
                      <Tooltip title={t('controlReport:noReportsWarning')}>
                        <WarningIcon sx={{ color: '#e74c3c', fontSize: '1.2rem' }} />
                      </Tooltip>
                    )}
                  </Box>
                  {isTestVersion(row.getValue('id')) && (
                    <Box
                      component="div"
                      sx={{ color: 'red', fontWeight: 'bold', fontSize: '0.75rem', marginTop: '4px' }}
                    >
                      TEST VERSION
                    </Box>
                  )}
                </Box>
              ) : (
                cell.getValue<number>()
              )}
            </Box>
          ),
        }))
      : []
  }, [tableValues, questionTitles, isOutdated, isTestVersion, needsControlReport, t])

  const columnIds = Object.keys(tableValues[0])

  const [columnOrder, setColumnOrder] = useState(['3', 'date', 'total', '1', 'faculty', '2', 'unit', ...columnIds])

  const handleDeleteRiskAssessment = (row: MRT_Row<TableValues>) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Haluatko poistaa valitun riskiarvion?')) {
      return
    }

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
    enablePagination: true,
    autoResetPageIndex: false,
    muiTableBodyRowProps: ({ row }) => ({
      hover: false,
      sx: {
        backgroundColor: isTestVersion(row.original.id) ? '#fffef5' : 'inherit',
      },
    }),
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
    initialState: {
      columnVisibility: { id: false },
    },
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
      pagination,
    },
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: handlePaginationChange,
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
  const { user } = useLoggedInUser()
  const navigate = useNavigate()

  const organisations = useMemo(() => (faculties ? faculties.concat(extraOrganisations) : []), [faculties])

  const entriesWithData = useMemo(
    () => (entries ?? []).filter(entry => entry.data.answers && entry.data.country && entry.data.risks),
    [entries]
  )

  const tableData = useMemo(
    () => (questions && entriesWithData.length > 0 ? createTableData(entriesWithData, questions, organisations) : []),
    [entriesWithData, questions, organisations]
  )

  const questionTitles = useMemo(() => {
    if (!questions) {
      return {}
    }
    const headerTitle = q => {
      if (q.shortTitle.fi) {
        return q.shortTitle.fi
      }
      return q.title.fi ?? q.title.fi
    }
    return Object.fromEntries(questions.map(q => [q.id.toString(), headerTitle(q)]))
  }, [questions])

  const isOutdated = useMemo(() => {
    return (id: any) => {
      const entryData = entries?.find(e => e.id === Number(id))?.data as any
      if (!entryData) {
        return false
      }
      const { answers, multilateralCountries } = entryData
      const hyMultilateral = answers['9'] === 'coordinator' && answers['4'] === 'multilateral'
      return hyMultilateral && !multilateralCountries
    }
  }, [entries])

  const isToskaUser = user?.iamGroups?.includes('grp-toska')

  if (!questions || !entries || facultiesLoading || !faculties) {
    return null
  }

  if (entriesWithData.length === 0) {
    return (
      <Box sx={{ m: 3 }}>
        <Typography variant="h6" sx={{ my: 4, pl: 1 }}>
          Ei täytettyjä kyselyitä
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 4 }}>
        <Typography variant="h5">Kaikki valmiit riskiarviot</Typography>
        {isToskaUser && (
          <Button variant="outlined" onClick={() => navigate('/admin/debug')}>
            Debug View
          </Button>
        )}
      </Box>
      <Box
        sx={{
          width: '100%',
          px: 8,
        }}
      >
        <Table
          tableValues={tableData}
          questionTitles={questionTitles}
          isOutdated={isOutdated}
          entries={entriesWithData}
        />
      </Box>
    </>
  )
}

export default Summary
