import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionSheetController, LoadingController, ModalController, NavController} from '@ionic/angular';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import {Place} from '../../place.model';
import {PlacesService} from '../../places.service';
import {Subscription} from 'rxjs';
import {BookingService} from '../../../bookings/booking.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
    selector: 'app-place-detail',
    templateUrl: './place-detail.page.html',
    styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
    place: Place;
    private placeSub: Subscription;
    isBookable: boolean = false;

    constructor(private router: Router,
                private navController: NavController,
                private modalController: ModalController,
                private route: ActivatedRoute,
                private placesService: PlacesService,
                private actionSheetController: ActionSheetController,
                private bookingService: BookingService,
                private loadingController: LoadingController,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(param => {
            if (!param.has('placeId')) {
                this.navController.navigateBack('/places/tabs/offers');
                return;
            }
            this.placeSub = this.placesService.getPlace(param.get('placeId')).subscribe(place => {
                this.place = place;
                this.isBookable = place.userId !== this.authService.userId;
            });
        });
    }

    onBookPlace() {
        this.actionSheetController.create({
            header: 'Choose an Action',
            buttons: [
                {
                    text: 'Select Date',
                    handler: () => {
                        this.openBookingModal('select');
                    }
                },
                {
                    text: 'Random Date',
                    handler: () => {
                        this.openBookingModal('random');
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel' // 'destructive' makes it red
                }
            ]
        }).then(actionSheetEl => {
            actionSheetEl.present();
        });

        // this.router.navigate(['/places/tabs/discover']);
        // this.navController.navigateBack('/places/tabs/discover');
        // this.navController.pop();
    }

    // Interesting fact :)
    openBookingModal(mode: 'select' | 'random') {
        this.modalController.create({
            component: CreateBookingComponent,
            componentProps: {selectedPlace: this.place, selectedMode: mode}
        }).then(modal => {
            modal.present();
            return modal.onDidDismiss();
        }).then(resultData => {
            // Shows data of the dismissed modal
            if (resultData.role === 'confirm') {
                this.loadingController.create({
                    message: 'Booking place...'
                }).then(loadingEl => {
                    loadingEl.present();
                    const data = resultData.data.bookingData;

                    this.bookingService.addBooking(
                        this.place.id,
                        this.place.title,
                        this.place.imageUrl,
                        data.firstName,
                        data.lastName,
                        data.guestNumber,
                        data.dateFrom,
                        data.dateTo
                    ).subscribe(() => {
                        loadingEl.dismiss();
                    });
                });

            }
        });
    }

    ngOnDestroy(): void {
        if (this.placeSub) {
            this.placeSub.unsubscribe();
        }
    }

}
