import { Injectable } from '@angular/core';
import { Rates } from './rates.model';
import { RequestsService } from '../shared/requests.service';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  private conversionRates: {[currency: string]: Rates} = {};
  
  
  constructor(public requests: RequestsService) { }

  public getConversionRate(from: string, to: string): {'direct': number, 'reverse': number} {
    return {direct: this.conversionRates[from][to], reverse: this.conversionRates[to][from]};
  }

   public updateRates() {
    const newRates = this.requests.updateCurrencyRates();
    this.conversionRates = newRates;
    // console.log(this.conversionRates);
  }
}
