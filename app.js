//controller work with ui
var uiController = (function () {

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        budgetValue: ".budget__value"
    };

    return {
        getInput: function () {
            return {
                addType: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        getDOMstrings: function () {
            return DOMstrings;
        },

        setBudgetValue: function (val) {
            document.querySelector(DOMstrings.budgetValue).textContent = "+ " + val;
        },
    }

})();

//controller work with calculation
var financeController = (function () {

    var data = {
        allItems : {
            inc : [],
            exp : []
        },

        totals : {
            inc : 0,
            exp : 0
        }
    }

    var Income = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Expense = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }   

})();

//controller work with
var appController = (function (uiCtrl, financeCtrl) {

    var DOMstrings = uiCtrl.getDOMstrings();

    var ctrlAddItem = function () {

        // 1. оруулсан өгөгдлийг дэлгэцээс авах
        var inputVal = uiCtrl.getInput();

        // 2. өгөгдлийг санхүүгийн модульд дамжуулж хадгална.

        // 3. өгөгдлийг тохирох хэсэгт харуулна

        // 4. Төсвийг тооцоолно

        // 5. Нийт үлдэгдэл, тооцоог дэлгэцэнд харуулна

    }

    var setupEventListeners = function () {

        document.querySelector(DOMstrings.addBtn).addEventListener("click", function () {
            ctrlAddItem();
        });

        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13 || event.which === 13)
                ctrlAddItem();
        });
    }

    return {
        init : function(){
            setupEventListeners();
        }
    }

})(uiController, financeController);

appController.init();