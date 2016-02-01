function getTimeZoneString () {
  var userPrefs = getUserPrefs()
  var timezone_string = userPrefs['localzone']

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
    var fileIterator = getFileIterator()

    if(fileIterator.hasNext()){
       return SpreadsheetApp.open(fileIterator.next())
    } else {
       return createFile()
    }
}

function createFile(){
    var file = SpreadsheetApp.create(GMAILSCHEDULER_LOG_FILE_NAME)
    createHeadersForLogFile(file)
    colorHeaderLogFile(file.getSheets()[0])
    return file
}

function createHeadersForLogFile(spreadsheet){
    var sheet = spreadsheet.getSheets()[0]
    sheet.appendRow(LOG_FILE_HEADERS)
}

function getFileIterator(){
    return DriveApp.searchFiles('title contains "' + GMAILSCHEDULER_LOG_FILE_NAME + '"')
}

function createLabel (labelName) {
  var label = GmailApp.createLabel(labelName)

  if (label) {
    return true
  } else {
    return false
  }
}

function deleteLabel (labelName) {
  var userLabel         = GmailApp.getUserLabelByName(labelName)
  var deleteLabelResult = GmailApp.deleteLabel(userLabel)

  if (deleteLabelResult) {
    return true
  } else {
    return false
  }
}

function createTimerChildLabels (labels) {
  for (var i in labels) {
    createLabel(SCHEDULER_LABEL + '/' + SCHEDULER_TIMER_LABEL + '/' + labels[i])
  }

  return true
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

function logScheduledMessage(message){
    var row = [message.getId(), message.getTo(), message.getSubject(), message.getDate().toString(), 'Scheduled']
    var spreadsheet = getLogSpreadsheet()
    var sheet = spreadsheet.getSheets()[0]
    sheet.appendRow(row)
}

function colorHeaderLogFile(sheet){
    var range = sheet.getRange(1,1,1,5)
    range.setBackground('#B7D6DD')
    range.setFontWeight('bold')
}

function logMessageAsSent(messageId){
    var spreadsheet = getLogSpreadsheet()
    var sheet = spreadsheet.getSheets()[0]
    var range = sheet.getDataRange()
    var row = getRowByMessageId(messageId, range)

    if (row > 0){
        sheet.getRange(row, 5).setValue('Sent')
    } else {
        Logger.log('Message ' + messageId + 'not found')
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
