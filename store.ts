import create from 'zustand'
import { EditedTask, EditedNotice } from './types/types'

type State = {
  editedTask: EditedTask
  editedNotice: EditedNotice
  updateEditedTask: (payload: EditedTask) => void
  updateEditedNotice: (payload: EditedNotice) => void
  resetEditedTask: () => void
  resetEditedNotice: () => void
}
const useStore = create<State>((set) => ({
  //初期設定オブジェクト
  editedTask: { id: '', title: '' },
  editedNotice: { id: '', content: '' },

  //state更新関数
  updateEditedTask: (payload) =>
    set({
      editedTask: {
        id: payload.id,
        title: payload.title,
      },
    }),
  //stateリセット関数
  resetEditedTask: () => set({ editedTask: { id: '', title: '' } }),

  updateEditedNotice: (payload) =>
    set({
      editedNotice: {
        id: payload.id,
        content: payload.content,
      },
    }),
  resetEditedNotice: () => set({ editedNotice: { id: '', content: '' } }),
}))
export default useStore
