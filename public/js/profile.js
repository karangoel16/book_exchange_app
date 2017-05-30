var app=angular.module("myApp",[]);
app.controller('myCtrl',function($scope,$http){
	/*console.log($scope.User);
	$scope.city=User.city || "City";
	$scope.state= User.state || "State";
	$scope.name = User.displayName;*/
	$scope.user = function(User){
		$scope.User=User;
	}
	$scope.ajax=function(){
		console.log($scope.displayName);
		var data={
			displayName:$scope.name,
			city:$scope.city,
			state:$scope.state
		};
		$http.post('/updateUser',data).then(function(){
			$scope.update="Successfully updated";
		});
	};
});