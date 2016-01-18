/**********************
 GLOBALS
**********************/

// Top level label name
var SCHEDULER_LABEL = 'GScheduler';
var SCHEDULER_TIMER_LABEL = 'Timer';
var SCHEDULER_QUEUE_LABEL = 'Queue';
var SCHEDULER_EXTRAS_LABEL = 'Extras';

// Use default google calendar to determine user timezone
var DEFAULT_TIMEZONE = 'default';

// Global preferences object
var USER_PREFS = null;

var EXECUTE_COMMAND_LOGGING = false;

// Retry logic
var NUM_RETRIES = 10;

//Welcome Email Subject
var EMAIL_WELCOME_SUBJECT = 'Welcome to GmailScheduler';

var SETTINGS_URL = 'https://script.google.com/macros/s/AKfycbw6hnnKGeG6xUsbRE9c3WSvJibTbaW88DP9f83e8lFnc1v1kL0/exec';

/* NOTE these names must match the 'name' attribute in HTML */
var DEFAULT_PREFS = {
  move_sent_messages_inbox:        true,
  mark_sent_messages_inbox_unread: false,
  nolabel_drafs_to_inbox:          false,
  localzone:                       'default',
  timer:                           [ '1 hour later',
                                     '2 hours later',
                                     '3 hours later',
                                     'One day later',
                                     'tomorrow 9am',
                                     'next monday 9am' ]
};
