import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { PlanService } from '../../services/plan.service';
import { Plan } from '../../models/plan.model';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
  ],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss',
})

export class PlansComponent implements OnInit {
  plans: Plan[] = [];
  filteredPlans: Plan[] = [];
  showAddPlanForm: boolean = false;
  newPlan: Plan = { title: '', days: [], meals: [] };
  loading: boolean = true;

  daysOfWeek: string[] = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDay: string = 'All';

  // constructor(private planService: PlanService) {}

  constructor() {}

  filterByDay(day: string): void {
    this.selectedDay = day;
    if (day === 'All') {
      this.filteredPlans = [...this.plans];
    } else {
      this.filteredPlans = this.plans.filter(plan => plan.days.includes(day));
    }
  }

  ngOnInit(): void {
    this.loadPlans();
  }

  async getAllPlans(): Promise<Plan[]> {
    return [
      {
        title: 'Low Carb Meal Plan',
        days: ['Monday', 'Wednesday', 'Friday'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        updatedAt: new Date()
      },
      {
        title: 'Weekly Healthy Meals',
        days: ['Tuesday', 'Thursday'],
        meals: ['Breakfast', 'Snack-1', 'Dinner'],
        updatedAt: new Date('2024-12-14')
      },
      {
        title: 'Weekly Healthy Meals',
        days: ['Tuesday', 'Thursday'],
        meals: ['Breakfast', 'Snack-1', 'Dinner'],
        updatedAt: new Date('2024-12-14')
      },
      {
        title: 'Weekly Healthy Meals',
        days: ['Tuesday', 'Thursday'],
        meals: ['Breakfast', 'Snack-1', 'Dinner'],
        updatedAt: new Date('2024-12-14')
      },
      {
        title: 'Weight Loss Plan',
        days: ['Saturday', 'Sunday'],
        meals: ['Breakfast', 'Lunch', 'Snack-2'],
        updatedAt: new Date('2024-12-15')
      }
    ];
  }

  async loadPlans(): Promise<void> {
    try {
      this.plans = await this.getAllPlans();
      this.filteredPlans = [...this.plans];
      this.loading = false;
    } catch (error) {
      console.error('Failed to load plans', error);
      this.loading = false;
    }
  }

  toggleAddPlanForm(): void {
    this.showAddPlanForm = true;
  }

  // to be removed, only use when applying dummy data
  async savePlan(): Promise<void> {
    if (this.newPlan.title) {
      const newDummyPlan: Plan = {
        ...this.newPlan,
        id: (this.plans.length + 1).toString(),
        updatedAt: new Date(),
      };

      this.plans.push(newDummyPlan);
      this.newPlan = { title: '', days: [], meals: [] };
      this.showAddPlanForm = false;
    }
  }

  // async savePlan(): Promise<void> {
  //   if (this.newPlan.title) {
  //     await this.planService.addPlan(this.newPlan);
  //     this.newPlan = { title: '', days: [], meals: [] };
  //     this.showAddPlanForm = false;
  //     this.loadPlans();
  //   }
  // }
}
