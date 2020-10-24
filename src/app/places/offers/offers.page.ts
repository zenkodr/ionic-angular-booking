import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';
import {IonItemSliding} from '@ionic/angular';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-offers',
    templateUrl: './offers.page.html',
    styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
    offers: Array<Place>;
    private placesSub: Subscription;

    constructor(private placesService: PlacesService,
                private router: Router) {
    }

    ngOnInit() {
        this.placesSub = this.placesService.places.subscribe(places => {
            this.offers = places;
        });
    }

    // Better update of comcponents to fix the issue of caching
    ionViewDidEnter() {

    }

    onEdit(offerId: string, slidingItem: IonItemSliding) {
        slidingItem.close();
        this.router.navigate(['/', 'places', 'tabs', 'offers', offerId]);
    }

    ngOnDestroy(): void {
        if (this.placesSub) {
            this.placesSub.unsubscribe();
        }
    }

}
