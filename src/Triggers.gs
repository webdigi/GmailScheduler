// Refer to troubleshooting #1 to see how to remove any error messages
function createTriggers () {
  deleteTriggers()

  var timerTrigger = ScriptApp.newTrigger('processTimer')
    .timeBased()
    .everyMinutes(1)
    .create()

  var queueTrigger = ScriptApp.newTrigger('processQueue')
    .timeBased()
    .everyMinutes(1)
    .create()

  var draftsTrigger = ScriptApp.newTrigger('moveDraftsToInbox')
    .timeBased()
    .everyMinutes(1)
    .create()
}

function deleteTriggers () {
  var allTriggers = ScriptApp.getProjectTriggers()
  // Loop over all triggers
  for (var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i])
  }
}

function processTimer () {
  var queueLabel = SCHEDULER_LABEL + '/' + SCHEDULER_QUEUE_LABEL
  var queueLabelObject = GmailApp.getUserLabelByName(queueLabel)
  var timerChildLabels = getUserChildLabels(SCHEDULER_LABEL + '/' + SCHEDULER_TIMER_LABEL)

  for (var i = 0; i < timerChildLabels.length; i++) {
    var timerChildLabelObject
    var date = parseDate(timerChildLabels[i])
    var page = null

    if (date === null) {
      continue
    }

    var queueChildLabel = SCHEDULER_LABEL + '/' + SCHEDULER_QUEUE_LABEL + '/' + date.full()

    timerChildLabelObject = GmailApp.getUserLabelByName(SCHEDULER_LABEL + '/' + SCHEDULER_TIMER_LABEL + '/' + timerChildLabels[i])

    // Get threads in "pages" of 100 at a time
    while(!page || page.length == 100) {
      page = timerChildLabelObject.getThreads(0, 100)
      if (page.length > 0) {
        createLabel(queueChildLabel)
        queueChildLabelObject = GmailApp.getUserLabelByName(queueChildLabel)

        if (queueChildLabelObject) {
          queueLabelObject.addToThreads(page)
          // Move the threads into queueChildLabel
          queueChildLabelObject.addToThreads(page)
        }
        // Move the threads out of timerLabel
        timerChildLabelObject.removeFromThreads(page)
      }
    }
  }
}

function processQueue () {
  var userPrefs = getUserPrefs(false)
  var queueLabel = SCHEDULER_LABEL + '/' + SCHEDULER_QUEUE_LABEL
  var queueLabelObject = GmailApp.getUserLabelByName(queueLabel)
  var queueChildLabels = getUserChildLabels(SCHEDULER_LABEL + '/' + SCHEDULER_QUEUE_LABEL)

  for (var i = 0; i < queueChildLabels.length; i++) {
    var currentDate = convertToUserDate(new Date())
    var queueChildDate = parseDate(queueChildLabels[i])

    // skip if queuedatetime is not ready to process
    if (currentDate.getTime() < queueChildDate.getTime()) {
      continue
    }

    var queueChildLabel = SCHEDULER_LABEL + '/' + SCHEDULER_QUEUE_LABEL + '/' + queueChildLabels[i]
    var queueChildLabelObject = GmailApp.getUserLabelByName(queueChildLabel)
    var threads = queueChildLabelObject.getThreads()

    // Remove queue child label if nothing to process
    if (threads.length === 0) {
      deleteLabel(queueChildLabel)
    }

    for (var x in threads) {
      var thread = threads[x]
      var message = GmailApp.getMessageById(threads[x].getMessages()[0].getId())
      if (message.isDraft()) {
        dispatchDraft(threads[x].getMessages()[0].getId())

        // move sent message to inbox
        if (userPrefs['move_sent_messages_inbox']) {
          var sentMessage = GmailApp.search('To:' + message.getTo() + ' label:sent subject:' + message.getSubject() + '')[0]
          sentMessage.removeLabel(queueLabelObject)
          sentMessage.removeLabel(queueChildLabelObject)
          sentMessage.moveToInbox()
        }
      } else {
        thread.removeLabel(queueLabelObject)
        thread.removeLabel(queueChildLabelObject)
        GmailApp.moveThreadToInbox(threads[x])

        if (userPrefs['mark_sent_messages_inbox_unread']) {
          GmailApp.markMessageUnread(message)
        }
      }
    }
  }
}

function moveDraftsToInbox () {
  var userPrefs = getUserPrefs(false)

  if (!userPrefs['nolabel_drafs_to_inbox']) {
    return
  }

  var drafts = GmailApp.getDraftMessages()
  for (var i = 0; i < drafts.length; i++) {
    drafts[i].getThread().moveToInbox()
  }
}
