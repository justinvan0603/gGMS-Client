import { Component } from '@angular/core';

import { SmartTablesService } from './smartTables.service';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';

import { BasicExampleLoadService } from './basic-example-load.service';

import 'style-loader!./smartTables.scss';
import { Http } from '@angular/http/src/http';
import { CourseService } from "../../services/course.service";
import { IDomain } from "./domain.interface";
@Component({
  selector: 'smart-tables',
  templateUrl: './smartTables.html'
})
export class SmartTables {

   settings = {

     add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {

      // id: {
      //   title: 'Id'
      // },
    
      DOMAIN_ID: {
        title: 'DOMAIN_ID'
      },
      DOMAIN: {
        title: 'DOMAIN'
      }
    }
  };

  data2: IDomain[] = [];
  ngOnInit(){
		this.getItems();
   
	}

  getItems(){
		this._courseService.getItems().subscribe(      
			(data: IDomain[]) => {
        this.data2 = data
       this.source = new LocalDataSource(this.data2);
        
      }
      
		);
	}

  source: LocalDataSource;

  constructor(private _courseService: SmartTablesService) {
  //  this.source = new LocalDataSource(this.data2);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
        this._courseService.deleteItem(event.data.Id).subscribe(
        event.confirm.resolve(event.data)
		);   
    } else {
      event.confirm.reject();
    }
  }

  onSaveConfirm(event): void {
    event.newData['name'] += ' + added in code';
   
    this._courseService.editItem(event.newData).subscribe(
      event.confirm.resolve(event.newData)

		);   
    
  }

  onCreateConfirm(event): void {

      event.newData['name'] += ' + added in code';
     this._courseService.addItem(event.newData).subscribe(
        event.confirm.resolve(event.newData)
		);
    this.data2.push(event.newData);
    
  }



}
