/**
 * 
 * @author dihwang
 * Dean Edward's event system
 *
 */
function addEvent(element, type, handler) {
	// assign each event handler a unique ID
	// 回调添加uuid，方便移除
	if (!handler.$$guid)
		handler.$$guid = addEvent.guid++;
	// create a hash table of event types for the element
	// 元素添加events,保存所有类型的回调
	if (!element.events)
		element.events = {};
	// create a hash table of event handlers for each element/event pair
	var handlers = element.events[type];
	if (!handlers) {
		// 创建一个子对象，保存当前类型的回调
		handlers = element.events[type] = {};
		// store the existing event handler (if there is one)
		// 如果元素之前以 onXXX=callback 的方式绑定过事件，则成为当前类别第一个被触发的回调
		// 问题是这回调没有UUID,只能通过 el.onXXX = null 移除
		if (element["on" + type]) {
			handlers[0] = element["on" + type];
		}
	}
	// store the event handler in the hash table
	// 保存当前的回调
	handlers[handler.$$guid] = handler;
	// assign a global event handler to do all the work
	// 所有回调统一交由 handleEvent 触发
	element["on" + type] = handleEvent;
};
// a counter used to create unique IDs
addEvent.guid = 1;

// 移除事件，只要从当前类别的储存对象delete 就行了
function removeEvent(element, type, handler) {
	// delete the event handler from the hash table
	if (element.events && element.events[type]) {
		delete element.events[type][handler.$$guid];
	}
};

function handleEvent(event) {
	// grab the event object (IE uses a global event object)
	// 统一事件对象阻止默认行为与事件传统的接口
	event = event || window.event;
	// get a reference to the hash table of event handlers
	// 根据事件类型,取得要处理回调集合，由于UUID是纯数字，因此可以按照绑定时的顺序执行
	console.log( 'this in handleEvent:', this);
	
	var handlers = this.events[event.type];
	// execute each event handler
	for ( var i in handlers) {
		this.$$handleEvent = handlers[i];
		this.$$handleEvent(event);
	}
};

function fixEvent(event) {
	// add W3C standard event methods
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
};

fixEvent.preventDefault = function() {
	this.returnValue = false;
};

fixEvent.stopPropagation = function() {
	this.cancelBubble = true;
};

