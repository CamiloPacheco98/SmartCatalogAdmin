import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    imports: [CommonModule]
})
export class SidebarComponent {
    menuItems = [
        {
            label: 'Home',
            icon: '🏠',
            route: '/dashboard/home',
            active: true
        },
        {
            label: 'Orders',
            icon: '🛒',
            route: '/dashboard/orders',
            active: false
        },
        {
            label: 'Users',
            icon: '👤',
            route: '/dashboard/users',
            active: false
        }
    ];

    constructor(private router: Router) { }

    navigateTo(route: string) {
        this.router.navigate([route]);
        this.updateActiveItem(route);
    }

    private updateActiveItem(route: string) {
        this.menuItems.forEach(item => {
            item.active = item.route === route;
        });
    }
}
