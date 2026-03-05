import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Signin } from './components/signin/signin';
import { Signup } from './components/signup/signup';

export const routes: Routes = [
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: 'signin', component: Signin },
    { path: 'signup', component: Signup },
    {
        path: '',
        component: Layout,
        children: [
            { path: 'dashboard', component: Dashboard },
        ],
    },
];
