function EventBus() {
  const events = new Map();
  const eventsTimerId = new Map();

  /// очистить все события
  this.clearEvents = function () {
    events.clear();
  };

  /// добавить слушателя события
  this.on = function (event, handler, allowDoubleHandlers = false) {
    let handlers = events.get(event) || [];
    if (!allowDoubleHandlers) {
      handlers = handlers.filter((item) => item !== handler); // удалить обработчик, если он был добавлен ранее
    }
    handlers.push(handler);
    events.set(event, handlers);
  };

  /// удалить слушателя события
  this.off = function (event, handler) {
    if (!events.has(event)) return;
    const handlers = events.get(event).filter((item) => item !== handler);

    events.set(event, handlers);
  };

  /// вызов события
  this.trigger = function (event, ...data) {
    if (!events.has(event)) return;
    events
      .get(event)
      .forEach((handler) => handler && setTimeout(() => handler(...data), 0));
  };

  this.triggerDebounced = function (timeout, event, ...data) {
    const content = this;
    if (eventsTimerId.has(event)) clearTimeout(eventsTimerId.get(event));
    eventsTimerId.set(
      event,
      setTimeout(() => {
        eventsTimerId.delete(event);
        content.trigger.call(content, event, ...data);
      }, timeout),
    );
  };
}

export const eventBus = new EventBus();
