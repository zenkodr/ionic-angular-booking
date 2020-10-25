import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {PlacesService} from '../../places.service';
import {Place} from '../../place.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-edit-offer',
    templateUrl: './edit-offer.page.html',
    styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
    place: Place;
    placeId: string;
    form: FormGroup;
    isLoading: boolean = false;

    private placeSub: Subscription;

    constructor(
        private navController: NavController,
        private route: ActivatedRoute,
        private placesService: PlacesService,
        private router: Router,
        private loadingController: LoadingController,
        private alertController: AlertController) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(param => {
            if (!param.has('placeId')) {
                this.navController.navigateBack('/places/tabs/offers');
                return;
            }
            this.placeId = param.get('placeId');
            this.isLoading = true;
            this.placeSub = this.placesService.getPlace(param.get('placeId')).subscribe(place => {
                    this.place = place;
                    this.form = new FormGroup({
                        title: new FormControl(this.place.title, {
                            updateOn: 'blur',
                            validators: [Validators.required]
                        }),
                        description: new FormControl(this.place.description, {
                            updateOn: 'blur',
                            validators: [Validators.required, Validators.maxLength(180), Validators.minLength(1)]
                        })
                    });
                    this.isLoading = false;
                },
                err => {
                    console.log(err);
                    // Showing alert message if wrong url passed
                    this.alertController.create({
                        header: 'Error Occured',
                        message: 'Place could not be fetched. Please try again later.',
                        buttons: [{
                            text: 'Okay',
                            handler: () => {
                                this.router.navigate(['/places/tabs/offers']);
                            }
                        }]
                    }).then(alertEl => {
                        alertEl.present();
                    });
                });

        });
    }

    onUpdateOffer() {
        if (!this.form.valid) {
            return;
        }
        this.loadingController.create({
            message: 'Updating Place...'
        }).then(loadingEl => {
            loadingEl.present();
            // no need to cleat one time observale - take(1)
            this.placesService.updatePlace(
                this.place.id,
                this.form.value.title,
                this.form.value.description
            ).subscribe(() => {
                loadingEl.dismiss();
                this.form.reset();
                this.router.navigate(['/places/tabs/offers']);
            });
        });

    }

    ngOnDestroy(): void {
        if (this.placeSub) {
            this.placeSub.unsubscribe();
        }
    }

}
