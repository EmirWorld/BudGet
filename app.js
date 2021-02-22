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

  let calculateTotal = function (type) {
    let sum = 0;

    data.allItems[type].forEach(function (cur) {
      sum += +cur.value;
    });
    data.totals[type] = sum;
  }

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
    budget: 0,
    percentage: -1,
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

    calculateBudget: function () {

      // Calculate total income and expenses

      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate the budget: income - expenses

      if (data.totals.inc > 0) {
        data.budget = data.totals.inc - data.totals.exp;
      } else {
        data.percentage = -1;
      }
      // Calculate percentage of income that we spent

      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      }
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
    incomeContainer: '#budgetIncomeList',
    expensesContainer: '#budgetExpensesList',
    budgetValue: "#budgetValue",
    incomeLabel: '#budgetIncomeValue',
    expansesLabel: '#budgetExpensesValue',
    percentageLabel: '#budgetExpensesPercentage',
    budgetContainer: '#budgetContainer',

  };

  return {

    getinput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },

    addListItem: function (obj, type) {
      let html, newHtml, element;
      // Create HTML string with placeholder text

      if (type === 'inc') {

        element = DOMStrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

      } else if (type === 'exp') {

        element = DOMStrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

      }

      //Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description)
      newHtml = newHtml.replace('%value%', obj.value)

      //Insert the HTML into the DOM

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    clearFields: function () {
      let fields, fieldsArr;

      fields = document.querySelectorAll(
          DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {

        current.value = "";

      });
    },

    displayBudget: function (obj) {
      document.querySelector(
          DOMStrings.budgetValue).textContent = obj.budget;
      document.querySelector(
          DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(
          DOMStrings.expansesLabel).textContent = obj.totalExp;

      if (obj.totalInc > obj.totalExp) {
        document.querySelector(
            DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(
            DOMStrings.percentageLabel).textContent = '';
      }
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

    document.querySelector(DOM.budgetContainer).addEventListener('click',
        ctrlDeleteItem);

  }

  let updateBudget = function () {

    //1. Calculate the budget
    budgetCtrl.calculateBudget();

    //2. Return the budget

    let budget = budgetCtrl.getBudget();

    //3. Display the budget

    UICtrl.displayBudget(budget);

  };

  let ctrlAddItem = function () {

    let input, newItem;

    //1. Get the field input data

    input = UICtrl.getinput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

      //2. Add the item to the budget controller

      newItem = budgetCtrl.addItem(input.type, input.description, input.value)

      //3. add the item to UI

      UICtrl.addListItem(newItem, input.type);

      //.4 clear the fields

      UICtrl.clearFields();

      //5. Calculate and update budget

      updateBudget();

    }

  };

  let ctrlDeleteItem = function (event) {
    let itemID, splitID,type,id;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      //inc-1 format of id, we need way to split this up

      splitID = itemID.split('-');
      type = splitID[0];
      id = splitID[1];


      //1. delete item from data structure

      //2. delete item from the UI

      //3. Update and show the new budget totals


    }

  };
  return {
    init: function () {
      console.log('Application has started.');
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();