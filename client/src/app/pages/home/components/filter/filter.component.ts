import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Subscription } from "rxjs";
import { StoreService } from "src/app/services/store.service";

@Component({
  selector: "app-filter",
  templateUrl: "filter.component.html",
  styles: [],
})
export class FilterComponent implements OnInit, OnDestroy {
  constructor(private storeService: StoreService) {}
  categoriesSubscription: Subscription | undefined;
  @Output() showCategory = new EventEmitter<string>();
  categories: string[] | undefined = [];

  onShowCategory(category: string): void {
    this.showCategory.emit(category);
  }

  ngOnInit(): void {
    this.categoriesSubscription = this.storeService
      .getAllCategories()
      .subscribe((response) => {
        this.categories = response;
      });
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}
