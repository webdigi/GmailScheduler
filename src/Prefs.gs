/**********************
 User Preferences
**********************/
function Prefs () {
  var form_object = loadPrefsForForm()

  for (var prop in form_object) {
    if (form_object[prop] == 'true')
      this[prop] = true
    else if (form_object[prop] == 'false')
      this[prop] = false
    else
      this[prop] = form_object[prop]
  }

  // NOTE the this.* fields have to match the names in the HTML.

}

function getUserPrefs (force_reload) {
  if (USER_PREFS === null || force_reload) {
    debug('User preferences object empty.. reloading..')
    USER_PREFS = new Prefs()
  }
  return USER_PREFS
}

function savePrefsFromForm (form_object) {
  debug('Saving preferences from form object which contains: ')

  for (var prop in form_object)
    debug(' - ' + prop + ' => ' + form_object[prop])

  PropertiesService.getUserProperties().setProperties(form_object, true)

  var prefs = getUserPrefs(true)

  debug('Refreshed preference object now contains:')

  var message = 'Saved new preferences.'

  return message
}

function loadPrefsForForm () {
  prefs = PropertiesService.getUserProperties().getProperties()
  var timerLabels = getUserChildLabels(SCHEDULER_LABEL + '/' + SCHEDULER_TIMER_LABEL)
  if (timerLabels.length) {
    prefs['timer'] = timerLabels
  }

  for (var default_prop in DEFAULT_PREFS) {
    if (prefs[default_prop] === undefined) {
      prefs[default_prop] = DEFAULT_PREFS[default_prop]

      debug('Loading default property for key:' + default_prop + ' value: ' + prefs[default_prop])
    }
  }

  return prefs
}

function clearPreferences (form_object) {
  PropertiesService.getUserProperties().deleteAllProperties()

  // TODO Can I refresh page automatically?
  return 'Defaults restored. Please refresh page.'
}

function setTimeZone (timezone) {
  prefs = PropertiesService.getUserProperties().getProperties()
  prefs['localzone'] = timezone

  return true
}
