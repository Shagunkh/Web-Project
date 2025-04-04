var app = angular.module("searchApp", []);

app.controller("SearchController", function ($scope, $http) {
    $scope.searchQuery = "";
    $scope.results = [];

    $scope.fetchResults = function () {
        if ($scope.searchQuery.length < 2) {
            $scope.results = [];
            return;
        }

        $http.get(`/api/search?q=${$scope.searchQuery}`)
            .then(function (response) {
                $scope.results = response.data;
            })
            .catch(function (error) {
                console.error("Search error:", error);
            });
    };
});
