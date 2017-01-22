import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import DS from 'ember-data';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

App.ApplicationAdapter = DS.JSONAPIAdapter.extend({
  url: 'http://gi-kp.azurewebsites.net/'
});

loadInitializers(App, config.modulePrefix);

export default App;
