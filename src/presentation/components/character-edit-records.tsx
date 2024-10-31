import { useState } from 'react'
import Stack from '@mui/material/Stack'
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

import { EntityId, Attribute, CharacterSheet } from '../../domain/common/types'

//--

type EditToolbarProps = {
  title: string,
  addNewRecord: () => void
}

const EditToolbar = ({ title, addNewRecord }: EditToolbarProps) => {
  return (
    <GridToolbarContainer sx={{ padding: 0, mb: 1 }}>
      <Typography variant='h6' color='primary' marginRight={1}>{title}</Typography>
      <Button size='small' variant='outlined' color='primary' startIcon={<AddIcon />} onClick={addNewRecord}>
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
  onApply: (newRecords: Array<SimpleModel>) => void,
  records: Array<SimpleModel>
}

// TODO: look at https://mui.com/x/react-data-grid/editing/
// need some work on data validation, error reporting
const CharacterEditRecords = ({ title, onApply, records }: CharacterEditRecordsProps) => {
  const [lastCount, setLastCount] = useState(records.length +1)
  const [rows, setRows] = useState(createRows(records))
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const handleApply= () => {
    const newRecords: Array<SimpleModel> = rows.map(r => ({ name: r.name, value: r.value }))
    onApply(newRecords)
  }

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
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    {
      field: 'value',
      headerName: 'Value',
      type: 'number',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
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
    <Stack padding={2}>
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
      <Button variant='contained' color='primary' onClick={handleApply} fullWidth>
        Apply
      </Button>
    </Stack>
  )
}

//--

type CharacterEditProps = {
  character: CharacterSheet
}

export const CharacterEditAttributes = ({ character }: CharacterEditProps) => {

  const handleApply = (newRecords: Array<SimpleModel>) => {
    window.electronAPI.changeCharacterAttributes(character.id, newRecords)
  }

  return (
    <CharacterEditRecords
      title='Edit Attributes'
      onApply={handleApply}
      records={character.attributes}
    />
  )
}

export const CharacterEditAbilities = ({ character }: CharacterEditProps) => {

  const handleApply = (newRecords: Array<SimpleModel>) => {
    window.electronAPI.changeCharacterAbilities(character.id, newRecords)
  }

  return (
    <CharacterEditRecords
      title='Edit Abilities'
      onApply={handleApply}
      records={character.abilities}
    />
  )
}