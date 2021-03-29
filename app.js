//Data
var budgetController = (function() {

    var Expense = function(id, description, value){
        this.id = id; 
        this.description = description; 
        this.value = value; 
    };

    var Income = function(id, description, value){
        this.id = id; 
        this.description = description; 
        this.value = value; 
    };

    var calculateTotal = function(type) {
        var sum = 0; 
        data.allItems[type].forEach(function(cur) {
            sum += cur.value; 
        }); 
        data.totals[type] = sum; 
    }; 

    var data = {
        allItems: {
            exp: [], 
            inc: []
        },
        totals: {
            exp: 0, 
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function(type, des, val){
            var newItem, ID;
            //[1 2 3 4 5 ], next ID = 6
            //ID = last ID + 1

            //create id
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1; 
            } else {
                ID = 0; 
            }

            //Create new item based on 'inc' or 'exp' type
            if(type === 'exp') {
                newItem = new Expense(ID, des, val); 
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val); 
            }

            //PUsh it into out data structure
            data.allItems[type].push(newItem); 
            
            //return the new element
            return newItem
        },

        calculateBudget: function() {
            //calculate total incom and exp 
            calculateTotal('exp'); 
            calculateTotal('inc'); 

            //Calculate the budget: inc - exp
            data.budget = data.totals.inc - data.totals.exp; 

            //calculate hte percentage of inc that we spent
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
        },

        testing: function() {
            console.log(data); 
        }
    };

})(); 

//UI
var UIController = (function() {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'

    };

    return {
        getInput: function() {
            return{
                type: document.querySelector(DOMStrings.inputType).value, //will be eather inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type){
            var html, newHtml, element; 
            //Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMStrings.incomeContainer; 
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"> <i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
                
            //Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id); 
            newHtml = newHtml.replace('%description%', obj.description); 
            newHtml = newHtml.replace('%value%', obj.value); 

            //Insert the html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 
        },

        //to clean fields
        cleanFields: function() {
            var fields, fieldsArr; 
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue); // e marrim si string

            //e shofim si arr tani 
           fieldsArr = Array.prototype.slice.call(fields); 

           fieldsArr.forEach(function(current, index, array) {
               current.value = ""; 
           });

           //put focus on the first field
           fieldsArr[0].focus(); 
        },

        getDOMStrings: function(){
            return DOMStrings; 
        }

    }

})(); 

//GLOBAL APP CONTROLLER
//collaboration bettwen UI and Data
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMStrings(); 

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); 

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13){
                //console.log('ENTER was pressed'); 
                ctrlAddItem(); 
            }
        });
    };

    var updateBudget = function() {
        //5. Calculate the budget = 1. Calcutale Budget

        //                        = 2. return the Budget

        //6. Display the budget on the UI
    }

    var ctrlAddItem = function(){
        //console.log('It works'); 
        //1. Get the field input data
        var input = UICtrl.getInput(); 
            //console.log(input); 

        //if fushat jane jobosh
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value); 

            //3. Add the item to the UI 
            UICtrl.addListItem(newItem, input.type);

            //4. Clean the fields
            UICtrl.cleanFields(); 

            //5. Calcutale and update budget
            updateBudget(); 
        } 
        
    }

    return {
        init: function() {
            console.log('Aplication has started');
            setupEventListeners(); 
        }
    };
   

})(budgetController, UIController); 


controller.init(); 







