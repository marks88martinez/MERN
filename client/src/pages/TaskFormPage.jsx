import {useForm} from 'react-hook-form'
import { useTasks } from '../context/TasksContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);


function TaskFormPage() {
  const {register, handleSubmit, setValue} = useForm();
  const {createTask, getTask, updateTask} = useTasks();
  const navigate = useNavigate()
  const params = useParams()
 // console.log(createTask);

  useEffect(()=>{
    async function  loadTask(){
      if (params.id) {
        const task = await getTask(params.id)
        console.log(task);
         setValue('title', task.title)
         setValue('description', task.description)
      }
      console.log(params);
    }

    loadTask()
  },[])

  const onSubmit = handleSubmit((data)=>{
   if (params.id) {
   
    updateTask(params.id,{
      ...data,
      date:dayjs.utc(data.date).format()
    });
   } else {
    createTask({
      ...data,
      date:dayjs.utc(data.date).format()
    });
  }
  navigate('/tasks')
  })
  return (
    <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input type="text" placeholder='title'  className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        { ...register('title')}
       
        autoFocus
        />
         <label htmlFor="Description">Description</label>
        <textarea name="" rows="3" placeholder='Description' className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
          { ...register("description")}
        ></textarea>
         <label htmlFor="Date">Date</label>
         <input type="date"
         className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
         {...register('date')} />
        
        <button className='bg-indigo-500 px-3 py-2 rounded-md '>
          Save
        </button>

      </form>
    </div>
  )
}

export default TaskFormPage