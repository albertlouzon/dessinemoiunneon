import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable()
export class ExcelService {
  constructor() { }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log(worksheet);
    if (!worksheet['!cols']) {
      worksheet['!cols'] = [];
    }
    const colSizes = this.adjustCols(json);
    console.log('col sizes: ', colSizes);
    colSizes.forEach((size) => {
      worksheet['!cols'].push({ width: size });
    });
    console.log('end : ', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

  adjustCols(arrayOfCaca: Array<{}>) {
    const result = [];
    for (const col in arrayOfCaca[0]) {
      console.log('one column: ', col);
      if (col === 'email') {
        result.push(50);
      } else if (col === 'nom' || col === 'prenom') {
        result.push(50);
      } else {
        result.push(20);
      }
    }
    return result;
  }
}
