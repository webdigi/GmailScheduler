# Gmail Scheduler
"Schedule sending of messages" is one of the top requested feature in Gmail.
Now Gmail Scheduler can help you schedule outgoing messages and it can be used with Gmail / Google apps for business.

## Intro Video
[![YouTubeVideo](http://i.imgur.com/AhTrT01.png)](http://youtu.be/4kfpQVZjFd8)


## Gmail Scheduler features
- Private - All your emails are private, unlike third party subscription programs that need access to your entire Gmail account with read and write access.
- 100% free - No ads, No limits (Only standard Gmail outgoing limits apply).
- Open source - [Link to source https://github.com/webdigi/GmailScheduler](https://github.com/webdigi/GmailScheduler)
- The app is hosted on Google servers with Google app script.

Further, you can help contribute and make it better. Please send us your feedback and any issues can be posted on the [Issue Tracker](https://github.com/webdigi/GmailScheduler/issues)

## Using Gmail Scheduler
Quick initial set up
- [Click to open Gmail Scheduler](https://script.google.com/macros/s/AKfycbw6hnnKGeG6xUsbRE9c3WSvJibTbaW88DP9f83e8lFnc1v1kL0/exec)
- Accept permissions
- Create labels as required. Feel free to add as many as you like. A pro tip is to use "2 hours later" then for days use "two days later" and so on. This means that 2 will show on the labels above two and so on. This will help make selecting the schedule easier.

Outgoing messages
- Now you are all set and go back to Gmail and compose a message and add the label under timer as required.
- Do not click on the send button. Only set the label and then leave the message in drafts.

Returning messages to inbox
- Another useful feature is to allow Gmail to return messages back to inbox.
- Simply apply a label under timer to any of our message and it will be returned back to your inbox as per schedule.

Accessing your GmailScheduler settings:
- https://script.google.com/macros/s/AKfycbw6hnnKGeG6xUsbRE9c3WSvJibTbaW88DP9f83e8lFnc1v1kL0/exec

## Troubleshooting
1) Cannot connect to Gmail
- You might occasionally see an error that looks like the image below.
[![ErrorWithGmail](http://i.imgur.com/CNZAWhI.png)](http://i.imgur.com/CNZAWhI.png)
- The message above means that Gmail could not connect to Google app scripts. This weird timeout happens between google services and you can ignore these messages. Any queued messages will be sent out in the next run.
- Please set a Gmail filter to delete these messages. You can filter on messages with subject "Summary of failures for Google Apps Script: Gmail Scheduler" sent from: 	apps-scripts-notifications@google.com

2) Uninstalling Gmail Scheduler
- It is quite easy to uninstall Gmail Scheduler at any time.
- Simply visit the https://script.google.com/macros/s/AKfycbw6hnnKGeG6xUsbRE9c3WSvJibTbaW88DP9f83e8lFnc1v1kL0/manage/uninstall
- Click on Uninstall (You can always follow the initial setup again to reinstall the scheduler)

## Further support & updates
- We look forward to your feedback on how we can improve this system
- Your commits and code updates are welcome. Looking forward to all the pull requests :)

### License
GmailScheduler is licensed under the [MIT license](https://github.com/webdigi/GmailScheduler/blob/master/LICENSE.txt). Maintained by Webdigi, a [Web Development agency](https://www.webdigi.co.uk) in London, UK
