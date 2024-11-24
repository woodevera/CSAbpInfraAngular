import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseCoreModule, LocalizationModule, SubscriptionService} from '@abp/ng.core';
import {ConfirmationService} from 'primeng/api';
import {FieldSignatureDto, FormModeEnum, SignatureDataTypeEnum, SignatureDto} from "../../models/models";
import {CommonCrudService} from "../../services/common-crud.service";
import {CommonService} from "../../services/common.service";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputNumberModule} from "primeng/inputnumber";
import {DropdownModule} from "primeng/dropdown";
import {CalendarModule} from "primeng/calendar";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {CommonGridService} from "../../services/common-grid.service";
import {ChipModule} from "primeng/chip";
import {DialogModule} from "primeng/dialog";
import {TooltipModule} from "primeng/tooltip";
import {TableLazyLoadEvent, TableModule} from "primeng/table";
import {ExtractFlagsFromEntityLitePipe} from "../../pipes/extract-flags-from-entity-lite.pipe";
import {IsPrimitivePipe} from "../../pipes/is-primitive.pipe";
import {CrudFilterComponent} from "../crud-filter/crud-filter.component";
import {CrudFormComponent} from "../crud-form/crud-form.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@Component({
  selector: 'app-crud-grid',
  templateUrl: './crud-grid.component.html',
  styleUrls: ['./crud-grid.component.scss'],
  providers: [SubscriptionService,ConfirmationService],
  imports: [
    LocalizationModule,
    BaseCoreModule,
    InputSwitchModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    DialogModule,
    ConfirmPopupModule,
    ChipModule,
    TooltipModule,
    TableModule,
    ExtractFlagsFromEntityLitePipe,
    IsPrimitivePipe,
    CrudFilterComponent,
    CrudFormComponent,
    ConfirmDialogModule
  ],
  standalone: true
})
export class CrudGridComponent implements OnInit , OnDestroy {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() localizationPrefix: string;
  @Input() crudService: any;
  @Input() hiddenGridElements: string[];
  @Input() hiddenFormElements: string[];
  @Input() gridDtoName: string;
  @Input() filterDtoName: string;
  @Input() formDtoName: string;
  @Input() isRtl: boolean;

  @Input() viewTitle: string;
  @Input() viewSubTitle: string;
  @Input() addTitle: string;
  @Input() addSubTitle: string;
  @Input() editTitle: string;
  @Input() editSubTitle: string;

  hiddenFilterElements: string[];

  gridSignature: SignatureDto;
  filterSignature: SignatureDto;
  formSignature: SignatureDto;

  gridFields: FieldSignatureDto[];
  filterElements: FieldSignatureDto[];
  formElements: FieldSignatureDto[];
  filterDto: any;
  formDto: any;

  gridData: any[];
  isFilterVisible: boolean;
  formMode: FormModeEnum;
  selectedDto: any;
  signatureDataTypeEnum: any;
  nonPrimitiveDataTypes: SignatureDataTypeEnum[];
  isFormVisible: boolean;
  constructor(public commonService: CommonService ,
              public gridService: CommonGridService ,
              private confirmationService: ConfirmationService,
              private commonCrudService: CommonCrudService,
              private subscriptionService: SubscriptionService) {
    this.gridData = [];
    this.hiddenGridElements ??= [];
    this.signatureDataTypeEnum = SignatureDataTypeEnum;
    this.nonPrimitiveDataTypes = [SignatureDataTypeEnum.Enum , SignatureDataTypeEnum.Date];
    this.filterElements = [];

  }
  /*
  * Function Used To on Init ( load data in case of event fired from grid service )
  * Created By : Mahmoud Radwan
  * Created On : 6/4/2022
  */
  ngOnInit(): void {

    if(!this.hiddenGridElements){
      this.hiddenGridElements = [];
    }
    if(!this.hiddenFormElements){
      this.hiddenFormElements = [];
    }

    this.hiddenGridElements = [...this.hiddenGridElements , 'concurrencyStamp' , 'editing' , 'id'];
    this.hiddenFormElements = [...this.hiddenFormElements , 'concurrencyStamp' , 'editing' , 'id'];
    this.hiddenFilterElements = ['skipCount' , 'maxResultCount' , 'id'];

    this.commonCrudService.getSignatures(this.filterDtoName , this.gridDtoName , this.formDtoName).subscribe(res => {
      if(res?.length > 0){
        res.forEach(ele => {
          if(ele.name === this.filterDtoName && !this.filterSignature) {
            this.filterSignature = ele;
          } else if (ele.name === this.gridDtoName && !this.gridSignature){
            this.gridSignature = ele;
          } else if (ele.name === this.formDtoName && !this.formSignature){
            this.formSignature = ele;
          }
        });

        /* get gird fields to render data */
        this.gridFields = this.commonCrudService.getSignatureElements(this.gridSignature , this.hiddenGridElements);
        /* get filter fields */
        this.filterElements = this.commonCrudService.getSignatureElements(this.filterSignature , this.hiddenFilterElements);
        /* get form Fields */
        this.formElements = this.commonCrudService.getSignatureElements(this.formSignature , this.hiddenFormElements);

        /* get filter dto */
        this.filterDto = this.commonCrudService.getSignatureDto(this.filterElements , this.filterDto);
        /* get form dto */
        this.formDto = this.commonCrudService.getSignatureDto(this.formElements , this.formDto);

        this.reloadData();
        this.subscriptionService.addOne(this.gridService.loadDataEvent , event => {
          if(event) {
            this.loadData(event);
          }
        });
      }
    });
  }

  /*
  * Function Used To open form
  * Created By : Mahmoud Radwan
  * Created On : 6/4/2022
  */
  openForm() {
    this.isFormVisible = true;
  }

  /*
  * Function Used To init search criteria and hits back end to get required data
  * Created By : Mahmoud Radwan
  * Created On : 6/4/2022
  */
  loadData(event: TableLazyLoadEvent) {
    if(this.filterDto) {
      this.gridService.currentRows = event.rows;
      this.gridService.currentFirst = event.first;
      this.filterDto.skipCount = this.gridService.currentFirst;
      this.filterDto.maxResultCount = this.gridService.currentRows;
      this.subscriptionService.addOne(this.crudService.getList(this.filterDto) , res => {
        const resData = res as any;
        this.gridData = resData.items;
        this.gridService.totalCount = resData.totalCount;
      });
    }
  }
  /*
  * Function Used To reset paging and reload data
  * Created By : Mahmoud Radwan
  * Created On : 6/4/2022
  */
  reloadData() {
    this.loadData({first: this.gridService.currentFirst, rows: this.gridService.currentRows});
  }


  /*
  * Function Used To handle after filter event
  * Created By : Mahmoud Radwan
  * Created On : 6/4/2022
  */
  afterFilter(event: any) {
    this.filterDto = event;
    this.reloadData();
  }
  /*
  * Function Used To add entity
  * Created By : Mahmoud Radwan
  * Created On : 6/4/2022
  */
  add() {
    this.formMode = FormModeEnum.Add;
    this.selectedDto = this.formDto;
    this.openForm();
  }
  /*
  * Function Used To open form in view mode
  * Created By : Mahmoud Radwan
  * Created On : 6/4/2022
  */
  view(data: any) {
    this.formMode = FormModeEnum.View;
    this.setSelectedData(data);
  }
  /*
  * Function Used To open form in edit mode
  * Created By : Mahmoud Radwan
  * Created On : 6/4/2022
  */
  edit(data: any) {
    this.formMode = FormModeEnum.Edit;
    this.setSelectedData(data);
  }
  /*
  * Function Used To set selected Dto
  * Created By : Mahmoud Radwan
  * Created On : 6/4/2022
  */
  setSelectedData(data: any){
    this.selectedDto = data;
    this.openForm();
  }
  /*
  * Function Used To apply delete functionality
  * Created By : Mahmoud Radwan
  * Created On : 6/4/2022
  */
  delete(data: any) {
    this.commonService.confirmDelete(this.confirmationService).then(res => {
      if(res) {
        this.postDelete(data);
      }
    });
  }
  /*
  * Function Used To post delete to backend
  * Created By : Mahmoud Radwan
  * Created On : 6/4/2022
  */
  postDelete(data: any){
    this.subscriptionService.addOne(this.crudService.delete(data.id) , () => {
      this.commonService.showSuccessToast();
      this.reloadData();
    });
  }
  /*
  * Function Used To close all subscriptions and apply additional logic on destroy
  * Created By : Mahmoud Radwan
  * Created On : 6/4/2022
  */
  ngOnDestroy(): void {
    this.subscriptionService.closeAll();
  }

}
