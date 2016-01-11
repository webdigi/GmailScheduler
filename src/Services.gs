// -- MESSAGE SERVICES --
function serviceCreateLabel (labelName) {
  return GmailApp.createLabel(labelName)
}

function serviceDeleteLabel (labelName) {
  var label = GmailApp.getUserLabelByName(labelName)
  return GmailApp.deleteLabel(label)
}

function serviceGetUserLabelByName (labelName) {
  return GmailApp.getUserLabelByName(labelName)
}

function serviceGetUserLabels () {
  return GmailApp.getUserLabels()
}

// -- PROPERTIES SERVICE --
function serviceSaveProperty (key, value) {
  UserProperties.setProperties(key, value)
}

function serviceGetProperties () {
  return UserProperties.getProperties()
}

function serviceClearProperties () {
  UserProperties.deleteAllProperties()
}
