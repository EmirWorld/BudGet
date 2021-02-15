/*Check later more about closure*/
// BUDGET CONTROLLER
let budgetController = (function () {

  //We need data models for expanses and income

  let Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

//Store all data in this object
  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };

  return {

    addItem: function (type, des, val) {
      let newItem, ID;

      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item based on exp or inc
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      //Push it to data structure
      data.allItems[type].push(newItem)

      //Return the new element
      return newItem;

    },

    testing: function () {
      console.log(data)
    }
  };

})();

/*Separation of concerns*/
//UI CONTROLLER
let UIController = (function () {

  let DOMStrings = {
    inputType: '#addType',
    inputDescription: '#addDescription',
    inputValue: '#addValue',
    addBtn: '#addButton',
  };

  return {
    getinput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },
    getDOMStrings: function () {
      return DOMStrings;
    },
  };

})();

//GLOBAL APP CONTROLLER
let controller = (function (budgetCtrl, UICtrl) {

  let setupEventListeners = function () {
    let DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {
      if (event === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

  }

  let ctrlAddItem = function () {

    let input, newItem;

    //1. Get the field input data

    input = UICtrl.getinput();

    //2. Add the item to the budget controller

    newItem = budgetCtrl.addItem(input.type, input.description, input.value)

    //3. add the item to UI

    //4. Calculate the budget

    //5. Display the budget

  };

  return {
    init: function () {
      console.log('Application has started.');
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();