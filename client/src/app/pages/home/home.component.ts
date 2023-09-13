import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Product } from "src/app/models/product.model";
import { CartService } from "src/app/services/cart.service";
import { StoreService } from "src/app/services/store.service";

const ROWS_HEIGHT: { [id: number]: number } = {
  1: 400,
  3: 335,
  4: 350,
};

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styles: [],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private cartService: CartService,
    private storeService: StoreService
  ) {}
  windowWidth: number = 0;
  cols: number = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string | undefined;
  products: Array<Product> | undefined;
  sort = "desc";
  count = "12";
  productsSubription: Subscription | undefined;

  onColumnsChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }

  onItemsCountChange(newCount: number): void {
    this.count = newCount.toString();
    this.getProducts();
  }

  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts();
  }

  getProducts(): void {
    this.productsSubription = this.storeService
      .getAllProducts(this.count, this.sort, this.category)
      .subscribe((_products) => (this.products = _products));
  }

  ngOnInit(): void {
    this.getProducts();
    this.windowWidth = window.innerWidth;
  }

  ngOnDestroy(): void {
    if (this.productsSubription) this.productsSubription.unsubscribe();
  }

  @HostListener("window:resize", ["$event"])
  onResize(): void {
    this.windowWidth = window.innerWidth;
  }
}
