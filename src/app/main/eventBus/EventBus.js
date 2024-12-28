const EventBus = {
    events: {},
  
    // 订阅事件
    subscribe(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(callback);
    },
  
    // 取消订阅
    unsubscribe(eventName, callback) {
      if (this.events[eventName]) {
        this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
      }
    },
  
    // 触发事件
    emit(eventName, data) {
      if (this.events[eventName]) {
        this.events[eventName].forEach((callback) => callback(data));
      }
    },
  };
  
  export default EventBus;
  