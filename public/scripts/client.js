$(document).ready(function () {
    console.log('init jq');
    // DELCARE VARIABLES
    let widgetsToAdd =  $("#countWidgetsToAdd ");
    let widgetAddButton =  $(".buttonAdd");
    let widgetClearButton =  $("#buttonClearWidgets");
    let widgetDeleteButton =  $(".buttonDeleteWidgets");
    let widgetSubmitButton =  $("#buttonSubmit");
    let widgetSubtractButton =  $(".buttonSubtract");
    let totalPriceDisplay =  $("#totalPriceDisplay");
    let totalWidgetsDisplay =  $("#totalWidgetsDisplay");
    let widgetCards =  $(".card");
    let widgetList =  $("#widgetList");
    // END DECLARE VARIABLES

    // DECLARE FUNCTIONS
    let calculateTotalOrder = function (widgetCardsArray) {
        console.log('init calculateTotalOrder');
        // loop through array of widgets and sum the count of each type
        let totalOrder = {
            totalWidgets: 0,
            totalPrice: 0,
        }
        for (let i = 0; i < widgetCardsArray.length; i++) {
            totalOrder = {
                totalWidgets: totalOrder.totalWidgets + widgetCardsArray[i].count,
                totalPrice: Number(totalOrder.totalPrice) + Number(widgetCardsArray[i].subtotalPrice),
            }
        }
        console.log(totalOrder);
        return totalOrder;
    }
    
    let displayTotalOrder = function (totalOrder) {
        console.log('init displayTotalOrder');
        console.log(`total widgets: ${totalOrder.totalWidgets}`);
        console.log(`total price: ${totalOrder.totalPrice}`);
        totalWidgetsDisplay.text('clearing');
        totalPriceDisplay.text('clearing');
        totalWidgetsDisplay.text(
            `
                ${totalOrder.totalWidgets}
                `
        );
        totalPriceDisplay.text(
            `
                ${totalOrder.totalPrice}
                `
        );
    }
    
    let displayWidgetList = function (widgetCardsArray) {
        console.log('init displayWidgetList');
        widgetList.empty();
        console.log('widgetCardsArray = ')
        console.log(widgetCardsArray);
        if (widgetCardsArray.length === 0) {
            widgetList.append(
                `<p>Your cart is empty</p>`
            );
            widgetClearButton.addClass('hide');
        }
        else {
            widgetClearButton.removeClass('hide');
            widgetList.prepend(
                `
                    <p id="cartItemNameLabel">Item</p>
                    <p id="cartItemSubtotalWeightLabel">Weight</p>
                    <p id="cartItemCountLabel">Quantity</p>
                    <p id="cartItemSubtotalPriceLabel">Price</p>
                    <p id="cartItemActionsLabel">Actions</p>
                    `
            )
            // loop through the array of widgets and create a cart item for each
            widgetCardsArray.map((item, index) => {
                widgetList.append(
                    `<div 
                            class="cartItem"
                            id="cartItem${index}"
                            >
                            <p class="cartItemName">${item.name}</p>
                            <p class="cartItemSubtotalWeight">${item.subtotalWeight} lb</p>
                            <p class="cartItemCount">${item.count}</p>
                            <p class="cartItemSubtotalPrice">${item.subtotalPrice}</p>
                            <div class="cartItemsActions">
                                <button class="cartButtonAdd">+</button>
                                <button class="cartButtonSubtract">-</button>
                                <button class="cartButtonDelete">delete</button>
                            </div>
                        </div>
                        `
                );
                $(`#cartItem${index}`).data('item', item);
    
            });// end loop through array of widgets and create a cart item for each
    
            // assign variables to cart buttons
            let cartButtonAdd = $('.cartButtonAdd');
            let cartButtonDelete = $('.cartButtonDelete');
            let cartButtonSubtract = $('.cartButtonSubtract');
    
            // assign event listeners to cart buttons
            cartButtonAdd.on('click', handleClickCartButtonAdd);
            cartButtonDelete.on('click', handleClickCartButtonDelete);
            cartButtonSubtract.on('click', handleClickCartButtonSubtract);
        }
    }
    
    let getWidgetCardsArrayFromLocalStorage = function () {
        let widgetCardsArray = JSON.parse(localStorage.getItem("widgetCardsArray"));
        console.log(`widgetCardsArrayFromLocalStorage = ${widgetCardsArray}`);
        if (widgetCardsArray) {
            console.log('widgetCardsArray found on local storage. Returning the array.')
            console.log(JSON.stringify(widgetCardsArray));
            return widgetCardsArray;
        } else {
            console.log(`widgetCardsArray not found in localStorage. Returning empty array.`)
            return [];
        }
    }
    
    let handleClickCartButtonAdd = function () {
        let click = $(this);
        let cartItem = click.parents(".cartItem").data('item');
        console.log(cartItem);
        if (widgetCardsArray.length === 0) {
            console.log('no similar widgets found. adding widget to array.')
            widgetCardsArray.push(cartItem);
            console.log(widgetCardsArray);
        } // end case: no widgets exist in array
        // case: widget array has widgets
        // check for similar widgets and update count
        else if (widgetCardsArray.length > 0) {
            let index = 0;
            let maxIndex = widgetCardsArray.length - 1;
            widgetCardsArray = searchArrayAndIncrement(index, maxIndex, cartItem);
        } // end check for similar widgets and update count
    
        // update local storage with updated widgetCardsArray
        updateLocalStorage(widgetCardsArray);
    
        // update DOM with updated widgetCardsArray
        displayWidgetList(widgetCardsArray);
    
        // recalculate order totals and display on DOM
        totalOrder = calculateTotalOrder(widgetCardsArray);
        displayTotalOrder(totalOrder);
    }
    
    let handleClickCartButtonDelete = function () {
        console.log('init handleClickCartButtonDelete');
        let click = $(this);
        console.log('This is the widget to delete:');
        let cartItem = click.parents(".cartItem").data('item');
        console.log(cartItem);
        let index = 0;
        let maxIndex = widgetCardsArray.length - 1;
        widgetCardsArray - searchArrayAndDelete(index, maxIndex, cartItem.name);
        totalOrder = calculateTotalOrder(widgetCardsArray);
    
        // update local storage with updated widgetCardsArray
        updateLocalStorage(widgetCardsArray);
    
        // update DOM with updated widgetCardsArray
        displayWidgetList(widgetCardsArray);
    
        // recalculate order totals and display on DOM
        totalOrder = calculateTotalOrder(widgetCardsArray);
        displayTotalOrder(totalOrder);
    }
    
    let handleClickCartButtonSubtract = function () {
        console.log('init handleClickCartButtonSubtract');
        let click = $(this);
        console.log('This is the widget to subract:');
        let cartItem = click.parents(".cartItem").data('item');
        console.log(cartItem);
        let index = 0;
        let maxIndex = widgetCardsArray.length - 1;
        widgetCardsArray - searchArrayAndDecrement(index, maxIndex, cartItem.name);
        totalOrder = calculateTotalOrder(widgetCardsArray);
    
        // update local storage with updated widgetCardsArray
        updateLocalStorage(widgetCardsArray);
    
        // update DOM with updated widgetCardsArray
        displayWidgetList(widgetCardsArray);
    
        // recalculate order totals and display on DOM
        totalOrder = calculateTotalOrder(widgetCardsArray);
        displayTotalOrder(totalOrder);
    }
    
    let handleClickAdd = function () {
        console.log('init handleClickAdd');
        let click = $(this);
        console.log('This is the widget to add:');
        let widgetName = click.closest('.card').find('.widgetName').attr('data-widgetname');
        console.log(widgetName);
        let widgetWeight = click.closest('.card').find('.widgetWeight').attr('data-widgetweight');
        console.log(widgetWeight);
        let widgetPrice = click.closest('.card').find('.widgetPrice').attr('data-widgetprice');
        let widgetToAdd = {
            name: widgetName,
            weight: widgetWeight,
            count: 1,
            widgetPrice: widgetPrice,
            subtotalPrice: widgetPrice,
            subtotalWeight: widgetWeight,
        }
        console.log(`widget to add = ${JSON.stringify(widgetToAdd)}`);
        console.log('checking existing widgets in array.')
        // check for similar widget in widget array
        // case: no widgets exist in array
        // push widget to widget array
        if (widgetCardsArray.length === 0) {
            console.log('no similar widgets found. adding widget to array.')
            widgetCardsArray.push(widgetToAdd);
            console.log(widgetCardsArray);
        } // end case: no widgets exist in array
        // case: widget array has widgets
        // check for similar widgets and update count
        else if (widgetCardsArray.length > 0) {
            let index = 0;
            let maxIndex = widgetCardsArray.length - 1;
            widgetCardsArray = searchArrayAndIncrement(index, maxIndex, widgetToAdd);
        } // end check for similar widgets and update count
    
        // update local storage with updated widgetCardsArray
        updateLocalStorage(widgetCardsArray);
    
        // update DOM with updated widgetCardsArray
        displayWidgetList(widgetCardsArray);
    
        // recalculate order totals and display on DOM
        totalOrder = calculateTotalOrder(widgetCardsArray);
        displayTotalOrder(totalOrder);
    }
    
    let handleClickClearWidgets = function () {
        console.log('init handle click clear widgets');
        resetLocalStorage();
        widgetCardsArray = getWidgetCardsArrayFromLocalStorage();
        totalOrder = calculateTotalOrder(widgetCardsArray);
        displayTotalOrder(totalOrder);
        displayWidgetList(widgetCardsArray);
    }
    
    let handleClickDelete = function () {
        console.log('init handleClickDelete');
        let click = $(this);
        console.log('This is the widget to delete:');
        let widgetName = click.closest('.card').find('.widgetName').attr('data-widgetname');
        console.log(widgetName);
        let index = 0;
        let maxIndex = widgetCardsArray.length - 1;
        widgetCardsArray - searchArrayAndDelete(index, maxIndex, widgetName);
        totalOrder = calculateTotalOrder(widgetCardsArray);
    
        // update local storage
        localStorage.setItem("widgetCardsArray", JSON.stringify(widgetCardsArray));
        // update DOM with updated widget array
        displayTotalOrder(totalOrder);
        displayWidgetList(widgetCardsArray);
    }
    
    let handleClickSubtract = function () {
        console.log('init handleClickSubtract');
        let click = $(this);
        console.log('This is the widget to subract:');
        let widgetName = click.closest('.card').find('.widgetName').attr('data-widgetname');
        console.log(widgetName);
        let index = 0;
        let maxIndex = widgetCardsArray.length - 1;
        widgetCardsArray - searchArrayAndDecrement(index, maxIndex, widgetName);
        totalOrder = calculateTotalOrder(widgetCardsArray);
    
        // update local storage
        localStorage.setItem("widgetCardsArray", JSON.stringify(widgetCardsArray));
        // update DOM with updated widget array
        displayTotalOrder(totalOrder);
        displayWidgetList(widgetCardsArray);
    
    }
    
    let searchArrayAndDecrement = function (index, maxIndex, widgetName) {
        console.log('init searchArrayAndDecrement');
        let checkName = widgetName;
        // case: widget at current index is similar to the widget to decremenet
        if (checkName === widgetCardsArray[index].name) {
            console.log('Found similar widget, decrementing count.')
            console.log(`checkName = ${checkName} and matching name = ${widgetCardsArray[index].name}`);
            // create an updated widget with an increased count
            let count = widgetCardsArray[index].count;
            // case: the updated count is less than or equal to 1
            if (count <= 1) {
                // remove the widget from the widgetCardsArray
                widgetCardsArray.splice([index], 1);
            } // end case: the updated count is less than or equal to 1
            // case: the updated count is 2 or greater
            else {
                let updatedCount = count - 1;
                let updatedSubtotalPrice = widgetCardsArray[index].widgetPrice * updatedCount;
                let updatedSubtotalWeight = widgetCardsArray[index].weight * updatedCount;
                updatedWidget = {
                    ...widgetCardsArray[index],
                    count: updatedCount,
                    subtotalPrice: updatedSubtotalPrice,
                    subtotalWeight: updatedSubtotalWeight,
                }
                console.log(`count increased to ${updatedWidget.count}`)
                // remove the similar widget and replace it with the updated widget
                widgetCardsArray.splice([index], 1, updatedWidget);
            }// end case: the updated count is 2 or greater
            // advance index to next position
            index++;
        } // end case: widget at current index is similar to the widget to decremenet
        // case: widget at current index is not similar to the widget to decrement && there are more indecies to check
        else if (checkName != widgetCardsArray[index].name && index < maxIndex) {
            console.log('Checking next index.')
            // advance index to next position
            index++;
            // compare widget at the advanced position to the widget to decremenet
            searchArrayAndDecrement(index, maxIndex, widgetName);
        } // end case: widget at current index is not similar to the widget to decremenet & there are more indecies to check
        // case: widget at current index is not similar to the widget to decremenet && there are no more indecies to check
        else if (checkName != widgetCardsArray[index].name && index === maxIndex) {
            console.log('Found no matching widget type to decrement.')
            // advance the index
            index++;
        } // end case: widget at current index is not similar to the widget to decremenet && there are no more indecies to check
        return widgetCardsArray;
    }
    
    let searchArrayAndDelete = function (index, maxIndex, widgetName) {
        console.log('init searchArrayAndDelete');
        let checkName = widgetName;
        // case: widget at current index is similar to the widget to delete
        if (checkName === widgetCardsArray[index].name) {
            console.log('Found similar widget, deleting.')
            console.log(`checkName = ${checkName} and matching name = ${widgetCardsArray[index].name}`);
            widgetCardsArray.splice([index], 1);
            // advance index to next position
            index++;
        } // end case: widget at current index is similar to the widget to delete
        // case: widget at current index is not similar to the widget to delete && there are more indecies to check
        else if (checkName != widgetCardsArray[index].name && index < maxIndex) {
            console.log('Checking next index.')
            // advance index to next position
            index++;
            // compare widget at the advanced position to the widget to delete
            searchArrayAndDelete(index, maxIndex, widgetName);
        } // end case: widget at current index is not similar to the widget to delete & there are more indecies to check
        // case: widget at current index is not similar to the widget to delete && there are no more indecies to check
        else if (checkName != widgetCardsArray[index].name && index === maxIndex) {
            console.log('Found no matching widget type to delete.')
            // advance the index
            index++;
        } // end case: widget at current index is not similar to the widget to delete && there are no more indecies to check
        return widgetCardsArray;
    }
    
    let searchArrayAndIncrement = function (index, maxIndex, widgetToAdd) {
        console.log(`init searchArray at index ${index}`);
        let checkName = widgetToAdd.name;
        // case: widget at current index is similar to the added widget
        if (checkName === widgetCardsArray[index].name) {
            console.log('Found similar widget, increasing count.')
            console.log(`checkName = ${checkName} and matching name = ${widgetCardsArray[index].name}`);
            // create an updated widget with an increased count
            let updatedCount = widgetCardsArray[index].count + 1;
            let updatedSubtotalWeight = widgetCardsArray[index].weight * updatedCount;
            let updatedSubtotalPrice = widgetToAdd.widgetPrice * updatedCount;
            updatedWidget = {
                ...widgetCardsArray[index],
                count: widgetCardsArray[index].count + 1,
                subtotalPrice: updatedSubtotalPrice,
                subtotalWeight: updatedSubtotalWeight,
            }
            console.log(`count increased to ${updatedWidget.count}`)
            // remove the similar widget and replace it with the updated widget
            widgetCardsArray.splice([index], 1, updatedWidget);
            // advance index to next position
            index++;
        } // end case: widget at current index is similar to the added widget
        // case: widget at current index is not similar to the added widget && there are more indecies to check
        else if (checkName != widgetCardsArray[index].name && index < maxIndex) {
            console.log('Checking next index.')
            // advance index to next position
            index++;
            // compare widget at the advanced position to the added widget
            searchArrayAndIncrement(index, maxIndex, widgetToAdd);
        } // end case: widget at current index is not similar to the added widget & there are more indecies to check
        // case: widget at current index is not similar to the added widget && there are no more indecies to check
        else if (checkName != widgetCardsArray[index].name && index === maxIndex) {
            console.log('Found no match. Pushing widget to array.')
            // push the added widget to the widget array
            widgetCardsArray.push(widgetToAdd);
            // advance the index
            index++;
        } // end case: widget at current index is not similar to the added widget && there are no more indecies to check
        return widgetCardsArray;
    }
    
    let resetLocalStorage = function () {
        localStorage.setItem("widgetCardsArray", JSON.stringify([]));
    }
    
    let updateLocalStorage = function (widgetCardsArray) {
        localStorage.setItem("widgetCardsArray", JSON.stringify(widgetCardsArray));
    }
    // END DECLARE FUNCTIONS
    
    // INITIALIZE ORDER DATA
    let widgetCardsArray = getWidgetCardsArrayFromLocalStorage();
    let totalOrder = calculateTotalOrder(widgetCardsArray);
    // END INITIALIZE ORDER DATA

    // POPULATE DOM WITH WIDGET ORDER DATA
    displayTotalOrder(totalOrder);
    displayWidgetList(widgetCardsArray);
    // END POPULATE DOM WITH WIDGET ORDER DATA

    // ASSIGN EVENT LISTENERS
    $(widgetAddButton).on("click ", handleClickAdd);
    $(widgetClearButton).on("click ", function () { handleClickClearWidgets() });
    $(widgetDeleteButton).on("click ", handleClickDelete);
    $(widgetSubtractButton).on("click ", handleClickSubtract);
    $(widgetSubmitButton).on("click ", function () { handleClickSubmit($(widgetsToAdd).val()) });
    // END ASSIGN EVENT LISTENERS
});
