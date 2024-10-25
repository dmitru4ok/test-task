import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Rates } from './rates.model';
import { forkJoin, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private readonly digitPrecision = 7;
  private readonly apiLink = 'https://api.fxratesapi.com/latest';
  private readonly queryList;
  public readonly supportedCurrencies = ['USD', 'EUR', 'UAH', 'CAD', 'PLN', 'GBP', 'CHF', 'JPY', 'CNY'];

  constructor(readonly http: HttpClient) {
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
            .pipe(map(data => data.rates));
  }

  public updateCurrencyRates() {
    return forkJoin(this.supportedCurrencies.map((curr) => this.updateExchangeRatesForCurrency(curr)))
    .pipe(
      map((data) => {
        return data.reduce<{[curr: string]: Rates}>((result, rate, index) => {
          result[this.supportedCurrencies[index]] = rate;
          return result;
        }, {});
      })
    );
  }
}
