import { Component, inject, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task.service';
import { Task } from '../task.models';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormComponent],
  template: `
    <div class="task-list">
      <div class="header">
        <h1>Tasks</h1>
        <p>All Tasks</p>
        <p>{{ filteredTasks().length }} records</p>
      </div>
      <div class="actions">
        <button (click)="showNewTaskForm()">New Task</button>
        <button (click)="refreshTasks()">Refresh</button>
        <input type="text" placeholder="Search" [(ngModel)]="searchTerm" (ngModelChange)="filterTasks()">
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Comments</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let task of filteredTasks(); trackBy: trackById">
            <td><input type="checkbox"></td>
            <td>{{ task.assignedTo }}</td>
            <td>{{ task.status }}</td>
            <td>{{ task.dueDate }}</td>
            <td>{{ task.priority }}</td>
            <td>{{ task.comments }}</td>
            <td>
              <button (click)="editTask(task)">Edit</button>
              <button (click)="deleteTask(task.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <!-- Add pagination controls here -->
      </div>
    </div>
    <app-task-form 
      *ngIf="showForm"
      [taskToEdit]="selectedTask" 
      (formSubmit)="onFormSubmit($event)" 
      (formCancel)="hideForm()">
    </app-task-form>
  `,
  styles: [`.task-list {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .header h1 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  .header p {
    font-size: 14px;
    color: #777;
  }
  
  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .actions button {
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;
    border: none;
    background-color: #ffc107;
    color: #333;
    cursor: pointer;
  }
  
  .actions button:hover {
    background-color: #ffca2c;
  }
  
  .actions input[type="text"] {
    padding: 10px;
    width: 200px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  table th, table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  table th {
    background-color: #f9f9f9;
    font-weight: bold;
    font-size: 14px;
    color: #555;
  }
  
  table td {
    font-size: 14px;
    color: #333;
  }
  
  table td button {
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  
  table td button:first-child {
    background-color: #28a745;
    color: white;
  }
  
  table td button:last-child {
    background-color: #dc3545;
    color: white;
  }
  
  table td button:hover {
    opacity: 0.9;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .pagination button {
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    cursor: pointer;
  }
  
  .pagination button:hover {
    background-color: #e9e9e9;
  }
  
  .pagination .active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
  `]
})
export class TaskListComponent {
  taskService = inject(TaskService);
  tasks = this.taskService.getTasks();  // Signal<Task[]>
  searchTerm = '';
  showForm = false;
  selectedTask: Task | null = null;

  // Define filteredTasks as a computed signal
  filteredTasks = computed(() => {
    const tasks = this.tasks();  // Get tasks array from the signal
    return tasks.filter(task =>
      task.assignedTo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      task.comments.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  });

  showNewTaskForm() {
    this.selectedTask = null;
    this.showForm = true;
  }

  editTask(task: Task) {
    this.selectedTask = task;
    this.showForm = true;
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id);
  }

  onFormSubmit(task: Task) {
    if (this.selectedTask) {
      this.taskService.updateTask(task);
    } else {
      this.taskService.addTask(task);
    }
    this.hideForm();
  }

  hideForm() {
    this.showForm = false;
    this.selectedTask = null;
  }

  refreshTasks() {
    // No need to manually refresh filteredTasks since it's computed
  }

  filterTasks() {
    // Just updating searchTerm will automatically trigger recomputation of filteredTasks
  }

  trackById(index: number, task: Task): number {
    return task.id;
  }
}
