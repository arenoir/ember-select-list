import Ember from 'ember';

const {get} = Ember;

export default Ember.Component.extend({

  tagName: 'select',

  // possible passed-in values with their defaults:
  content: null,
  prompt: null,
  optionValuePath: null,
  optionLabelPath: null,
  required: false,
  title: null,
  action: Ember.K, // action to fire on change
  tabindex: -1,
  disabled: null,

  attributeBindings: ['tabindex', 'required', 'title', 'disabled'],

  // shadow the passed-in `value` to avoid
  // leaking changes to it via a 2-way binding
  _selection: Ember.computed.reads('value'),

  didInitAttrs() {
    this._super(...arguments);
    if (!this.get('content')) {
      this.set('content', []);
    }
  },

  change() {
    let selectEl = this.element;
    let selectedIndex = selectEl.selectedIndex;
    let content = this.get('content');

    // decrement index by 1 if we have a prompt
    let hasPrompt = !!this.get('prompt');
    let contentIndex = hasPrompt ? selectedIndex - 1 : selectedIndex;

    let selection = content.objectAt(contentIndex);

    let optionValuePath = this.get('optionValuePath');
    let value = optionValuePath ? get(selection, optionValuePath) : selection;

    // set the local, shadowed selection to avoid leaking
    // changes to `selection` out via 2-way binding
    this.set('_selection', value);

    let changeCallback = this.get('action');
    changeCallback(value);
  }
});
