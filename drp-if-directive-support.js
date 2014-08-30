/*
	DrpIfDirectiveSupport:

		new DrpIfDirectiveSupport({element: , transclude: , comment: })

		.enter()
		.leave()

		// 'private'
		.element
		.transclude
		.block
		.childScope
		.previousElement

	This implementation comes from AngularJS ngIf code.
*/
angular.module('com.david-rodenas.DrpIfDirectiveSupport',[]).factory('DrpIfDirectiveSupport',
		['$animate', function
		( $animate ) { 'use strict';

	function DrpIfDirectiveSupport(options) {
		angular.extend(this, options);
	}

	// Methods
	/////////////////////////////////////////////////////////////////////////

	DrpIfDirectiveSupport.prototype.enter = function() {
		var self = this;
		if (!self.childScope) {
			self.transclude(function(clone, newScope) {
				self.childScope = newScope;
				clone[clone.length++] = document.createComment(' end if: ' + self.comment + ' ');
				self.block = {
					clone: clone,
				};
				$animate.enter(clone, self.element.parent(), self.element);
			});
		}
	};

	DrpIfDirectiveSupport.prototype.leave = function() {
		var self = this;
		if (self.previousElements) {
			self.previousElements.remove();
			self.previousElements = null;
		}
		if (self.childScope) {
			self.childScope.$destroy();
			self.childScope = null;
		}
		if (self.block) {
			self.previousElements = getBlockElements(self.block.clone);
			$animate.leave(self.previousElements, function() {
				self.previousElements = null;
			});
			self.block = null;
		}		
	};


	// Private functions
	/////////////////////////////////////////////////////////////////////////

	function getBlockElements(nodes) {
		var startNode = nodes[0],
		    endNode = nodes[nodes.length - 1];
		if (startNode === endNode) {
			return angular.element(startNode);
		}

		var element = startNode;
		var elements = [element];

		do {
			element = element.nextSibling;
			if (!element) { break; }
			elements.push(element);
		} while (element !== endNode);

		return angular.element(elements);
	}

	return DrpIfDirectiveSupport;

}]);