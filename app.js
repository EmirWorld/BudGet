/*Check later more about closure*/
// BUDGET CONTROLLER
let budgetController = (function () {

  //Some code

})();

/*Separation of concerns*/
//UI CONTROLLER
let UIController = (function () {

  //Some code

})();

//GLOBAL APP CONTROLLER
let controller = (function (budgetCtrl, UICtrl) {

  let ctrlAddItem = function () {

    //1. Get the field input data

    //2. Add the item to the budget controller

    //3. add the item to UI

    //4. Calculate the budget

    //5. Display the budget

    console.log('It Works')
  };

  document.querySelector('#addButton').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function (event) {

    if (event === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
