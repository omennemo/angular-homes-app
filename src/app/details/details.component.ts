import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../housing-location';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <article *ngIf="housingLocation">
      <img class="listing-photo" [src]="housingLocation.photo" alt="Photo of {{ housingLocation.name }}">
      <section class="listing-description">
        <h2 class="listing-heading">{{ housingLocation.name }}</h2>
        <p class="listing-location">{{ housingLocation.city }}, {{ housingLocation.state }}</p>
      </section>
      <section class="listing-features">
        <h2 class="listing-heading">About this listing</h2>
        <ul>
          <li> Units Available: {{ housingLocation.availableUnits }}</li>
          <li> Does this location have WiFi: {{ housingLocation.wifi ? 'Yes' : 'No' }}</li>
          <li> Does this location have Laundry: {{ housingLocation.laundry ? 'Yes' : 'No' }}</li>
        </ul>
      </section>
      <section class="listing-apply">
        <h2 class="listing-heading">Apply to live here now</h2>

        <form [formGroup]="applyForm" (submit)="submitApplication()">
          <label for="firstName">First Name</label>
          <input id="first-name" formControlName="firstName" type="text">

          <label for="lastName">Last Name</label>
          <input id="last-name" formControlName="lastName" type="text">

          <label for="email">Email</label>
          <input id="email" formControlName="email" type="email">

          <button type="submit" class="primary">Apply</button>
        </form>
      </section>
    </article>
  `,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  route: ActivatedRoute= inject(ActivatedRoute);
  housingService: HousingService = inject(HousingService);
  housingLocation : HousingLocation | undefined;
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  constructor(){
    const housingLocationId = Number(this.route.snapshot.params['id']);
    this.housingService.getHousingLocationById(housingLocationId).then((location) => {
      this.housingLocation = location;
    });
  }

  submitApplication() {
    this.housingService.submitApplication(this.applyForm.value.firstName ?? '',
        this.applyForm.value.lastName ?? '',
        this.applyForm.value.email ?? '', );
  }
}
