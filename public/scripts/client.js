$(document).ready(function () {
    // ASSIGN HTML ELEMENTS TO VARIABLES
    let widgetsToAdd = $("#countWidgetsToAdd ");
    let widgetAddButton = $(".buttonAdd");
    let widgetClearButton = $("#buttonClearWidgets");
    let widgetDeleteButton = $(".buttonDeleteWidgets");
    let widgetSubmitButton = $("#buttonSubmit");
    let widgetSubtractButton = $(".buttonSubtract");
    let totalPriceDisplay = $("#totalPriceDisplay");
    let totalWidgetsDisplay = $("#totalWidgetsDisplay");
    let widgetCards = $(".card");
    let widgetList = $("#widgetList");

    // END ASSIGN HTML ELEMENTS TO VARIABLES
    // DELCARE VARIABLES
    let widgetCardsArray = getWidgetCardsArrayFromLocalStorage();
    // assign value of total widgets to a variable
    let totalOrder = calculateTotalOrder(widgetCardsArray);
    // end assign value of total widgets to a variable
    // END DECLARE VARIABLES

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
