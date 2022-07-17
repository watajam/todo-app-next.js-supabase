import { FormEvent, VFC } from 'react'
import { supabase } from '../utils/supabase'
import useStore from '../store'
import { useMutateTask } from '../hooks/useMutateTask'

export const TaskForm: VFC = () => {
  //状態管理
  const { editedTask } = useStore() //editTaksの状態
  const update = useStore((state) => state.updateEditedTask) //state更新関数

  //タスクの作成と更新
  const { createTaskMutation, updateTaskMutation } = useMutateTask()

  //タスクの作成と更新をidを元に実行
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedTask.id === '')
   //mutateでタスク作成
      createTaskMutation.mutate({
        title: editedTask.title,
        user_id: supabase.auth.user()?.id, //ログインユーザーのid
      })
    else {
    //mutateで編集
      updateTaskMutation.mutate({
        id: editedTask.id,
        title: editedTask.title,
      })
    }
  }
  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        className="my-2 rounded border border-gray-300 px-3 py-2 text-sm  placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
        placeholder="New task ?"
       //編集ボタン押下後、fromに表示される
        value={editedTask.title}
        //文字を入力する事で状態を更新する
        onChange={(e) => update({ ...editedTask, title: e.target.value })}
      />
      <button
        type="submit"
        className="ml-2 rounded bg-indigo-600 px-3 py-2 text-sm font-medium  text-white hover:bg-indigo-700 "
      >
        {editedTask.id ? 'Update' : 'Create'}
      </button>
    </form>
  )
}