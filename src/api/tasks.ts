import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db } from '../firebase'
import type { Task } from '../types'

const col = collection(db, 'tasks')

export const onTasks = (ownerUid: string, date: string, cb: (items: Task[])=>void) => {
  const q = query(col, where('ownerUid','==', ownerUid), where('date','==', date), orderBy('order','asc'))
  return onSnapshot(q, s=>{
    const arr = s.docs.map(d=> ({ id:d.id, ...(d.data() as any) })) as Task[]
    cb(arr)
  })
}

export const createTask = (ownerUid: string, date: string, title: string) => {
  return addDoc(col, { ownerUid, date, title, done:false, order: Date.now(), createdAt: serverTimestamp() })
}

export const toggleTask = (id: string, done: boolean) => updateDoc(doc(db, 'tasks', id), { done })

export const setTaskOrder = (id: string, order: number) => updateDoc(doc(db, 'tasks', id), { order })

export const deleteTask = (id: string) => deleteDoc(doc(db, 'tasks', id))