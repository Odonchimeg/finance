//controller work with ui
var uiController = (function () {

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        budgetValue: ".budget__value",
        expList: ".expenses__list",
        incList: ".income__list",
        incLabel: ".budget__income--value",
        expLabel: ".budget__expenses--value",
        percentLabel: ".budget__expenses--percentage",
        budgetLabel: ".budget__value",
        container: ".container"
    };

    return {
        getInput: function () {
            return {
                addType: document.querySelector(DOMstrings.inputType).value,  //exp || inc
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>' +
                    '<div class="right clearfix"><div class="item__value">+ %value%.00</div><div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                list = DOMstrings.incList;
            } else {
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>' +
                    '<div class="right clearfix"><div class="item__value">- %value%.00</div><div class="item__percentage">21%</div>' +
                    '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div></div></div>';
                list = DOMstrings.expList;
            }
            html = html.replace("%id%", item.id);
            html = html.replace("%description%", item.description);
            html = html.replace("%value%", item.value);

            document.querySelector(list).insertAdjacentHTML("beforeend", html);
        },

        removeListItem: function (id) {
            var item = document.getElementById(id);
            item.parentNode.removeChild(item);
            // document.getElementById(id).remove();
        },

        clearFields: function () {
            var fields = document.querySelectorAll(
                DOMstrings.inputDescription + ", " + DOMstrings.inputValue
            );

            //convert list to array
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(element => {
                element.value = "";
            });

            fieldsArr[0].focus();
        },

        showBudget: function (budget) {
            document.querySelector(DOMstrings.incLabel).textContent = "+ " + budget.totalInc;
            document.querySelector(DOMstrings.expLabel).textContent = "- " + budget.totalExp;
            document.querySelector(DOMstrings.percentLabel).textContent =
                budget.percent + (budget.percent === 0 ? "" : "%");
            document.querySelector(DOMstrings.budgetLabel).textContent = budget.totalBudget;
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
        },

        budget: -1,
        percent: 0
    }

    var calculateTotal = function (type) {

        data.totals[type] = 0;

        data.allItems[type].forEach(element => {
            data.totals[type] += element.value;
        });
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
        },

        removeItem: function (type, id) {
            var ids = data.allItems[type].map(function (el) {
                return el.id;
            });

            var index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {

            //total income
            calculateTotal("inc");

            //total expense
            calculateTotal("exp");

            //total budget of month
            data.budget = data.totals.inc - data.totals.exp;

            //calculate percent of expense
            data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
            data.percent = isNaN(data.percent) ? 0 : data.percent;
        },

        getBudget: function () {
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                totalBudget: data.budget,
                percent: data.percent
            }
        }

    }

})();

//controller work with
var appController = (function (uiCtrl, financeCtrl) {

    var ctrlAddItem = function () {

        // 1. оруулсан өгөгдлийг дэлгэцээс авах
        var inputVal = uiCtrl.getInput();
        const regex = new RegExp("[0-9]+");

        if (inputVal.description !== "" && regex.test(inputVal.value)) {

            // 2. өгөгдлийг санхүүгийн модульд дамжуулж хадгална.
            var item = financeCtrl.addItem(
                inputVal.addType,
                inputVal.description,
                inputVal.value
            );

            // 3. өгөгдлийг тохирох хэсэгт харуулна
            uiCtrl.addListItem(item, inputVal.addType);
            uiCtrl.clearFields();

            // 4. Төсвийг тооцоолно
            financeCtrl.calculateBudget();
            var budget = financeCtrl.getBudget();

            // 5. Нийт үлдэгдэл, тооцоог дэлгэцэнд харуулна
            uiCtrl.showBudget(budget);
        }
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

        document.querySelector(DOMstrings.container).addEventListener('click', function (event) {

            // 1. хассан item-г дэлгэцээс авах
            var id = event.target.parentNode.parentNode.parentNode.parentNode.id;

            if (id) {

                var arr = id.split("-");
                var type = arr[0];
                var itemId = arr[1]

                // 2. өгөгдлийг санхүүгийн модульд дамжуулж хасна.
                financeCtrl.removeItem(type, parseInt(itemId));

                // 3. өгөгдлийг тохирох хэсгээс хасна
                uiCtrl.removeListItem(id);

                // 4. Төсвийг тооцоолно
                financeCtrl.calculateBudget();
                var budget = financeCtrl.getBudget();

                // 5. Нийт үлдэгдэл, тооцоог дэлгэцэнд харуулна
                uiCtrl.showBudget(budget);

            }
        });
    }

    return {
        init: function () {
            uiCtrl.showBudget({
                totalInc: 0,
                totalExp: 0,
                totalBudget: 0,
                percent: 0
            });
            setupEventListeners();
        }
    }

})(uiController, financeController);

appController.init();