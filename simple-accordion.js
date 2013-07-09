/*global define jQuery */

/**
 * JQuery plugin for a simple accordion.
 *
 * @name jQuery Simple Accordion
 * @version 0.1.0
 * @requires jQuery v1.7+
 * @author Saulius Menkevicius
 */

;(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD support
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }
}(function ($, undefined) {

  var pluginName = 'SimpleAccordion',
      cssClassPrefix = 'simple-accordion',
      dataNameForItemIndex = 'simple-accordion-item-index',
      defaults;

  defaults = {
    cssClass: {
      accordion: cssClassPrefix,
      item: cssClassPrefix + '-item',
      itemToggle: cssClassPrefix + '-item-toggle',
      open: cssClassPrefix + '-item-open'
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginInstance = $.data(this, pluginName);

      if ((typeof options === 'string' || options instanceof String) && options.length) {
        if (!pluginInstance) {
          throw new Error('Plugin has not been instantiated.');
        }

        // options is a method name
        pluginInstance[options]();
      } else if (!pluginInstance) {
        $.data(this, pluginName, new Plugin(this, options));
      }
    });
  };

  /**
   * Plugin constructor.
   *
   * @param {HTMLElement} element
   * @param {Object} options
   * @constructor
   */
  function Plugin(element, options) {
    this._name = pluginName;
    this._defaults = defaults;

    this.element = element;
    this.$element = $(element);

    this.options = $.extend({}, defaults, options);

    this.init();
  }

  Plugin.prototype = {

    /**
     * Initializes plugin.
     */
    init: function () {
      var plugin = this;

      this.$items = this.$element.find('.' + this.options.cssClass.item);
      this.$itemToggles = this.$element.find('.' + this.options.cssClass.itemToggle);

      $.each(this.$itemToggles, function (index, itemElem) {
        $(itemElem).data(dataNameForItemIndex, index);
      });

      // handle the click event on accordion items
      this.$itemToggles.on('click tap vclick', function (event) {
        var toggleItemIndex = $(this).data(dataNameForItemIndex);

        event.preventDefault();

        if (toggleItemIndex !== undefined) {
          plugin._toggleItem(toggleItemIndex);
        }
      });

      this._toggleItem(0);
    },

    destroy: function () {
      this.$itemToggles.removeData(dataNameForItemIndex);

      this.$items.removeClass(this.options.cssClass.open);

      this.$element.removeData(pluginName);
    },

    _toggleItem: function (itemNum) {
      var openClass = this.options.cssClass.open,
          $item,
          $itemToggle,
          itemWasOpen;

      $item = $(this.$items[itemNum]);
      if (!$item) {
        return;
      }

      itemWasOpen = $item.hasClass(openClass);

      this.$items.removeClass(openClass);

      $itemToggle = $item.find('.' + this.options.cssClass.itemToggle);

      if (itemWasOpen) {
        $item.removeClass(openClass);
        $itemToggle.removeClass(openClass);
      } else {
        $item.addClass(openClass);
        $itemToggle.addClass(openClass);
      }
    }
  };
}));
