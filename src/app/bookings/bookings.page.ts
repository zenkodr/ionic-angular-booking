import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from './booking.service';
import {Booking} from './booking.model';
import {IonItemSliding, LoadingController} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
    loadedBookings: Array<Booking>;
    bookingsSub: Subscription;

    constructor(public bookingService: BookingService, private loadingController: LoadingController) {
    }

    ngOnInit() {
        this.bookingsSub = this.bookingService.bookings.subscribe(bookings => {
            this.loadedBookings = bookings;
        });
    }

    onCancelBooking(bookingId: string, slidingBooking: IonItemSliding) {
        slidingBooking.close();
        this.loadingController.create({
            message: 'Canceling...'
        }).then(loadinEl => {
            loadinEl.present();
            this.bookingService.cancelBooking(bookingId).subscribe(() => {
                loadinEl.dismiss();
            });
        });
    }

    ngOnDestroy(): void {
        if (this.bookingsSub) {
            this.bookingsSub.unsubscribe();
        }
    }

}
