import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {NgForm} from '@angular/forms';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    isLoading: boolean = false;
    isLogin: boolean = true;

    constructor(private authService: AuthService,
                private router: Router,
                public loadingController: LoadingController) {
    }

    ngOnInit() {
    }

    onLogin() {
        this.isLoading = true;
        this.authService.login();
        this.loadingController.create({
            keyboardClose: true,
            message: 'Logging in...'
        }).then(loadingEl => {
            loadingEl.present();
            setTimeout(() => {
                this.isLoading = false;
                loadingEl.dismiss();
                this.router.navigateByUrl('/places/tabs/discover');
            }, 1500);
        });
    }

    onSubmit(f: NgForm) {
        if (!f.valid) {
            return;
        }

        const email = f.value.email;
        const password = f.value.password;
        console.log(email, password);

        if (this.isLogin) {
            // send request login

        } else {
            // send request signup
        }

    }

    onSwitchAuthMode() {
        this.isLogin = !this.isLogin;
    }

    onLogout() {
        this.authService.logout();
    }

}
