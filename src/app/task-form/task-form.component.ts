import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../task.models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="task-form">
      <h2>{{ taskToEdit ? 'Edit Task' : 'New Task' }}</h2>
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div>
          <label for="assignedTo">Assigned To *</label>
          <select id="assignedTo" formControlName="assignedTo">
            <option value="User 1">User 1</option>
            <option value="User 2">User 2</option>
            <option value="User 3">User 3</option>
            <option value="User 4">User 4</option>
          </select>
        </div>
        <div>
          <label for="status">Status *</label>
          <select id="status" formControlName="status">
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label for="dueDate">Due Date</label>
          <input type="date" id="dueDate" formControlName="dueDate">
        </div>
        <div>
          <label for="priority">Priority *</label>
          <select id="priority" formControlName="priority">
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label for="comments">Comments</label>
          <textarea id="comments" formControlName="comments"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" (click)="onCancel()">Cancel</button>
          <button type="submit" [disabled]="!taskForm.valid">Save</button>
        </div>
      </form>
    </div>
  `,
  styles: [`.task-form {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 20px auto;
    font-family: Arial, sans-serif;
  }
  
  .task-form h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }
  
  .task-form label {
    font-weight: 600;
    font-size: 14px;
    color: #333;
  }
  
  .task-form select,
  .task-form input[type="date"],
  .task-form textarea {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    color: #555;
  }
  
  .task-form select:focus,
  .task-form input[type="date"]:focus,
  .task-form textarea:focus {
    border-color: #5c9cff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
  }
  
  .task-form textarea {
    resize: vertical;
    height: 80px;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .form-actions button {
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  
  .form-actions button[type="submit"] {
    background-color: #28a745;
    color: white;
  }
  
  .form-actions button[type="submit"]:disabled {
    background-color: #6c757d;
  }
  
  .form-actions button[type="button"] {
    background-color: #dc3545;
    color: white;
  }
  
  .form-actions button:hover {
    opacity: 0.9;
  }
  `]
})
export class TaskFormComponent {
  @Input() taskToEdit: Task | null = null;
  @Output() formSubmit = new EventEmitter<Task>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  
  taskForm = this.fb.group({
    assignedTo: ['', Validators.required],
    status: ['', Validators.required],
    dueDate: [''],
    priority: ['', Validators.required],
    comments: ['']
  });

  ngOnInit() {
    if (this.taskToEdit) {
      this.taskForm.patchValue(this.taskToEdit);
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const task: Task = {
        id: this.taskToEdit ? this.taskToEdit.id : 0,
        ...this.taskForm.value
      } as Task;
      this.formSubmit.emit(task);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
