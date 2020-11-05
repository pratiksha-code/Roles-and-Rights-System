angular.module('smart-table').directive('stToggleColumn', function() {
    return {
        restrict: 'A',
        require: '^stTable',
        scope: true,
        replace: true,
        transclude: true,
        template: function(element, attrs) {
            var tag;
            tag = element[0].nodeName;
            return "<" + tag + " ng-transclude ng-hide='column.hidden'></" + tag + ">";
        },
        link: function(scope, elem, attr, ctrl) {
            var registerElem = function() {
                var column, tableState;
                tableState = ctrl.tableState();
                column = {
                    index: angular.element(elem).index(),
                    name: angular.element(elem).text(),
                    hidden: attr.stToggleColumn || false
                };
                tableState.hiddenColumns = tableState.hiddenColumns || (tableState.hiddenColumns = []);
                tableState.hiddenColumns.push(column);
                ctrl.pipe();
            };
            registerElem();
            scope.column = {};
            scope.$watch((function() {
                return ctrl.tableState();
            }), function(newVal) {
                if (newVal) {
                    var newColumn;
                    newColumn = _.find(newVal.hiddenColumns, {
                        index: elem.index()
                    });
                    if (scope.column !== newColumn) {
                        return angular.extend(scope.column, newColumn);
                    }
                }
            }, true);
        }
    };
});
angular.module('smart-table').directive('stToggleMenu', function() {
    return {
        restrict: 'AE',
        require: '^stTable',
        link: function(scope, elem, attr, ctrl) {
            scope.hiddenColumns = [];
            scope.showMenu = false;
            scope.toggleMenu = function() {
                scope.showMenu = !scope.showMenu;
            };
            scope.toggleColumn = function(column) {
                column.hidden = !column.hidden;
                return ctrl.pipe();
            };
            scope.$watch((function() {
                return ctrl.tableState();
            }), function(newVal, oldVal) {
                if (scope.hiddenColumns !== newVal.hiddenColumns) {
                    scope.hiddenColumns = newVal.hiddenColumns;
                }
            }, true);
        },
        template: "<div class=\"st-column-menu\">\n  <span class=\"glyphicon glyphicon-wrench\" ng-click=\"toggleMenu()\"></span>\n  <ul class=\"menu list-unstyled\" ng-show=\"showMenu\">\n    <li ng-repeat=\"column in hiddenColumns\">\n      <input ng-click=\"toggleColumn(column)\" type=\"checkbox\" ng-checked=\"column.hidden\" /> {{ column.name }}\n    </li>\n  </ul>\n</div>"
    };
});
angular.module('smart-table').directive('stToggleItem', function($timeout) {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        require: '^stTable',
        scope: true,
        template: function(element, attrs) {
            var tag;
            tag = element[0].nodeName;
            return "<" + tag + " ng-transclude ng-hide='column.hidden'></" + tag + ">";
        },
        link: function(scope, elem, attr, ctrl) {
            var hiddenColumns;
            hiddenColumns = [];
            scope.column = {};
            scope.$watch((function() {
                return ctrl.tableState();
            }), function(newVal) {
                var newColumn;
                newColumn = _.find(newVal.hiddenColumns, {
                    index: elem.index()
                });
                if (scope.column !== newColumn) {
                    angular.extend(scope.column, newColumn);
                }
            }, true);
        }
    };
});
