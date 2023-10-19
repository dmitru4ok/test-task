import { Component, OnDestroy } from '@angular/core';

import { DataService } from '../shared/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-conversion',
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.css']
})
export class ConversionComponent implements OnDestroy{

  private selectChangesSubscription: Subscription;
  private value1Subscription: Subscription | undefined;
  private value2Subscription: Subscription | undefined;

  protected chosenRates = {direct: 1, reverse: 1};
  protected form = new FormGroup({
    'curr1': new FormControl(null, Validators.required),
    'curr2': new FormControl(null, Validators.required) 
  });
  protected conversionForm = new FormGroup({
    'value1': new FormControl(1, [Validators.required, Validators.min(0)]),
    'value2': new FormControl(1, [Validators.required, Validators.min(0)])
  });

  constructor(public dataService: DataService) {
    this.selectChangesSubscription = this.form.valueChanges.subscribe(() => {
      if (this.form.valid){
        const curr1 = this.form.value.curr1 ? this.form.value.curr1 : 'USD';
        const curr2 = this.form.value.curr2 ? this.form.value.curr2 : 'UAH';
        this.chosenRates = dataService.getConversionRate(curr1 , curr2);
        this.conversionForm.patchValue({'value1': this.conversionForm.value.value1});
        console.log(this.chosenRates);
      } 
    }
    );

    this.value1Subscription = this.conversionForm.get('value1')?.valueChanges
    .subscribe((data: number | null) => {
      if (data != null) {
        this.conversionForm.patchValue({'value2': +(data * this.chosenRates.direct).toFixed(2)}, {emitEvent: false});
      }
    });

    this.value2Subscription = this.conversionForm.get('value2')?.valueChanges
    .subscribe((data: number | null) => {
      if (data != null) {
        this.conversionForm.patchValue({'value1': +(data * this.chosenRates.reverse).toFixed(2)}, {emitEvent: false});
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
