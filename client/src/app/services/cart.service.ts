import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Cart, CartItem } from "../models/cart.model";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class CartService {
  localStarageItems = localStorage.getItem("cart");
  cart = new BehaviorSubject<Cart>({
    items: this.localStarageItems ? JSON.parse(this.localStarageItems) : [],
  });
  constructor(private _snackBar: MatSnackBar) {}

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);

    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(items));

    this.cart.next({ items });
    this._snackBar.open("1 item added", "Ok", { duration: 1000 });
  }

  getTotal(items: Array<CartItem>): number {
    if (items.length === 0) {
      return 0;
    }
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  clearCart(): void {
    localStorage.removeItem("cart");
    localStorage.removeItem("totalItems");
    this.cart.next({ items: [] });
    this._snackBar.open("Cart cleared", "Ok", { duration: 1000 });
  }

  removeQuantity(item: CartItem): void {
    let itemForRemoval: CartItem | undefined;
    let filteredItems = this.cart.value.items.map((_item) => {
      if (_item.id === item.id) {
        _item.quantity--;
        if (_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }
      return _item;
    });

    if (itemForRemoval) {
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }
    localStorage.setItem("cart", JSON.stringify(filteredItems));
    this.cart.next({ items: filteredItems });
    this._snackBar.open("1 item removed", "Ok", { duration: 1000 });
  }

  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );
    if (update) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open("1 item removed", "Ok", { duration: 1000 });
    }

    return filteredItems;
  }
}
