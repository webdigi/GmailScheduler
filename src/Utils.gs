function getTimeZoneString () {
  var userPrefs = getUserPrefs()
  var timezone_string = userPrefs.localzone

  if (timezone_string == DEFAULT_TIMEZONE) {
    timezone_string = CalendarApp.getDefaultCalendar().getTimeZone()
  }

  return timezone_string
}

function convertToUserDate (date) {
  var user_timezone_string = getTimeZoneString()
  var user_date_string = Utilities.formatDate(date, user_timezone_string, 'yyyy/MM/dd HH:mm:ss')
  var user_date = new Date(user_date_string)
  return user_date
}

function getActiveUser () {
  return Session.getActiveUser()
}

function getActiveUserEmail () {
  return getActiveUser().getEmail()
}

function userHasLabel (label) {
  labels = GmailApp.getUserLabels()
  for (var i = 0; i < labels.length; i++) {
    if (labels[i].getName() == label)
      return true
  }
  return false
}

function getLogSpreadsheet(){
    var fileIterator = DriveApp.searchFiles('title contains "' + GMAILSCHEDULER_LOG_FILE_NAME + '"')

    if(fileIterator.hasNext()){
       return SpreadsheetApp.open(fileIterator.next())
    } else {
       return createFile()
    }
}

function createFile(){
    var spreadsheet = SpreadsheetApp.create(GMAILSCHEDULER_LOG_FILE_NAME)
    var sheet = spreadsheet.insertSheet(GMAILSCHEDULER_LOG_SHEET_NAME, 0);
    writeHeaders(sheet)
    addColorHeaders(sheet)
    return spreadsheet
}

function isMessageLogged(messageId){
    var sheet = getSheetFromLogFile()
    var range = sheet.getDataRange()
    var values = range.getValues()

    for (var i = 0; i < values.length; i++){
        if (values[i][0] === messageId) {
             return true
        }
    }
    return false
}

function writeHeaders(sheet){
    sheet.getRange(1,1,1,6).merge()
    sheet.appendRow(['THIS FILE IS AUTOMATICALLY UPDATED - DO NOT MAKE MANUAL MODIFICATIONS.'])
    sheet.appendRow(LOG_FILE_HEADERS)
}

function addColorHeaders(sheet){
    var range = sheet.getRange(2,1,1,6)
    var beauBlue = '#BCD4E6'
    range.setBackground(beauBlue)
    range.setFontWeight('bold')
}

function createLabel (labelName) {
  var label = GmailApp.createLabel(labelName)
}

function deleteLabel (labelName) {
  var userLabel = GmailApp.getUserLabelByName(labelName)
  var deleteLabelResult = GmailApp.deleteLabel(userLabel)
}

function createTimerChildLabels (labels) {
  for (var i in labels) {
    createLabel(SCHEDULER_LABEL + '/' + SCHEDULER_TIMER_LABEL + '/' + labels[i])
  }
}

function createTimerChildLabel (label) {
  createLabel(SCHEDULER_LABEL + '/' + SCHEDULER_TIMER_LABEL + '/' + label)
}

function deleteTimerChildLabel (label) {
  deleteLabel(SCHEDULER_LABEL + '/' + SCHEDULER_TIMER_LABEL + '/' + label)
}

function getUserChildLabels (label) {
  labels = GmailApp.getUserLabels()
  var childLabels = []
  for (var i = 0; i < labels.length; i++) {
    if (labels[i].getName().indexOf(label + '/') === 0) {
      childLabels.push(labels[i].getName().replace(label + '/', ''))
    }
  }

  return childLabels
}

function parseDate (str) {
  if (dateConversionRequired(str)) {
    return convertToUserDate(Date.future(str))
  }

  return Date.future(str)
}

function parseDateFormat (str) {
  var date = Date.future(str)

  if (date.isValid() && date.isFuture()) {
    return convertToUserDate(date).full()
  }

  return null
}

function dateConversionRequired (str) {
  var substrings = ['year', 'month', 'week', ' day', 'hour', 'minute', 'second']
  for (var i = 0; i != substrings.length; i++) {
    var substring = substrings[i]

    if (str.indexOf(substring) != - 1) {
      return true
    }
  }
  return false
}

function getSheetFromLogFile(){
    var spreadsheet = getLogSpreadsheet()
    return spreadsheet.getSheetByName(GMAILSCHEDULER_LOG_SHEET_NAME)
}

function logScheduledMessage(message){
    var sheet = getSheetFromLogFile()
    if(!isMessageLogged(message.getId())){
      var row = [message.getId(), message.getTo(), message.getSubject(), 'Scheduled', message.getDate().toString(), 'Not sent' ]
      sheet.appendRow(row)
    }
}

function logMessageAsSent(messageId){
    var sheet = getSheetFromLogFile()
    var range = sheet.getDataRange()
    var row = getRowByMessageId(messageId, range)

    if (row > 0){
        sheet.getRange(row, 4).setValue('Sent')
        sheet.getRange(row, 6).setValue((new Date()).toString())
    } else {
        throw 'Message not found'
    }
}

function getRowByMessageId(messageId, range){
   var values = range.getValues()
   for (var i = 0; i < values.length; i++){
       if (values[i][0] === messageId) {
            return i + 1
       }
   }
   return -1
}
