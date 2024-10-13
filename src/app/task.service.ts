import { Injectable, signal } from '@angular/core';
import { Task } from './task.models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = signal<Task[]>([
    { id: 1, assignedTo: 'User 1', status: 'Completed', dueDate: '2024-10-12', priority: 'Low', comments: 'This task is good' },
    { id: 2, assignedTo: 'User 2', status: 'In Progress', dueDate: '2024-09-14', priority: 'High', comments: 'This' },
    { id: 3, assignedTo: 'User 3', status: 'Not Started', dueDate: '2024-08-18', priority: 'Low', comments: 'This' },
    { id: 4, assignedTo: 'User 4', status: 'In Progress', dueDate: '2024-06-12', priority: 'Normal', comments: 'This task is good' }
  ]);

  getTasks() {
    return this.tasks.asReadonly();
  }

  addTask(task: Omit<Task, 'id'>) {
    this.tasks.update(tasks => [...tasks, { ...task, id: tasks.length + 1 }]);
  }

  updateTask(updatedTask: Task) {
    this.tasks.update(tasks => 
      tasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
  }

  deleteTask(id: number) {
    this.tasks.update(tasks => tasks.filter(task => task.id !== id));
  }

  refreshTasks() {
    this.tasks.set([...this.tasks()]);
  }
}