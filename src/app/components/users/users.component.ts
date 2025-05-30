import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { UserModel } from '../../models/user.model';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';
import { NgForm } from '@angular/forms';
import { UserPipe } from '../../pipes/user.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SharedModule, UserPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  users: UserModel[] = [];
  search: string = '';

  @ViewChild('createModalCloseBtn') createModalCloseBtn:
    | ElementRef<HTMLButtonElement>
    | undefined;
  @ViewChild('updateModalCloseBtn') updateModalCloseBtn:
    | ElementRef<HTMLButtonElement>
    | undefined;

  createModel: UserModel = new UserModel();
  updateModel: UserModel = new UserModel();

  constructor(private http: HttpService, private swal: SwalService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.http.post<UserModel[]>('Users/GetAll', {}, (res) => {
      this.users = res;
    });
  }

  create(form: NgForm) {
    if (form.valid) {
      this.http.post<string>('Users/Create', this.createModel, (res) => {
        this.swal.callToast(res);
        this.createModel = new UserModel();
        this.createModalCloseBtn?.nativeElement.click();
        this.getAll();
      });
    }
  }

  deleteById(model: UserModel) {
    this.swal.callSwal(
      'Kullanıcıyı Sil?',
      `${model.fullName} Kullanıcısını silmek istiyor musunuz?`,
      () => {
        this.http.post<string>('Users/DeleteById', { id: model.id }, (res) => {
          this.getAll();
          this.swal.callToast(res, 'info');
        });
      }
    );
  }

  get(model: UserModel) {
    this.updateModel = { ...model };
  }

  update(form: NgForm) {
    if (form.valid) {
      this.http.post<string>('Users/Update', this.updateModel, (res) => {
        this.swal.callToast(res, 'info');
        this.updateModalCloseBtn?.nativeElement.click();
        this.getAll();
      });
    }
  }
}
