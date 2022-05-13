import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "./ui-slice";


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        itemsList: [],
        totalQuantity: 0,
        showCart: false,
        changed: false
    },
    reducers: {
        replaceData(state, action) {
          state.totalQuantity = action.payload.totalQuantity;
          state.itemsList = action.payload.itemsList;
        },
        addToCart(state, action) {
          state.changed = true;
           const newItem = action.payload;
           // to check if the item is already available
           const existingItem = state.itemsList.find(item => item.id === newItem.id);

           if(existingItem){
               existingItem.quantity++;
               existingItem.totalPrice += newItem.price
           } else {
                state.itemsList.push({
                    id: newItem.id,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                    name: newItem.name
                });
                state.totalQuantity++;
           }
        },
        removeFromCart(state, action) {
          state.changed = true;
            const id = action.payload;
            const existingItem = state.itemsList.find(item => item.id === id);
            if(existingItem.quantity === 1){
                state.itemsList = state.itemsList.filter(item => item.id !== id);
                state.totalQuantity--;
            } else {
                existingItem.quantity--;
                existingItem.totalPrice -= existingItem.price;
            }
        },
        setShowCart(state) {
            state.showCart = !state.showCart;
        }
    }
});

export const sendCartData = (cart) => {
    return async(dispatch) => {
        // Send state as sending request
      dispatch(uiActions.showNotification({
        open: true,
        message: 'Sending Request...',
        type: 'warning',
      }));

      const sendRequest = async () => {
        const res = await fetch(
          'https://redux-http-47731-default-rtdb.firebaseio.com/cartItems.json', {
          method: 'PUT',
          body: JSON.stringify(cart)
        });
        const data = await res.json();
        //send state as Request successful
        setTimeout(() => {
          dispatch(uiActions.showNotification({
            open: true,
            message: 'Sent Request to Database successfully!',
            type: 'success'
          }));
        }, 500);
      }
      try{ 
          await sendRequest();
      } catch (e) {
        dispatch(uiActions.showNotification({
            open: true,
            message: 'Sending request failed...',
            type: 'error'
          }))
      }
    }
}
export const cartActions = cartSlice.actions;

export default cartSlice;