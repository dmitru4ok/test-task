import { Component, OnDestroy } from '@angular/core';

import { DataService } from '../shared/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, pairwise } from 'rxjs';

@Component({
  selector: 'app-conversion',
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.css']
})
export class ConversionComponent implements OnDestroy{

  private selectChangesSubscription: Subscription;
  private value1Subscription: Subscription | undefined;
  private value2Subscription: Subscription | undefined;

  protected chosenRate = 1;
  protected reverseChosenRate = 1;
  protected form = new FormGroup({
    'curr1': new FormControl(null, Validators.required),
    'curr2': new FormControl(null, Validators.required) 
  });
  protected conversionForm = new FormGroup({
    'value1': new FormControl(1, [Validators.required, Validators.min(0)]),
    'value2': new FormControl(1, [Validators.required, Validators.min(0)])
  });

  constructor(public dataService: DataService) {
    this.selectChangesSubscription = this.form.valueChanges.pipe(pairwise()).subscribe(([prev, curr]) => {
      if (this.form.valid){
        const curr1 = this.form.value.curr1 ? this.form.value.curr1 : 'USD';
        const curr2 = this.form.value.curr2 ? this.form.value.curr2 : 'UAH';
        this.chosenRate = dataService.getConversionRate(curr1 , curr2);
        this.reverseChosenRate = dataService.getConversionRate(curr2, curr1);
        // this.conversionForm.patchValue({'value1': this.conversionForm.value.value1});
        console.log(this.chosenRate, this.reverseChosenRate, prev, curr);
        if (prev.curr1 !== curr.curr1) {
          this.conversionForm.patchValue({'value2': this.conversionForm.value.value2});
        } else {
          this.conversionForm.patchValue({'value1': this.conversionForm.value.value1});
        }
      } 
    }
    );

    this.value1Subscription = this.conversionForm.get('value1')?.valueChanges
    .subscribe((data: number | null) => {
      if (data != null) {
        this.conversionForm.patchValue({'value2': +(data * this.chosenRate).toFixed(2)}, {emitEvent: false});
      }
    });

    this.value2Subscription = this.conversionForm.get('value2')?.valueChanges
    .subscribe((data: number | null) => {
      if (data != null) {
        this.conversionForm.patchValue({'value1': +(data  * this.reverseChosenRate).toFixed(2)}, {emitEvent: false});
      }
    });
  }


  ngOnDestroy(): void {
    this.selectChangesSubscription.unsubscribe();
    this.value1Subscription?.unsubscribe();
    this.value2Subscription?.unsubscribe();
  }

  // updateCurrency2(event: number) {
  //   this.currency2 = event * this.chosenRates.direct;
  // }

  // updateCurrency1(event: number) {
  //   this.currency1 = event * this.chosenRates.reverse;
  // }

}
