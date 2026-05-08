// import { Component, OnInit, computed, signal, inject } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { MasterService } from '../../service/master.service';
// import { DatePipe, CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { ToastService } from '@/app/components/ui/toast.service';
// import { UbButtonDirective } from '@/app/components/ui/button';
// import { ITask, TASKS_DATA } from '@/app/model/interface/master';

// @Component({
//   selector: 'app-project',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, UbButtonDirective, RouterLink],
//   providers: [DatePipe],
//   templateUrl: './project.component.html',
//   styleUrls: ['./project.component.css'], // Corrected from styleUrl to styleUrls
// })
// export class ProjectComponent implements OnInit {
//   protected readonly routerLinkDirective = RouterLink;
//   private readonly masterSrv = inject(MasterService);
//   private readonly datePipe = inject(DatePipe);
//   private readonly toast = inject(ToastService);
//   private readonly fb = inject(FormBuilder);

//   ngOnInit(): void {
//     console.log('sssssssss');
//     this.getProjects();
//   }
//   private readonly projectsSignal = signal<ITask[]>([]);
//   readonly projects = this.projectsSignal.asReadonly();
//   readonly searchTerm = signal<string>('');
//   readonly filteredProjects = computed(() => {
//     const term = this.searchTerm().trim().toLowerCase();
//     if (!term) {
//       return this.projects();
//     }
//     return this.projects().filter((project) => {
//       return (
//         project.taskTitle?.toLowerCase().includes(term) ||
//         project.clientName?.toLowerCase().includes(term) ||
//         project.contactPerson?.toLowerCase().includes(term) ||
//         project.startDate?.toLowerCase().includes(term)
//       );
//     });
//   });

//   projectForm: FormGroup = this.fb.group({
//     projectId: [null],
//     projectName: ['', Validators.required],
//     clientName: ['', Validators.required],
//     startDate: ['', Validators.required],
//     leadByEmpId: [null],
//     contactPerson: [''],
//     contactNo: [''],
//     emailId: ['', Validators.email],
//   });

//   expandedProjectId: number | null = null;
//   editingProjectId: number | null = null;
//   showCreatePanel = false;
//   pendingDelete: ITask | null = null;
//   isSaving = false;
//   isDeleting = false;

//   getProjects() {
//     this.projectsSignal.set(TASKS_DATA);

//     if (!this.expandedProjectId && TASKS_DATA.length) {
//       this.expandedProjectId = TASKS_DATA[0].taskId ?? null;
//     }
//   }

//   onEdit(id: number) {
//     const project = this.projects().find((p) => p.taskId === id);
//     if (!project) {
//       return;
//     }
//     this.showCreatePanel = false;
//     this.editingProjectId = id;
//     this.expandedProjectId = id;
//     this.projectForm.patchValue({
//       ...project,
//       startDate: project.startDate ? project.startDate.substring(0, 10) : '',
//     });
//   }

//   onDelete(id: number) {
//     const project = this.projects().find((p) => p.taskId === id);
//     if (!project) return;
//     this.pendingDelete = project;
//   }

//   confirmDelete(confirmed: boolean) {
//     // if (!confirmed || !this.pendingDelete?.projectId) {
//     //   this.pendingDelete = null;
//     //   return;
//     // }
//     // const { projectId, projectName } = this.pendingDelete;
//     // this.isDeleting = true;
//     // this.masterSrv.deleteProjectById(projectId).subscribe(
//     //   () => {
//     //     this.isDeleting = false;
//     //     this.pendingDelete = null;
//     //     this.projectsSignal.update((list) =>
//     //       list.filter((project) => project.projectId !== projectId)
//     //     );
//     //     this.toast.success({
//     //       title: 'Project deleted',
//     //       description: `${projectName} has been removed.`,
//     //     });
//     //     if (this.expandedProjectId === projectId) {
//     //       this.expandedProjectId = null;
//     //     }
//     //   },
//     //   () => {
//     //     this.isDeleting = false;
//     //     this.toast.error({
//     //       title: 'Delete failed',
//     //       description: 'Something went wrong while removing the project.',
//     //     });
//     //   }
//     // );
//   }

//   toggleExpand(projectId: number | null | undefined) {
//     const target = projectId ?? null;
//     this.expandedProjectId = this.expandedProjectId === target ? null : target;
//     if (this.expandedProjectId !== this.editingProjectId) {
//       this.cancelEdit();
//     }
//   }

//   startCreate() {
//     this.isSaving = false;
//     this.showCreatePanel = true;
//     this.editingProjectId = null;
//     this.expandedProjectId = null;
//     const today = new Date().toISOString().substring(0, 10);
//     this.projectForm.reset({
//       projectId: null,
//       projectName: '',
//       clientName: '',
//       startDate: today,
//       leadByEmpId: null,
//       contactPerson: '',
//       contactNo: '',
//       emailId: '',
//     });
//   }

//   closeCreatePanel() {
//     this.isSaving = false;
//     this.showCreatePanel = false;
//   }

//   cancelEdit() {
//     this.isSaving = false;
//     this.editingProjectId = null;
//     this.projectForm.reset({
//       projectId: null,
//       projectName: '',
//       clientName: '',
//       startDate: '',
//       leadByEmpId: null,
//       contactPerson: '',
//       contactNo: '',
//       emailId: '',
//     });
//   }

//   updateSearch(term: string) {
//     this.searchTerm.set(term);
//   }

//   onSave() {
//     // if (this.projectForm.invalid) {
//     //   this.toast.error({
//     //     title: 'Incomplete details',
//     //     description: 'Please fill all required fields before saving.',
//     //   });
//     //   return;
//     // }
//     // if (this.isSaving) {
//     //   return;
//     // }
//     // const project: IProject = {
//     //   ...this.projectForm.value,
//     //   startDate: this.projectForm.value.startDate,
//     // };
//     // this.isSaving = true;
//     // if (project.projectId) {
//     //   this.masterSrv.updateProject(project).subscribe(
//     //     () => {
//     //       this.isSaving = false;
//     //       this.getProjects();
//     //       this.toast.success({
//     //         title: 'Project updated',
//     //         description: 'Changes have been saved successfully.',
//     //       });
//     //       this.cancelEdit();
//     //     },
//     //     () => {
//     //       this.isSaving = false;
//     //       this.toast.error({
//     //         title: 'Update failed',
//     //         description: 'Unable to update the project right now.',
//     //       });
//     //     }
//     //   );
//     // } else {
//     //   this.masterSrv.saveProject(project as any).subscribe(
//     //     () => {
//     //       this.isSaving = false;
//     //       this.getProjects();
//     //       this.toast.success({
//     //         title: 'Project created',
//     //         description: 'A new project is now tracked in the system.',
//     //       });
//     //       this.showCreatePanel = false;
//     //       this.cancelEdit();
//     //     },
//     //     () => {
//     //       this.isSaving = false;
//     //       this.toast.error({
//     //         title: 'Creation failed',
//     //         description: 'Unable to create project right now.',
//     //       });
//     //     }
//     //   );
//     // }
//   }

//   formattedDate(date: string | null | undefined) {
//     if (!date) {
//       return '—';
//     }
//     return this.datePipe.transform(date, 'MMM d, y') ?? date;
//   }
// }
import { Component, OnInit, computed, signal, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MasterService } from '../../service/master.service';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '@/app/components/ui/toast.service';
import { UbButtonDirective } from '@/app/components/ui/button';
import { ITask, TASKS_DATA } from '@/app/model/interface/master';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UbButtonDirective, RouterLink],
  providers: [DatePipe],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  protected readonly routerLinkDirective = RouterLink;

  private readonly masterSrv = inject(MasterService);
  private readonly datePipe = inject(DatePipe);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.getProjects();
  }

  private readonly projectsSignal = signal<ITask[]>([]);

  readonly projects = this.projectsSignal.asReadonly();

  readonly searchTerm = signal<string>('');

  readonly filteredProjects = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.projects();
    }

    return this.projects().filter((project) => {
      return (
        project.taskTitle?.toLowerCase().includes(term) ||
        project.clientName?.toLowerCase().includes(term) ||
        project.contactPerson?.toLowerCase().includes(term) ||
        project.startDate?.toLowerCase().includes(term)
      );
    });
  });

  projectForm: FormGroup = this.fb.group({
    taskId: [null],

    taskTitle: ['', Validators.required],

    clientName: ['', Validators.required],

    startDate: ['', Validators.required],

    leadByEmpId: [null],

    employeeName: [''],

    contactPerson: [''],

    contactNo: [''],

    emailId: ['', Validators.email],

    status: ['todo'],

    progress: [0],

    health: ['good'],

    categories: [[]],

    tags: [[]],

    blockers: [[]],

    overview: this.fb.group({
      summary: [''],
      objectives: [[]],
      successCriteria: [[]],
    }),

    timeline: [[]],

    documents: [[]],

    createdAt: [''],
  });

  expandedProjectId: number | null = null;

  editingProjectId: number | null = null;

  showCreatePanel = false;

  pendingDelete: ITask | null = null;

  isSaving = false;

  isDeleting = false;

  getProjects() {
    this.projectsSignal.set(TASKS_DATA);

    if (!this.expandedProjectId && TASKS_DATA.length) {
      // this.expandedProjectId = TASKS_DATA[0].taskId ?? null;
    }
  }

  onEdit(id: number) {
    const project = this.projects().find((p) => p.taskId === id);

    if (!project) {
      return;
    }

    this.showCreatePanel = false;
    this.editingProjectId = id;
    this.expandedProjectId = id;

    this.projectForm.patchValue({
      ...project,
      startDate: project.startDate ? project.startDate.substring(0, 10) : '',
    });
  }

  onDelete(id: number) {
    const project = this.projects().find((p) => p.taskId === id);

    if (!project) return;

    this.pendingDelete = project;
  }

  confirmDelete(confirmed: boolean) {
    if (!confirmed || !this.pendingDelete?.taskId) {
      this.pendingDelete = null;
      return;
    }

    const { taskId, taskTitle } = this.pendingDelete;

    this.isDeleting = true;

    setTimeout(() => {
      this.projectsSignal.update((list) =>
        list.filter((project) => project.taskId !== taskId),
      );

      this.isDeleting = false;

      this.pendingDelete = null;

      this.toast.success({
        title: 'Task deleted',
        description: `${taskTitle} has been removed.`,
      });

      if (this.expandedProjectId === taskId) {
        this.expandedProjectId = null;
      }
    }, 500);
  }

  toggleExpand(projectId: number | null | undefined) {
    const target = projectId ?? null;

    this.expandedProjectId = this.expandedProjectId === target ? null : target;

    if (this.expandedProjectId !== this.editingProjectId) {
      this.cancelEdit();
    }
  }

  startCreate() {
    this.isSaving = false;

    this.showCreatePanel = true;

    this.editingProjectId = null;

    this.expandedProjectId = null;

    const today = new Date().toISOString().substring(0, 10);

    this.projectForm.reset({
      taskId: null,
      taskTitle: '',
      clientName: '',
      startDate: today,
      leadByEmpId: null,
      employeeName: '',
      contactPerson: '',
      contactNo: '',
      emailId: '',
      status: 'todo',
      progress: 0,
      health: 'good',
      categories: [],
      tags: [],
      blockers: [],
      overview: {
        summary: '',
        objectives: [],
        successCriteria: [],
      },
      timeline: [],
      documents: [],
      createdAt: today,
    });
  }

  closeCreatePanel() {
    this.isSaving = false;

    this.showCreatePanel = false;
  }

  cancelEdit() {
    this.isSaving = false;

    this.editingProjectId = null;

    this.projectForm.reset({
      taskId: null,
      taskTitle: '',
      clientName: '',
      startDate: '',
      leadByEmpId: null,
      employeeName: '',
      contactPerson: '',
      contactNo: '',
      emailId: '',
      status: 'todo',
      progress: 0,
      health: 'good',
      categories: [],
      tags: [],
      blockers: [],
      overview: {
        summary: '',
        objectives: [],
        successCriteria: [],
      },
      timeline: [],
      documents: [],
      createdAt: '',
    });
  }

  updateSearch(term: string) {
    this.searchTerm.set(term);
  }

  onSave() {
    if (this.projectForm.invalid) {
      this.toast.error({
        title: 'Incomplete details',
        description: 'Please fill all required fields before saving.',
      });

      return;
    }

    if (this.isSaving) {
      return;
    }

    this.isSaving = true;

    const task: ITask = {
      ...this.projectForm.value,
    };

    if (task.taskId) {
      this.projectsSignal.update((list) =>
        list.map((item) =>
          item.taskId === task.taskId ? { ...item, ...task } : item,
        ),
      );

      this.toast.success({
        title: 'Task updated',
        description: 'Changes have been saved successfully.',
      });
    } else {
      const newTask: ITask = {
        ...task,
        taskId: Date.now(),
      };

      this.projectsSignal.update((list) => [newTask, ...list]);

      this.toast.success({
        title: 'Task created',
        description: 'A new task is now tracked in the system.',
      });
    }

    this.isSaving = false;

    this.showCreatePanel = false;

    this.cancelEdit();
  }

  formattedDate(date: string | null | undefined) {
    if (!date) {
      return '—';
    }

    return this.datePipe.transform(date, 'MMM d, y') ?? date;
  }
}
