import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { UsersComponent } from './components/users/users.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderDetailsComponent } from './components/orders/order-details/order-details.component';

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
                path: 'orders',
                component: OrdersComponent
            },
            {
                path: 'orders/:id',
                component: OrderDetailsComponent
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


