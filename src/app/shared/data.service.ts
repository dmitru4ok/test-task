import { Injectable } from '@angular/core';
import { Rates } from './rates.model';
import { RequestsService } from '../shared/requests.service';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  public conversionRates!: {[currency: string]: Rates} | null;
  
  
  constructor(public requests: RequestsService) { }

  public getConversionRate(from: string, to: string): number {
    return this.conversionRates![from][to];
  }

  public updateRates() {
    this.conversionRates = null;
    this.requests.updateCurrencyRates().subscribe((data) => {
      this.conversionRates = data;
    });
  }
}
