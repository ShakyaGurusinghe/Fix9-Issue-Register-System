import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },
            // Add new pages here as children, e.g.:
            // { path: 'projects', component: Projects },
            // { path: 'issues',   component: Issues   },
            // { path: 'profile',  component: Profile  },
        ],
    },
];
