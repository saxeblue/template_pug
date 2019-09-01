/// <reference types="jquery" />

interface JQuery {
  magnificPopup(opts?:any):JQuery;
}

interface JQueryStatic {
  magnificPopup: JQueryMagnificPopupStatic;
}

interface JQueryMagnificPopupStatic {
  open: any;
  close: any;
  (): JQuery;
  parameter(name: string): string;
  parameter(name: string, value: string, append?: boolean): JQuery;
}