import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowEditStopReasons,
  GridSlots,
} from '@mui/x-data-grid'

import { CharacterData } from '../../domain/character/character'

//--

type EditToolbarProps = {
  title: string,
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
  name: string,
  value: number
}

type GridRowData = SimpleModel & {
  id: string,
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
  onChange: (newRecords: Array<SimpleModel>) => void,
  records: Array<SimpleModel>
}

// TODO: look at https://mui.com/x/react-data-grid/editing/
// need some work on data validation, error reporting
const CharacterEditRecords = ({ title, onChange, records }: CharacterEditRecordsProps) => {
  const [lastCount, setLastCount] = useState(records.length +1)
  const [rows, setRows] = useState(createRows(records))
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  useEffect(() => {
    const newRecords: Array<SimpleModel> = rows.map(r => ({ name: r.name, value: r.value }))
    onChange(newRecords)
  }, [rows])

  const handleAddNewRecord = () => {
    const newName = 'New'
    const newId = `${newName}_${lastCount}`
    setRows((oldRows) => [
      ...oldRows,
      { id: newId, name: newName, value: 0, isNew: true },
    ])

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newId]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }))

    setLastCount((oldValue) => oldValue +1)
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id))
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.id === id)
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  const processRowUpdate = (newRow: GridRowData) => {
    const updatedRow = { ...newRow, isNew: false }
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
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
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key='Save'
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key='Cancel'
              icon={<CancelIcon />}
              label='Cancel'
              sx={{
                color: 'text.primary',
              }}
              onClick={handleCancelClick(id)}
            />,
          ]
        }

        return [
          <GridActionsCellItem
            key='Edit'
            icon={<EditIcon />}
            label='Edit'
            sx={{
              color: 'text.primary',
            }}
            onClick={handleEditClick(id)}
          />,
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
      rows={rows}
      columns={columns}
      editMode='row'
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      onRowEditStop={handleRowEditStop}
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