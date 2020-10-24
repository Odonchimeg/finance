//controller work with ui
var uiController = (function () {

})();

//controller work with calculation
var financeController = (function () {

})();

//controller work with
var appController = (function (uiCtrl, financeCtrl) {

    var ctrlAddItem = function () {

        // 1. оруулсан өгөгдлийг дэлгэцээс авах
        var addType = document.querySelector(".add__type").value;
        var description = document.querySelector(".add__description").value;
        var value = document.querySelector(".add__value").value;

        console.log(addType + " === " + description + " /// " + value);
        // 2. өгөгдлийг санхүүгийн модульд дамжуулж хадгална.
        // 3. өгөгдлийг тохирох хэсэгт харуулна
        // 4. Төсвийг тооцоолно
        // 5. Нийт үлдэгдэл, тооцоог дэлгэцэнд харуулна
    }

    document.querySelector(".add__btn").addEventListener("click", function () {
        ctrlAddItem();
    });

    document.addEventListener("keypress", function (event) {
        if (event.keyCode === 13 || event.which === 13)
            ctrlAddItem();
    });

})(uiController, financeController);