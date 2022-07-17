import { useQueryClient, useMutation } from 'react-query'
import useStore from '../store'
import { supabase } from '../utils/supabase'
import { Task, EditedTask } from '../types/types'

export const useMutateTask = () => {
  const queryClient = useQueryClient()

  //zustandからタスクのリセット関数を取得
  const reset = useStore((state) => state.resetEditedTask)

  //タスクの新規作成関数とキャッシュの更新（supabase + reactquery + zustand）
  const createTaskMutation = useMutation(
    async (task: Omit<Task, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('todos').insert(task)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        //todosのキャッシュキーに紐付いているデータを取得
        const previousTodos = queryClient.getQueryData<Task[]>('todos')
        if (previousTodos) {
          //キャッシュを更新 res[0]=supabaseからデータを取得した要素はiつしか無いが配列なので[0]で取得し追加
          queryClient.setQueryData('todos', [...previousTodos, res[0]])
        }
        //編集中のタスク状態をリセット
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  //タスクの更新関数
  const updateTaskMutation = useMutation(
    //変更したい新しいタスクを取得
    async (task: EditedTask) => {
      const { data, error } = await supabase
        .from('todos')
        .update({ title: task.title })
        .eq('id', task.id) //updateとdeleteではidを指定する必要がある
      if (error) throw new Error(error.message)
      return data
    },
    {
      //variableは引数に指定したidとtitleを取得するために必要
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('todos')
        if (previousTodos) {
          queryClient.setQueryData(
            'todos',
            previousTodos.map((task) =>
              task.id === variables.id ? res[0] : task
            )
          )
        }
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  //タスクの削除関数
  const deleteTaskMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase.from('todos').delete().eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (_, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('todos')
        if (previousTodos) {
          queryClient.setQueryData(
            'todos',
            //削除したタスクを除いたタスクを返す
            previousTodos.filter((task) => task.id !== variables)
          )
        }
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  return { deleteTaskMutation, createTaskMutation, updateTaskMutation }
}