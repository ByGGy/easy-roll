import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowId,
  GridSlots,
} from '@mui/x-data-grid'

import { CharacterData } from '../../domain/character/character'

//--

type EditToolbarProps = {
  title: string
  addNewRecord: () => void
}

const EditToolbar = ({ title, addNewRecord }: EditToolbarProps) => {
  return (
    <GridToolbarContainer sx={{ padding: 0, mb: 1 }}>
      <Typography variant='h6' color='primary' marginRight={1}>{title}</Typography>
      <Button variant='outlined' color='primary' startIcon={<AddIcon />} onClick={addNewRecord}>
        Add
      </Button>
    </GridToolbarContainer>
  )
}

//--

type SimpleModel = {
  name: string
  value: number
}

type GridRowData = SimpleModel & {
  id: string
  isNew: boolean
}

const createRows = (data: Array<SimpleModel>): Array<GridRowData> => {
  return data.toSorted((aA, aB) => aA.name.localeCompare(aB.name)).map(a =>({
    id: a.name,
    name: a.name,
    value: a.value,
    isNew: false
  }))
}

//--

type CharacterEditRecordsProps = {
  title: string
  onChange: (newRecords: Array<SimpleModel>) => void
  records: Array<SimpleModel>
}

// TODO: look at https://mui.com/x/react-data-grid/editing/
// need some work on data validation, error reporting
const CharacterEditRecords = ({ title, onChange, records }: CharacterEditRecordsProps) => {
  const [lastCount, setLastCount] = useState(records.length +1)
  const [rows, setRows] = useState(createRows(records))

  useEffect(() => {
    const newRecords: Array<SimpleModel> = rows.map(r => ({ name: r.name, value: r.value }))
    onChange(newRecords)
  }, [rows])

  const waitForScrollToSettle = (container: HTMLElement, callback: () => void, timeout = 100) => {
    let lastScrollTop = container.scrollTop
    let elapsed = 0
    const interval = 25

    const checkScroll = () => {
      const currentScrollTop = container.scrollTop

      if (currentScrollTop !== lastScrollTop) {
        lastScrollTop = currentScrollTop
        elapsed = 0
      } else {
        elapsed += interval
      }

      if (elapsed >= timeout) {
        callback()
      } else {
        setTimeout(checkScroll, interval)
      }
    }

    checkScroll()
  }

  const scrollThenFocusRow = (id: string) => {
    const virtualScroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')
    if (virtualScroller !== null) {
      virtualScroller.scrollTo({
        top: virtualScroller.scrollHeight,
        behavior: 'smooth',
      })

      waitForScrollToSettle(virtualScroller, () => {
        const cell = document.querySelector<HTMLElement>(`[data-id="${id}"] [data-field="name"]`)
        if (cell) {
          cell.focus()
        }
      })
    }
  }

  const handleAddNewRecord = () => {
    const newName = 'New'
    const newId = `${newName}_${lastCount}`
    setRows((oldRows) => [
      ...oldRows,
      { id: newId, name: newName, value: 0, isNew: true },
    ])

    setLastCount((oldValue) => oldValue +1)
    scrollThenFocusRow(newId)
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id))
  }

  const processRowUpdate = (newRow: GridRowData) => {
    const updatedRow = { ...newRow, isNew: false }
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: true
    },
    {
      field: 'value',
      headerName: 'Value',
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key='Delete'
            icon={<DeleteIcon />}
            label='Delete'
            sx={{
              color: 'text.secondary',
            }}            
            onClick={handleDeleteClick(id)}
          />,
        ]
      },
    },
  ]

  return (
    <DataGrid sx={{ border: 'none' }}
      initialState={{
        pagination: { paginationModel: { pageSize: -1 } }
      }}
      pageSizeOptions={[]}
      rows={rows}
      columns={columns}
      editMode='row'
      processRowUpdate={processRowUpdate}
      slots={{
        toolbar: EditToolbar as GridSlots['toolbar'],
      }}
      slotProps={{
        toolbar: { title, addNewRecord: handleAddNewRecord },
      }}
    />
  )
}

//--

type CharacterEditDialogProps = {
  open: boolean
  onClose: () => void
  character: CharacterData
}

// TODO: refactor with a common CharacterEditRecordsDialog ?
export const CharacterEditAttributesDialog = ({ open, onClose, character }: CharacterEditDialogProps) => {
  const [lastRecords, setLastRecords] = useState<Array<SimpleModel>>([])

  const handleCancel = () => {
    onClose()
  }

  const handleApply = () => {
    window.electronAPI.changeCharacterAttributes(character.id, lastRecords)
    onClose()
  }

  const handleChange = (newRecords: Array<SimpleModel>) => {
    setLastRecords(newRecords)
  }

  return (
    <Dialog fullWidth maxWidth='xl' open={open} sx={{
      '& .MuiDialog-paper': {
        height: '100%',
        maxHeight: '80vh',
      }
    }}>
      <DialogContent>
        <CharacterEditRecords
          title='Edit Attributes'
          onChange={handleChange}
          records={character.state.attributes}
        />
      </DialogContent>
      <DialogActions>
        <Button variant='text' onClick={handleCancel}>Cancel</Button>
        <Button variant='contained' onClick={handleApply}>Apply</Button>
      </DialogActions>
    </Dialog>
  )
}

export const CharacterEditAbilitiesDialog = ({ open, onClose, character }: CharacterEditDialogProps) => {
  const [lastRecords, setLastRecords] = useState<Array<SimpleModel>>([])

  const handleCancel = () => {
    onClose()
  }

  const handleApply = () => {
    window.electronAPI.changeCharacterAbilities(character.id, lastRecords)
    onClose()
  }

  const handleChange = (newRecords: Array<SimpleModel>) => {
    setLastRecords(newRecords)
  }

  return (
    <Dialog fullWidth maxWidth='xl' open={open} sx={{
      '& .MuiDialog-paper': {
        height: '100%',
        maxHeight: '80vh',
      }
    }}>
      <DialogContent>
        <CharacterEditRecords
          title='Edit Abilities'
          onChange={handleChange}
          records={character.state.abilities}
        />
      </DialogContent>
      <DialogActions>
        <Button variant='text' onClick={handleCancel}>Cancel</Button>
        <Button variant='contained' onClick={handleApply}>Apply</Button>
      </DialogActions>
    </Dialog>
  )
}