/*global define jQuery */

/**
 * JQuery plugin for a simple accordion.
 *
 * @name jQuery Simple Accordion
 * @version 0.0.4
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
      section: cssClassPrefix + '-section',
      sectionHeader: cssClassPrefix + '-section-header',
      sectionIsOpen: cssClassPrefix + '-section-is-open'
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
      var $sectionHeaders;

      this.$sections = this.$element.find('.' + this.options.cssClass.section);

      // handle the click event on accordion section headers
      $sectionHeaders = this.$element.find('.' + this.options.cssClass.sectionHeader);
      $sectionHeaders.on('click tap vclick', this._onSectionHeaderClick.bind(this));

      // open the first section on init
      this.$sections.first().addClass(this.options.cssClass.sectionIsOpen);
    },

    _onSectionHeaderClick: function (event) {
      var plugin = this,
          $parentSection = $(event.target).parent(),
          currentSectionIsOpen = $parentSection.hasClass(plugin.options.cssClass.sectionIsOpen);

      event.preventDefault();

      if (currentSectionIsOpen) {
        $parentSection.removeClass(plugin.options.cssClass.sectionIsOpen);
      } else {
        $parentSection.siblings().removeClass(plugin.options.cssClass.sectionIsOpen);
        $parentSection.addClass(plugin.options.cssClass.sectionIsOpen);
      }
    },

    destroy: function () {
      this.$sections.removeClass(this.options.cssClass.sectionIsOpen);

      this.$element.removeData(pluginName);
    }
  };
}));
