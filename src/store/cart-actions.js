import { cartActions } from "./cart-slice";
import { uiActions } from "./ui-slice";

export const fetchData = () => {
    return async (dispatch) => {
        const fetchHandler = async () => {
            const res = await fetch('https://redux-http-47731-default-rtdb.firebaseio.com/cartItems.json');
            const data = await res.json();
            return data;
        }
        try {
            const cartData = await fetchHandler();
            dispatch(cartActions.replaceData(cartData));
        } catch(e) { 
            dispatch(uiActions.showNotification({
                open: true,
                message: 'Fetching data failed...',
                type: 'error'
              }))
        }
    }
}

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