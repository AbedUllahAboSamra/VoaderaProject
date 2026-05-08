import { Component, OnInit, computed, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MasterService } from '../../service/master.service';
import { Employee } from '../../model/class/Employee';
import { CommonModule } from '@angular/common';
import { UbButtonDirective } from '@/app/components/ui/button';
import { ToastService } from '@/app/components/ui/toast.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UbButtonDirective],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  private readonly employeesSignal = signal<Employee[]>([]);
  readonly employees = this.employeesSignal.asReadonly();
  readonly filteredEmployees = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.employees();
    }
    return this.employees().filter(
      (employee) =>
        employee.fullName?.toLowerCase().includes(term) ||
        employee.departmentId.toString()?.toLowerCase().includes(term) ||
        employee.id?.toString().includes(term),
    );
  });

  readonly searchTerm = signal<string>('');
  expandedEmployeeId: number | null = null;
  editingEmployeeId: number | null = null;
  showCreatePanel = false;
  pendingDelete: Employee | null = null;
  isSaving = false;
  isDeleting = false;

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private toast: ToastService,
  ) {
    this.employeeForm = this.fb.group({
      id: [null],

      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      avatarUrl: [''],

      roleId: [null, Validators.required],
      departmentId: [null, Validators.required],
      managerId: [null],

      groupIds: [[]],

      hireDate: [''],
      contractType: ['FULL_TIME', Validators.required],

      salary: [0],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.masterService.getAllEmp().subscribe((res: Employee[]) => {
      this.employeesSignal.set(res ?? []);
      if (!this.expandedEmployeeId && res?.length) {
        this.expandedEmployeeId = res[0].id ?? null;
      }
    });
  }

  toggleExpand(employeeId: number | null | undefined) {
    const targetId = employeeId ?? null;
    this.expandedEmployeeId =
      this.expandedEmployeeId === targetId ? null : targetId;
    if (this.expandedEmployeeId !== this.editingEmployeeId) {
      this.cancelEdit();
    }
  }

  startCreate() {
    this.isSaving = false;
    this.showCreatePanel = true;
    this.editingEmployeeId = null;
    this.expandedEmployeeId = null;
    this.employeeForm.reset({
      employeeId: null,
      fullName: '',
      department: '',
      deptId: null,
      role: '',
      title: '',
      employmentType: '',
      contactNo: '',
      emailId: '',
      location: '',
      timezone: '',
      hireDate: '',
      skills: '',
      tags: '',
    });
  }

  closeCreatePanel() {
    this.isSaving = false;
    this.showCreatePanel = false;
  }

  onEdit(employee: Employee) {
    this.showCreatePanel = false;
    this.editingEmployeeId = employee.id ?? null;
    this.expandedEmployeeId = employee.id ?? null;

    this.employeeForm.patchValue({
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      avatarUrl: employee.avatarUrl,

      roleId: employee.roleId,
      departmentId: employee.departmentId,

      groupIds: employee.groupIds,

      hireDate: employee.hireDate
        ? new Date(employee.hireDate).toISOString().split('T')[0]
        : '',

      contractType: employee.contractType,

      salary: employee.salary,
      isActive: employee.isActive,
    });
  }

  cancelEdit() {
    this.isSaving = false;
    this.editingEmployeeId = null;
    this.employeeForm.reset({
      employeeId: null,
      fullName: '',
      department: '',
      deptId: null,
      role: '',
      title: '',
      employmentType: '',
      contactNo: '',
      emailId: '',
      location: '',
      timezone: '',
      hireDate: '',
      skills: '',
      tags: '',
    });
  }

  promptDelete(employee: Employee) {
    this.pendingDelete = employee;
  }

  confirmDelete(confirmed: boolean) {
    if (!confirmed || !this.pendingDelete?.id) {
      this.pendingDelete = null;
      return;
    }
    const { id, fullName } = this.pendingDelete;
    this.isDeleting = true;
    this.masterService.deleteEmpById(id).subscribe(
      () => {
        this.isDeleting = false;
        this.pendingDelete = null;
        this.employeesSignal.update((list) =>
          list.filter((emp) => emp.id !== id),
        );
        this.toast.success({
          title: 'Employee removed',
          description: `${fullName} has been deleted.`,
        });
        if (this.expandedEmployeeId === id) {
          this.expandedEmployeeId = null;
        }
      },
      () => {
        this.isDeleting = false;
        this.toast.error({
          title: 'Deletion failed',
          description: 'Unable to delete the employee right now.',
        });
      },
    );
  }

  onSave() {
    if (this.employeeForm.valid && !this.isSaving) {
      const employee = this.normalizePayload(this.employeeForm.value);
      this.isSaving = true;
      if (employee.id) {
        // Update existing employee
        this.masterService.updateEmp(employee).subscribe(
          () => {
            this.isSaving = false;
            this.getEmployees();
            this.employeeForm.reset();
            this.toast.success({
              title: 'Employee updated',
              description: 'Employee details were saved successfully.',
            });
            this.editingEmployeeId = null;
          },
          () => {
            this.isSaving = false;
            this.toast.error({
              title: 'Update failed',
              description: 'Something went wrong while saving changes.',
            });
          },
        );
      } else {
        // Create new employee
        this.masterService.saveEmp(employee).subscribe(
          () => {
            this.isSaving = false;
            this.getEmployees();
            this.employeeForm.reset();
            this.toast.success({
              title: 'Employee created',
              description: 'A new employee record is now available.',
            });
            this.showCreatePanel = false;
          },
          () => {
            this.isSaving = false;
            this.toast.error({
              title: 'Creation failed',
              description: 'Unable to save the new employee.',
            });
          },
        );
      }
    }
  }

  updateSearch(term: string) {
    this.searchTerm.set(term);
  }

  private normalizePayload(raw: any): Employee {
    return {
      id: raw.id ?? null,

      fullName: raw.fullName,
      email: raw.email,
      phone: raw.phone,
      avatarUrl: raw.avatarUrl,

      roleId: Number(raw.roleId),
      departmentId: Number(raw.departmentId),

      groupIds: Array.isArray(raw.groupIds) ? raw.groupIds : [],

      hireDate: raw.hireDate ? new Date(raw.hireDate) : new Date(),

      contractType: raw.contractType ?? 'FULL_TIME',

      salary: raw.salary ? Number(raw.salary) : 0,

      isActive: raw.isActive ?? true,

      totalTasksCompleted: 0,
      totalHoursWorked: 0,
      performanceScore: 0,
    };
  }
}
