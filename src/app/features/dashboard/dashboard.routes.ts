import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { UsersComponent } from './components/users/users.component';

export const dashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardLayoutComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'users',
                component: UsersComponent
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
    }
];


