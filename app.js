//controller work with ui
var uiController = (function () {

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        budgetValue: ".budget__value",
        expList: ".expenses__list",
        incList: ".income__list"
    };

    return {
        getInput: function () {
            return {
                addType: document.querySelector(DOMstrings.inputType).value,  //exp || inc
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

        addListItem: function (item, type) {

            var html, list;

            if (type === 'inc') {
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>' +
                    '<div class="right clearfix"><div class="item__value">+ %value%.00</div><div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                    list = DOMstrings.incList;
            } else {
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div>' +
                    '<div class="right clearfix"><div class="item__value">- %value%.00</div><div class="item__percentage">21%</div>' +
                    '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div></div></div>';
                    list = DOMstrings.expList;
            }
            html = html.replace("%id%", item.id);
            html = html.replace("%description%", item.description);
            html = html.replace("%value%", item.value);

            document.querySelector(list).insertAdjacentHTML("beforeend", html);
        }
    }

})();

//controller work with calculation
var financeController = (function () {

    //private
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //private
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //private
    var data = {
        allItems: {
            inc: [],
            exp: []
        },

        totals: {
            inc: 0,
            exp: 0
        }
    }

    return {

        addItem: function (type, desc, val) {
            var item, id;

            if (data.allItems[type].length === 0)
                id = 1;
            else
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;

            if (type === "inc")
                item = new Income(id, desc, val);
            else item = new Expense(id, desc, val);

            data.allItems[type].push(item);

            return item;
        }
    }

})();

//controller work with
var appController = (function (uiCtrl, financeCtrl) {

    var ctrlAddItem = function () {

        // 1. оруулсан өгөгдлийг дэлгэцээс авах
        var inputVal = uiCtrl.getInput();

        // 2. өгөгдлийг санхүүгийн модульд дамжуулж хадгална.
        var item = financeCtrl.addItem(
            inputVal.addType,
            inputVal.description,
            inputVal.value
        );

        // 3. өгөгдлийг тохирох хэсэгт харуулна
        uiCtrl.addListItem(item, inputVal.addType);

        // 4. Төсвийг тооцоолно

        // 5. Нийт үлдэгдэл, тооцоог дэлгэцэнд харуулна

    }

    var setupEventListeners = function () {

        var DOMstrings = uiCtrl.getDOMstrings();

        document.querySelector(DOMstrings.addBtn).addEventListener("click", function () {
            ctrlAddItem();
        });

        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13 || event.which === 13)
                ctrlAddItem();
        });
    }

    return {
        init: function () {
            setupEventListeners();
        }
    }

})(uiController, financeController);

appController.init();