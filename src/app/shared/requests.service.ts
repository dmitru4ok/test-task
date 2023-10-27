import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Rates } from './rates.model';
import { Subject, map, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private newRates: {[currency: string]: Rates} = {};
  public fetching = true;
  public dataChanged = new Subject<void>();
  private readonly digitPrecision = 7;
  private readonly apiLink = 'https://api.fxratesapi.com/latest';
  private readonly queryList; 
  public readonly supportedCurrencies = ['USD', 'EUR', 'UAH', 'CAD', 'PLN', 'GBP', 'CHF', 'JPY', 'CNY'];

  constructor(private http: HttpClient) {
    this.queryList = this.supportedCurrencies.join(',');
  }

  public updateExchangeRatesForCurrency(currency: string) {
    let myParams = new HttpParams();
    myParams = myParams
    .append('api_key', environment.currencyAPIKey)
    .append('currencies', this.queryList)
    .append('places', this.digitPrecision)
    .set('base', currency);
    return this.http.get<{'rates': Rates, [key: string]: any}>
            (this.apiLink, {params: myParams})
            .pipe(map(data => data.rates),
              tap(datarates=> {
              this.newRates[currency] = datarates;
            }
    ));
  }

  public updateCurrencyRates() {
    this.newRates = {};
    this.fetching = true;
    for (let currency of this.supportedCurrencies){
      this.updateExchangeRatesForCurrency(currency)
      .subscribe(data =>  {
      //  console.log(currency, data);
       if (Object.entries(this.newRates).length === this.supportedCurrencies.length) {
        this.fetching = false;
       }
      });
    }
    return this.newRates;
  }
}
