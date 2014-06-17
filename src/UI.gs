// Script-as-app template.
function doGet() {
 return HtmlService.createTemplateFromFile('User_UI.html').evaluate();
}

function savePrefs(form_object) {
  return savePrefsFromForm(form_object);
}

function getPrefs() {
  return loadPrefsForForm();
}

function restoreDefaultPrefs(form_object) {
  return clearPreferences();
}

