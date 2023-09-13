import { Component, Input, OnInit } from "@angular/core";
import { Cart, CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styles: [],
})
export class HeaderComponent implements OnInit {
  constructor(private cartService: CartService) {}
  private _cart: Cart = { items: [] };
  itemsQuantity: number = localStorage.getItem("totalItems")
    ? parseInt(localStorage.getItem("totalItems")!)
    : 0;

  @Input()
  get cart(): Cart {
    return this._cart;
  }
  set cart(cart: Cart) {
    this._cart = cart;

    this.itemsQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, curr) => prev + curr);
    localStorage.setItem("totalItems", JSON.stringify(this.itemsQuantity));
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
    this.itemsQuantity = 0;
  }

  ngOnInit(): void {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      this._cart = { items: JSON.parse(storedCart) };
    }
  }
}
