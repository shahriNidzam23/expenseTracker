var app = angular.module('app.controllers', [])
var today = 0;

//everytime run
app.controller('configCtrl', function($scope) {
  //db connection
    var ref = new Firebase("https://expensetracker-da34a.firebaseio.com/");
    var dValidate = ref.child("category");
    var sDate;

    //date format
    var fullDate = new Date();
    var month = fullDate.getMonth() + 1;
    //convert string
    //var conDate = sDate.toString();

    //db category
    dValidate.on("value", function(snapshot) {
      //loop once more
      //to read date & current
      angular.forEach(snapshot.val(), function(item, key) {
        if (!(month == item.thisMonth)){
          var ss = dValidate.child(key);
          ss.update({thisMonth: month});
        }
});
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
  });
    today = 0;
})

//link home.html
app.controller('homeCtrl', function($scope, $window, $timeout, $ionicLoading) {
  var fullDate = new Date();
  var day = fullDate.getDate();
  var month = fullDate.getMonth() + 1;
  var year = fullDate.getFullYear();
  console.log(month);
  if(month < 10){
    if(day < 10){
      sDate = "0" + day + "-0" + month + "-" + year;
    } else {
        sDate = day + "-0" + month + "-" + year; 
    }                
  } else {
    if(day < 10){
      sDate = "0" + day + "-" + month + "-" + year;
    } else {
      sDate = day + "-" + month + "-" + year; 
    }   
  }
  var conDate = sDate.toString();

  //db connection
  var ref = new Firebase("https://expensetracker-da34a.firebaseio.com/");
  var dEx = ref.child("category");
  var dExp = ref.child("item");
  var itemSpec = dExp.orderByChild("date").equalTo(conDate);

  //Data loading
  $ionicLoading.show();

  //Daily Chart
  itemSpec.on("value", function(snapshot) {
      console.log(snapshot.val());
      //Trigger Chart
      $timeout(function() {
      var labels = [];
      var daily = [];
      var today = 0;
      //loop once more
      angular.forEach(snapshot.val(), function(item, key) {
        console.log(item.item);
        //Daily data
        var price = item.price;
        var res = price.replace("RM", "");
        var floatPrice = parseFloat(res)
        labels.push(item.item);
        daily.push(floatPrice);


        today = today + floatPrice;
        
      });
          if(today == 0){
            document.getElementById("tExpense").innerHTML = "No Expense";
            $scope.labels = ["No Data"];
            $scope.daily = [1];
            $scope.colors = ['#BEBEBE'];
            $ionicLoading.hide(); 

          } else {
            $scope.labels = labels;
            $scope.daily = daily;
            if(today % 1 == 0) {
              document.getElementById("tExpense").innerHTML = "RM" + today + ".00";
            } else {
              document.getElementById("tExpense").innerHTML = "RM" + today + "0";
            }
            $ionicLoading.hide();            
          }

      })
    
      //read db failed
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

    //Monthly Chart
    dEx.on("value", function(snapshot) {
      console.log("dEx");
      //Trigger Chart
      $timeout(function() {

      //saved Monthly Data
      var label = [];
      var data = [];
      var totalLeft = 0;
      var totalSpend = 0;
      var tLimit = 0;
      var totalLeft;
      today = 0;
      //loop once more
      angular.forEach(snapshot.val(), function(item, key) {
        console.log("Angular");
          //Monthly data
          totalSpend = totalSpend + item.monthly;
          tLimit = tLimit + item.max;
          totalLeft = tLimit - totalSpend;
          label.push(item.category);
          data.push(item.monthly);
          $ionicLoading.hide();
      });

          //Detect overbudget monthly data
          if(!(totalSpend == 0)){
            if(totalLeft < 0){
              $scope.label = ["Total Spend"];
              $scope.data = [totalSpend];
              $scope.colours = ['#f7464a'];
              if(totalLeft % 1 == 0) {
                document.getElementById("tSpending").innerHTML = "RM" + totalLeft + ".00";
              } else {
                document.getElementById("tSpending").innerHTML = "RM" + totalLeft + "0";
              }
            } else {
              $scope.label = label;
              $scope.data = data;
              if(totalLeft % 1 == 0) {
                document.getElementById("tSpending").innerHTML = "RM" + totalLeft + ".00";
              } else {
                document.getElementById("tSpending").innerHTML = "RM" + totalLeft + "0";
              }
              
            }
          } else {
            $scope.label = ["No Data"];
            $scope.data = [1];
            $scope.colours = ['#BEBEBE'];
            document.getElementById("tSpending").innerHTML = "No Expense";
            
          }

      })
    
      //read db failed
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
})
   
app.controller('historyCtrl', function($scope, $firebaseArray, $ionicLoading, $firebaseArray) {
  //db connection
  var ref = new Firebase("https://expensetracker-da34a.firebaseio.com/");
  var history = ref.child("item");
  var historyCat = ref.child("category");
  $ionicLoading.show();

  //read tblItem db
  history.on("value", function(snapshot) {
      console.log(snapshot.val());
      //push to list
      $scope.items = $firebaseArray(history);
      $ionicLoading.hide();
      
  }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });

  $scope.deleteItem = function (item) {
    var list = [item.item, item.category, item.price, item.date];
    var non = list[0];
    console.log(non);
      history.on("value", function(snapshot) {
      //loop once more
      angular.forEach(snapshot.val(), function(item, key) {
        //console.log(item.category);
        if (list[0] == item.item && list[1] == item.category && list[2] == item.price && list[3] == item.date){
          console.log(item.item, item.category, item.price, item.date);
          var ss = history.child(key);
          ss.remove();
        }

});


}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
  });
  console.log(list[2]);

  // var fullDate = new Date(]);
  // var month = fullDate.getMonth() + 1;
  var convertDate = list[3].replace("-", "");
  var a = parseInt(convertDate);
  if(a < 1000){
    a = a % 10;
  } else {
    a = a % 100;
  }

  //current month
  var fullDate = new Date();
  var month = fullDate.getMonth() + 1;
  console.log("DB: " + month + "List Date: " + a);
  historyCat.once("value", function(snapshot) {
      //loop once more
      angular.forEach(snapshot.val(), function(item, key) {
        //console.log(item.category);
        if (list[1] == item.category && a == item.thisMonth){
          var price = list[2];
          var res = price.replace("RM", "");
          var floatPrice = parseFloat(res)
          var deduct = item.monthly - floatPrice;
          console.log(floatPrice);

          var ss = historyCat.child(key);
          ss.update({monthly : deduct});
        }

});


}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
  });

  };


})

//link addNewPage.html
app.controller('addNewPageCtrl', function($scope, $firebaseObject, $ionicLoading) {
  //db connection
	var ref = new Firebase("https://expensetracker-da34a.firebaseio.com/");
  var itemP = ref.child("item");
  var upDate = ref.child("category");

  //read category
  upDate.on("value", function(snapshot) {
      console.log(snapshot.val());
      //push to dropdown
      $scope.items2 = $firebaseObject(upDate);
      
  }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });

    //submit to db
    $scope.submitToDB = function(item, category, price, tarikh){
      var fPrice;
      var newCurr;
      var totalSpend;
      //validate price format
      if($scope.price % 1 == 0){
        fPrice = "RM" + $scope.price + ".00";

      } else {
        fPrice = "RM" + $scope.price + "0";
      }

      //date format
      var fullDate = new Date($scope.tarikh);
      var day = fullDate.getDate();
      var month = fullDate.getMonth() + 1;
      var year = fullDate.getFullYear();
      //validte month format
        if(month < 10){
          if(day < 10){
            sDate = "0" + day + "-0" + month + "-" + year;
          } else {
            sDate = day + "-0" + month + "-" + year; 
          }                
        } else {
          if(day < 10){
            sDate = "0" + day + "-" + month + "-" + year;
          } else {
            sDate = day + "-" + month + "-" + year; 
          }   
       }
       //convert to string
      var conDate = sDate.toString(); 

      var currDate = new Date();
      var currMonth = currDate.getMonth() + 1;


      try {
        //push to db
        itemP.push({'item': item, 'category': category, 'price': fPrice, 'date': conDate });
        //read category
        upDate.once("value", function(snapshot) {
          //loop once more
          angular.forEach(snapshot.val(), function(item, key) {
            //validate today expense
            if (item.category == $scope.category){
              //validate month spending
              if (month == currMonth){
                totalSpend = $scope.price + item.monthly;
                console.log(item.monthly);
                
                //read specific value
                var ss = upDate.child(key);
                //update value
                ss.update({ monthly: totalSpend });
                console.log("Success validate");
              }
          }
        });
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
          });



      } catch(err) {
        console.log("err" + err);
      }
  }

})
   
app.controller('plannerCtrl', function($scope, $firebaseArray, $ionicLoading) {
  var ref = new Firebase("https://expensetracker-da34a.firebaseio.com/");
  var cPlanner = ref.child("category");
  $ionicLoading.show();
 
  cPlanner.on("value", function(snapshot) {
    var label = [];
    var data = [];
    var tLimit = 0;
//loop once more
  angular.forEach(snapshot.val(), function(item, key) {
      console.log(item.max);
      label.push(item.category);
      data.push(item.max);
      tLimit = tLimit + item.max;
      console.log(tLimit);
  });
  if(tLimit == 0){
    document.getElementById("maxLimit").innerHTML = "0.00";

  } else {
    document.getElementById("maxLimit").innerHTML = tLimit;
    $scope.labels = label;
    $scope.data = data;    
  }
  $ionicLoading.hide();

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});

app.controller('plannerEditCtrl', function($scope, $firebaseObject, $firebase) {
      var ref = new Firebase("https://expensetracker-da34a.firebaseio.com/");
      var catList2 = ref.child("category");

  catList2.on("value", function(snapshot) {
      $scope.itemPlanner = $firebaseObject(catList2);
      console.log(snapshot.val());
      
  }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });

  $scope.submitPlannerToDB = function(categories, max){
    console.log(categories + max);
    var cate = ref.child("category");
    cate.on("value", function(snapshot) {
      //loop once more
      angular.forEach(snapshot.val(), function(item, key) {
        console.log(item.category);
        if (item.category == categories){
          var ss = cate.child(key);
          ss.update({ max: max });
        } 

});


}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
  });
  }

});
   
app.controller('categoryCtrl', function($scope, $ionicPopup, $firebaseObject, $ionicLoading) {
	var ref = new Firebase("https://expensetracker-da34a.firebaseio.com/");
  var catList = ref.child("category");
  $ionicLoading.show();

  catList.on("value", function(snapshot) {
      console.log(snapshot.val());
      $scope.items = $firebaseObject(catList);
      $ionicLoading.hide();
      
  }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });
	// When button is clicked, the popup will be shown
   $scope.showPopup = function() {
     var fullDate = new Date();
     var month = fullDate.getMonth() + 1;
      $scope.data = {}
    
      // Custom popup
      var myPopup = $ionicPopup.show({
         template: '<input type = "text" ng-model = "data.model">',
         title: 'Category',
         subTitle: 'Enter New Category',
         scope: $scope,
			
         buttons: [
            { text: 'Cancel' }, {
               text: '<b>Save</b>',
               type: 'button-positive',
              

                  onTap: function(e) {
                  	if (!$scope.data.model) {
                        //don't allow the user to close unless he enters model
						            

                        e.preventDefault();
                     } else {
                        return $scope.data.model;
                     }
                  }
            }
         ]
      });

      myPopup.then(function(res) {
          if(!(res == undefined)){
            var sDate;
            var ref = new Firebase('https://expensetracker-da34a.firebaseio.com/');
            try {
              catList.push({'category': res, 'max' : 0, 'monthly' : 0 , 'thisMonth' : 0});
            console.log('Tapped!', res); 
          } catch (err) {
            console.log("failed");
          }
            
          } else{
            console.log('cancel');
          }
        
      });    
   };
})