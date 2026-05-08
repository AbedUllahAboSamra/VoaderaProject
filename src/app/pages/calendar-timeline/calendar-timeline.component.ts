import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MasterService } from '../../service/master.service';
import { CalendarViewComponent } from '../../components/calendar-view/calendar-view.component';
import { TimelineViewComponent } from '../../components/timeline-view/timeline-view.component';
import { GanttViewComponent } from '../../components/gantt-view/gantt-view.component';

export interface IScheduleData {
  milestones: IMilestone[];
  dueDates: IDueDate[];
  projectTimelines: IProjectTimeline[];
  upcomingReminders: IDueDate[];
  totalProjects: number;
  totalMilestones: number;
  totalDueDates: number;
}

export interface IMilestone {
  id: string;
  projectId: number;
  projectName: string;
  clientName: string;
  label: string;
  description: string;
  date: string;
  state: 'completed' | 'in-progress' | 'blocked' | 'upcoming';
  actorName: string;
  type: 'timeline' | 'milestone';
}

export interface IDueDate {
  id: string;
  projectId: number;
  projectName: string;
  label: string;
  description: string;
  dueDate: string;
  status?: string;
  ownerName?: string;
  type: 'timeline-due' | 'milestone-due' | 'readiness';
}

export interface IProjectTimeline {
  projectId: number;
  projectName: string;
  clientName: string;
  startDate: string;
  endDate: string | null;
  status: string;
  leadName: string;
  leadDepartment: string;
}

@Component({
  selector: 'app-calendar-timeline',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CalendarViewComponent,
    TimelineViewComponent,
    GanttViewComponent,
  ],
  templateUrl: './calendar-timeline.component.html',
  styleUrls: ['./calendar-timeline.component.css'],
})
export class CalendarTimelineComponent implements OnInit {
  private readonly masterService = inject(MasterService);

  readonly scheduleDataSignal = signal<IScheduleData | null>(null);
  readonly scheduleData = this.scheduleDataSignal.asReadonly();
  readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();
  readonly activeTabSignal = signal<'calendar' | 'timeline' | 'gantt'>(
    'calendar',
  );
  readonly activeTab = this.activeTabSignal.asReadonly();

  readonly calendarEvents = computed(() => {
    const data = this.scheduleData();
    if (!data) return [];

    const events: Array<any> = [];

    data.milestones.forEach((milestone) => {
      const date = new Date(milestone.date);
      if (!isNaN(date.getTime())) {
        events.push({
          id: milestone.id,
          title: milestone.label,
          date: date,
          type: 'milestone',
          projectId: milestone.projectId,
          projectName: milestone.projectName,
          description: milestone.description || '',
          state: milestone.state,
        });
      }
    });

    data.dueDates.forEach((dueDate) => {
      const date = new Date(dueDate.dueDate);
      if (!isNaN(date.getTime())) {
        events.push({
          id: dueDate.id,
          title: dueDate.label,
          date: date,
          type: 'due-date',
          projectId: dueDate.projectId,
          projectName: dueDate.projectName,
          description: dueDate.description || '',
          status: dueDate.status,
        });
      }
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  readonly timelineProjects = computed(() => {
    const data = this.scheduleData();
    if (!data) return [];
    return data.projectTimelines;
  });

  readonly ganttData = computed(() => {
    const data = this.scheduleData();
    if (!data) return [];
    return data.projectTimelines.map((project) => ({
      ...project,
      start: new Date(project.startDate),
      end: project.endDate ? new Date(project.endDate) : null,
      duration: project.endDate
        ? Math.ceil(
            (new Date(project.endDate).getTime() -
              new Date(project.startDate).getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : null,
    }));
  });

  readonly upcomingReminders = computed(() => {
    const data = this.scheduleData();
    if (!data) return [];
    return data.upcomingReminders;
  });

  ngOnInit(): void {
    this.loadScheduleData();
  }

  loadScheduleData(): void {
    const mockData: IScheduleData = {
      totalProjects: 3,
      totalMilestones: 4,
      totalDueDates: 4,

      milestones: [
        {
          id: 'm1',
          projectId: 1,
          projectName: 'POS System',
          clientName: 'Internal',
          label: 'UI Design Completed',
          description: 'Finished dashboard UI',
          date: '2026-05-01',
          state: 'completed',
          actorName: 'Ahmed Ali',
          type: 'milestone',
        },
        {
          id: 'm2',
          projectId: 1,
          projectName: 'POS System',
          clientName: 'Internal',
          label: 'API Integration',
          description: 'Connecting backend APIs',
          date: '2026-05-10',
          state: 'in-progress',
          actorName: 'Sara',
          type: 'milestone',
        },
        {
          id: 'm3',
          projectId: 2,
          projectName: 'CRM Platform',
          clientName: 'Client A',
          label: 'Planning Phase',
          description: 'Requirement analysis',
          date: '2026-05-03',
          state: 'completed',
          actorName: 'Mohammed',
          type: 'milestone',
        },
        {
          id: 'm4',
          projectId: 2,
          projectName: 'CRM Platform',
          clientName: 'Client A',
          label: 'Development Phase',
          description: 'Core development',
          date: '2026-05-15',
          state: 'upcoming',
          actorName: 'Team',
          type: 'milestone',
        },
      ],

      dueDates: [
        {
          id: 'd1',
          projectId: 1,
          projectName: 'POS System',
          label: 'Submit Report',
          description: 'Final report submission',
          dueDate: '2026-05-09',
          status: 'pending',
          ownerName: 'Ahmed Ali',
          type: 'timeline-due',
        },
        {
          id: 'd2',
          projectId: 2,
          projectName: 'CRM Platform',
          label: 'Code Review',
          description: 'Review backend code',
          dueDate: '2026-05-06',
          status: 'pending',
          ownerName: 'Sara',
          type: 'milestone-due',
        },
        {
          id: 'd3',
          projectId: 3,
          projectName: 'Website Revamp',
          label: 'UI Freeze',
          description: 'Freeze design system',
          dueDate: '2026-05-12',
          status: 'upcoming',
          ownerName: 'Ali',
          type: 'readiness',
        },
        {
          id: 'd4',
          projectId: 3,
          projectName: 'Website Revamp',
          label: 'Deployment',
          description: 'Production release',
          dueDate: '2026-05-20',
          status: 'upcoming',
          ownerName: 'DevOps',
          type: 'timeline-due',
        },
      ],

      projectTimelines: [
        {
          projectId: 1,
          projectName: 'POS System',
          clientName: 'Internal',
          startDate: '2026-05-01',
          endDate: '2026-05-20',
          status: 'in_progress',
          leadName: 'Ahmed Ali',
          leadDepartment: 'Frontend',
        },
        {
          projectId: 2,
          projectName: 'CRM Platform',
          clientName: 'Client A',
          startDate: '2026-05-02',
          endDate: '2026-06-01',
          status: 'review',
          leadName: 'Sara Mohammad',
          leadDepartment: 'Backend',
        },
        {
          projectId: 3,
          projectName: 'Website Revamp',
          clientName: 'Client B',
          startDate: '2026-05-05',
          endDate: null,
          status: 'planning',
          leadName: 'Ali',
          leadDepartment: 'UI/UX',
        },
      ],

      upcomingReminders: [
        {
          id: 'r1',
          projectId: 1,
          projectName: 'POS System',
          label: 'Reminder: Report',
          description: 'Prepare weekly report',
          dueDate: '2026-05-08',
          status: 'urgent',
          ownerName: 'Ahmed Ali',
          type: 'timeline-due',
        },
        {
          id: 'r2',
          projectId: 2,
          projectName: 'CRM Platform',
          label: 'Reminder: Review',
          description: 'Code review session',
          dueDate: '2026-05-06',
          status: 'pending',
          ownerName: 'Sara',
          type: 'milestone-due',
        },
      ],
    };

    this.scheduleDataSignal.set(mockData);

    // this.loadingSignal.set(true);
    // this.masterService.getScheduleData().subscribe({
    //   next: (data: IScheduleData) => {
    //     this.scheduleDataSignal.set(data);
    //     this.loadingSignal.set(false);
    //   },
    //   error: (error) => {
    //     console.error('Error loading schedule data:', error);
    //     this.loadingSignal.set(false);
    //   },
    // });
  }

  setActiveTab(tab: 'calendar' | 'timeline' | 'gantt'): void {
    this.activeTabSignal.set(tab);
  }

  getDaysUntilDue(dueDate: string): number {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  isOverdue(dueDate: string): boolean {
    return this.getDaysUntilDue(dueDate) < 0;
  }

  isDueSoon(dueDate: string): boolean {
    const daysUntil = this.getDaysUntilDue(dueDate);
    return daysUntil >= 0 && daysUntil <= 7;
  }
}
