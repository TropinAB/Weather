function EventBus() {
  const events = new Map();

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
  this.trigger = function (event, data) {
    if (!events.has(event)) return;
    events
      .get(event)
      .forEach((listener) => listener && setTimeout(() => listener(data), 0));
  };
}

export const eventBus = new EventBus();
