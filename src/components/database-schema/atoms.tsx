import { atom } from 'recoil';


/**
 * Holds the column properties, per table.
 *
 * Using Recoil, just for the sake of using recoil. Can remove it
 * as a dependency by moving this to `UserSelectionContext`.
 */
export const tableColumnPropertiesAtom = atom<{
  [tableName: string]: {
    [columnName: string]: {
      visible: boolean
    }
  }
}>({
  key: 'tableColumnProperties',
  default: {}
})
