"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

//app id: QEERIs0ZkOHRC4ve2hOR8mIO41u3Vv9ZKdecJZYl
//REST API key: xcQfSDzwj1pEiiavUaMtCu4vNV8vgCNFZNYuz772
var commentsUrl = 'https://api.parse.com/1/classes/comments';

angular.module('Ajax-ChallengeApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
	    $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'QEERIs0ZkOHRC4ve2hOR8mIO41u3Vv9ZKdecJZYl';
	    $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'xcQfSDzwj1pEiiavUaMtCu4vNV8vgCNFZNYuz772';
	})
        //when click refresh button, refreshes comments in descending order of score
    .controller('CommentsController', function($scope, $http) {
    	$scope.refreshComments = function() {
    		$scope.loading = true;
            $http.get(commentsUrl + '?order=-score')
    			.success(function(data) {
    				$scope.comments = data.results;
    			})
    			.error(function(data) {
    				console.log(data);
    				$scope.errorMessage = err;
    			})
                .finally(function(data) {
                    $scope.loading = false;
                });
   		};

        $scope.refreshComments();

        $scope.newComment = {score: 0};

        //done when click add comment; add comment to the list
        $scope.addComment = function() {
        	$http.post(commentsUrl, $scope.newComment)
        		.success(function(responseData) {
        			$scope.newComment.objectId = responseData.objectId;
        			$scope.comments.push($scope.newComment);
        			$scope.newComment = {score: 0};
        		})
        		.error(function(err) {
        			console.log(err);
        			$scope.errorMessage = err;
        		});
        };

        //update the comments
        $scope.updateComment = function(comment) {
        	$scope.loading = true;
            $http.put(commentsUrl + '/' + comment.objectId, comment)
        		.success(function() {

        		})
        		.error(function(err) {
        			$scope.errorMessage = err;
        		})
                .finally(function() {
                    $scope.loading = false;
                })
        };

        //done when click x (close button); removes comment from list
        $scope.deleteComment = function(comment) {
            $scope.loading = true;
            $http.delete(commentsUrl + '/' + comment.objectId)
            .success(function() {
                $scope.refreshComments();
            })
            .error(function(err) {
                console.log(err);
                $scope.errorMessage = err;
            })
            .finally(function() {
                $scope.loading = false;
            })
        }

        //changes the score according to up/downvote
        $scope.updateScore = function(comment, amount) {

            $scope.updating = true;
            
            //incrementer to use below
            $scope.score = {
                score: {
                    __op: 'Increment',
                    amount: amount
                }
            };

            $http.put(commentsUrl + '/' + comment.objectId, $scope.score)
                .success(function(responseData) {
                    comment.score = responseData.score;
                })
                .error(function(err) {
                    console.log(err);
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };
    });