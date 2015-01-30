import Ember from 'ember';
import { initialize } from 'dummy/initializers/validation';

var container, application;

module('Validation Initializer', {
  setup: function() {
    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  }
});

test('Initialize', function() {
  initialize(container, application);  
  ok(typeof container.lookup('validator:lookup') ==='function','Check registration');
});

