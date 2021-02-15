# Poligon

## color range module

1. Color labels that can be used to color style any element

a) setting - adding/removing/modifying value ranges e.g.
0 - 100 ("red")
100 - 150.5 ("blue")
150.5 - 300 ("green")

b) can be used by getting color by value (second value is default color if out of range) and setting it to visualise data (numbers)

```
  setBgColor(price: number): string {
    return this.colorRangeService.getColorByValue(price, 'green');
  }
```

c) angular material modals dialogs to update/delete

## coin API websockets

1.

## coin API - table template (data source)

1. data table module

a) basic table

- dataSource RxJS-way
- one object based describing table data
- auto sort
- auto format
- force refresh/observable..
- filter data (client-side)

```
<app-basic-table
    title="Coin API - Trades /latest"
    subtitle="Awesome table"
    [dataSource]="dataSourceTrades"
  ></app-basic-table>
```

### basicTableDataSource:

table data source (generic class; gets 2 params: columns definitions, observable table data [from service] )

```
 dataSourceExchanges: BasicTableDataSource<ICoinApiExchanges> = new BasicTableDataSource(
    this.prepTableColumnsDefinitionOrderBook(),
    this.coinService.getOrderBook$()
  );
```

column definition (field types [enum] determines if column is sorted - string, number, date.. custom if set)

```
  prepTableColumnsDefinitionOrderBook(): ITableColumn[] {
    return [
      {
        caption: 'Id',
        propName: 'symbol_id',
        type: TableColumnFieldType.string,
      },
      {
        caption: 'exchange time',
        propName: 'time_exchange',
        type: TableColumnFieldType.dateMedium,
      },
      {
        caption: 'exchange time (coin API)',
        propName: 'time_coinapi',
        type: TableColumnFieldType.dateMedium,
      },
    ];
  }
```

b) expanded row ()

- custom template for expanded data

```

<app-basic-table
    title="Coin API - Quotes"
    subtitle="Awesome table"
    [dataSource]="dataSourceQuotes"
  >
    <ng-template #expandedRow let-element>
      <div>
        <h4>{{element?.propName}} !</h4>
        </div>
    </ng-template>
</app-basic-table>

```

#

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
