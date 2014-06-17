// -- MESSAGE SERVICES --
function serviceGetMessageID(message) {
 return message.getId();
}

function serviceGetMessageIsDraft(message) {
  return message.isDraft();
}

function serviceGetMessageIsTrash(message) {
  return message.isInTrash();
}

function serviceGetMessageBody(message) {
  return message.getBody();
}

function serviceGetMessageDate(message) {
  return message.getDate();
}

function serviceGetMessageSubject(message) {
  return message.getSubject();
}

function serviceGetThreads(message) {
   return message.getThread();
}

function serviceGetRawMessage(message) {
   return message.getRawContent(); 
}

function serviceGetMessageFrom(message) {
  return message.getFrom(); 
}

function serviceGetMessageCC(message) {
 return message.getCc();
}

function serviceGetMessageBCC(message) {
  return message.getBcc();
}

function serviceGetMessageTo(message) {
  return message.getTo();
}

function serviceGetMessageAttachments(message) {
  return message.getAttachments();
}

// -- GMAIL SERVICES --
function serviceGmailSearch(search_string) {
 return GmailApp.search(search_string); 
}

function serviceCreateLabel(labelName) {
  return GmailApp.createLabel(labelName); 
}

function serviceDeleteLabel(labelName){
  var label = GmailApp.getUserLabelByName(labelName);
   return GmailApp.deleteLabel(label);
}

function serviceGetUserLabelByName(labelName){
  return GmailApp.getUserLabelByName(labelName);
}

function serviceRemoveLabelFromThread(thread, label) {
  var gmail_label_object = executeCommand(function(){return GmailApp.getUserLabelByName(label);}) // can use serviceGetUserLabels() instead
  executeCommand(function(){thread.removeLabel(gmail_label_object)});
}

function serviceSendEmailMessage(to, subject, body, htmlBody, cc, bcc, from, attach, name) {
  return executeCommand( 
    function() {
      GmailApp.sendEmail(to, subject, body, {htmlBody: htmlBody, cc: cc, bcc: bcc, from: from, attachments: attach, name: name} );
    });
}

function serviceGetUserLabels() {
  return GmailApp.getUserLabels();
}


// -- THREAD SERVICES
function serviceAddLabelToThread(thread, label) {
  thread.addLabel(label);
}

function serviceGetThreadMessages(thread) {
 return thread.getMessages();
}


// -- PROPERTIES SERVICE --
function serviceSaveProperty(key, value) {
  UserProperties.setProperties(key, value);
}

function serviceGetProperties() {
  return UserProperties.getProperties();
}

function serviceClearProperties() {
  UserProperties.deleteAllProperties();
}

// -- SCRIPT SERVICES --
function serviceGetTriggers() {
 return ScriptApp.getScriptTriggers();
}

function serviceDeleteTrigger(functionName) {
  ScriptApp.deleteTrigger(findTrigger(functionName));
}



