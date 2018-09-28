angular.module('myModule',[]).directive('myPagination',function(){
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            option: '=pageOption',
        },
        /* template: '<ul class="pagination">' + '<li ng-click="pageClick(p)" ng-repeat="p in page" class="{{option.curr==p?\'active\':\'\'}}">' + '<a href="javascript:;">{{p}}</a>' + '</li>' + '</ul>', */
        template: 
        '<div style="width:700px;height:70px;margin:0 auto;">' + 
            '<ul class="pagination" style="float:left;">' + 
                '<li ng-click="pageClick(1)"><a href="javascript:">首页</a></li>' +
                '<li ng-click="pageClick(p)" ng-repeat="p in page" class="{{option.curr==p?\'active\':\'\'}}">' + '<a href="javascript:;">{{p}}</a>' + '</li>' + 
                '<li ng-click="pageClick(option.all)"><a href="javascript:">尾页</a></li>' +
            '</ul>' + 
            '<div class="skip" style="float:left;margin-top:20px;height:34px;line-height:34px;margin-left:30px;"><input type="text" ng-keyup="currkeyup()" ng-model="currNum" style="width:40px;border:none;border-radius:4px;border:1px solid #428bca;outline:none;padding-left:6px;height:26px;margin-right:10px;"><span>{{option.curr}}/{{option.all}}</span></div>' +
            '<div class="showNum" style="float:left;margin-top:20px;height:34px;line-height:34px;margin-left:30px;"><span>每页显示条数</span><input type="text" style="width:40px;border:none;border-radius:4px;border:1px solid #428bca;outline:none;padding-left:6px;height:26px;margin-left:10px;" ng-keyup="showPageNum()" ng-model="showPageNumber"><input type="button" style="width:40px;border:none;border-radius:4px;outline:none;height:26px;line-height:26px;text-align:center;background-color:#428bca;color:#fff;margin-left:10px;" value="确定" ng-click="changePageNum()"></div>' + 
        '</div>',
        //link函数负责将作用域与DOM进行连接
        link: function($scope){
            //容错处理
            function dealerror(){
                if(!$scope.option.curr || isNaN($scope.option.curr) || $scope.option.curr<1){
                    $scope.option.curr = 1;
                }
                if(!$scope.option.all || isNaN($scope.option.all) || $scope.option.all<1){
                    $scope.option.all = 1;
                }
                if($scope.option.curr > $scope.option.all){
                    $scope.option.curr = $scope.option.all;
                }
                if(!$scope.option.count || isNaN($scope.option.count) || $scope.option.count < 1){
                    $scope.option.count = 10;
                }
                if(!$scope.option.pageNum || isNaN($scope.option.pageNum || $scope.option.pageNum < 1)){
                    $scope.option.pageNum = 5;
                }
            }
            //得到显示页数的数组
            $scope.$watch('option',function(){
                dealerror();
                $scope.page = getRange($scope.option.curr,$scope.option.all,$scope.option.count);
            },true);
            /* $scope.page = getRange($scope.option.curr,$scope.option.all,$scope.option.count); */
            //绑定点击事件
            $scope.pageClick = function(page){
                if(page == '<<'){
                    page = parseInt($scope.option.curr) - 1;
                }else if(page == '>>'){
                    page = parseInt($scope.option.curr) + 1;
                }
                if(page < 1){
                    page = 1;
                }else if(page > $scope.option.all){
                    page = $scope.option.all;
                }
                //点击相同的页码不执行点击事件
                if(page == $scope.option.curr){
                    return ;
                }
                if($scope.option.click && typeof $scope.option.click === 'function'){
                    $scope.option.curr = page;
                    $scope.page = getRange($scope.option.curr,$scope.option.all,$scope.option.count);
                    $scope.option.click(page);
                }
            };
            //处理跳转到某页
            $scope.currkeyup = function(){
                $scope.currNum = String($scope.currNum).trim().replace(/[^\d]/g,'');
                if($scope.currNum.length>1 && $scope.currNum.substring(0,1)==0){
                    $scope.currNum = $scope.currNum.substring(1);
                }
                if($scope.currNum>=$scope.option.all){
                    $scope.currNum = $scope.option.all;
                }
                $scope.option.curr = $scope.currNum;
                if($scope.currNum == ''){
                    $scope.option.curr = 1;
                }
                $scope.page = getRange($scope.option.curr,$scope.option.all,$scope.option.count);
                $scope.option.click($scope.option.curr);
            };
            //处理每页显示条数
            $scope.showPageNum = function(){
                $scope.showPageNumber = String($scope.showPageNumber).trim().replace(/[^\d]/g,'');
                if($scope.showPageNumber.length>1 && $scope.showPageNumber.substring(0,1)==0){
                    $scope.showPageNumber = $scope.showPageNumber.substring(1);
                }
                if(Number($scope.showPageNumber) >= Number($scope.option.total)){
                    $scope.showPageNumber = $scope.option.total;
                }
            };
            $scope.changePageNum = function(){
                if($scope.showPageNumber == ''){
                    return ;
                }else if($scope.showPageNumber == $scope.option.pageNum){
                    return ;
                }else{
                    $scope.option.pageNum = $scope.showPageNumber;
                    $scope.option.curr = 1;
                    $scope.page = getRange($scope.option.curr,$scope.option.all,$scope.option.count);
                    $scope.option.click(1);
                }
            };
            //返回页数范围（用来遍历）
            function getRange(curr,all,count){
                //计算显示的页数
                curr = parseInt(curr);
                all = parseInt(all);
                count = parseInt(count);
                var from = curr - parseInt(count / 2);
                var to = curr + parseInt(count / 2) + (count % 2) - 1;
                //显示的页数处理
                if(from <= 0){
                    from = 1;
                    to = from + count - 1;
                    if(to > all){
                        to = all;
                    }
                }
                if(to > all){
                    to = all;
                    from = to - count + 1;
                    if(from <= 0){
                        from = 1;
                    }
                }
                var range = [];
                for(var i=from;i<=to;i++){
                    range.push(i);
                }
                range.push('>>');
                range.unshift('<<');
                return range;
            }
        }
    }
});