function setupStaticLabels() {
      serviceCreateLabel(SCHEDULER_LABEL);
      serviceCreateLabel(SCHEDULER_LABEL+'/'+SCHEDULER_TIMER_LABEL);
      serviceCreateLabel(SCHEDULER_LABEL+'/'+SCHEDULER_QUEUE_LABEL);

      //Extras
      serviceCreateLabel(SCHEDULER_LABEL+'/'+SCHEDULER_EXTRAS_LABEL);
      serviceCreateLabel(SCHEDULER_LABEL+'/'+SCHEDULER_EXTRAS_LABEL+'/'+SCHEDULER_SMS_LABEL);
}

function sendWelcomeEmail(){
  var userPrefs = getUserPrefs(false);

  var body = 'Hi there,';
     body += '<p>Thanks for trying out the GmailScheduler. This is a free, secure, private (data is held only within your gmail account & your google app script) and convenient method to schedule outgoing messages and return messages to your inbox.</p>';
     body += '<p>GmailScheduler, is an open source project and please do submit tickets on any issues that you find here https://github.com/webdigi/GmailScheduler/issues. </p>';
     body += '<p>SETTINGS: Please note that you can use this link to access your settings at any time <a href="'+SETTINGS_URL+'" target="_blank">'+SETTINGS_URL+'</a></p>';
 var options = {
        htmlBody    : body
      }

 if(!userPrefs['email_welcome_sent']){
      GmailApp.sendEmail(getActiveUserEmail(), EMAIL_WELCOME_SUBJECT, body, options);
      userPrefs['email_welcome_sent'] = true;
      serviceSaveProperty(userPrefs,true);

 }

}

///////////OUTGOING SENT MSG
function dispatchDraft(id) {

  try {

    var message = GmailApp.getMessageById(id);

    if (message) {

      var body = message.getBody();
      var raw  = message.getRawContent();

      /* Credit - YetAnotherMailMerge */

      var regMessageId = new RegExp(id, "g");
      if (body.match(regMessageId) != null) {
        var inlineImages = {};
        var nbrOfImg = body.match(regMessageId).length;
        var imgVars = body.match(/<img[^>]+>/g);
        var imgToReplace = [];
        if(imgVars != null){
          for (var i = 0; i < imgVars.length; i++) {
            if (imgVars[i].search(regMessageId) != -1) {
              var id = imgVars[i].match(/realattid=([^&]+)&/);
              if (id != null) {
                id = id[1];
                var temp = raw.split(id)[1];
                temp = temp.substr(temp.lastIndexOf('Content-Type'));
                var imgTitle = temp.match(/name="([^"]+)"/);
                var contentType = temp.match(/Content-Type: ([^;]+);/);
                contentType = (contentType != null) ? contentType[1] : "image/jpeg";
                var b64c1 = raw.lastIndexOf(id) + id.length + 3; // first character in image base64
                var b64cn = raw.substr(b64c1).indexOf("--") - 3; // last character in image base64
                var imgb64 = raw.substring(b64c1, b64c1 + b64cn + 1); // is this fragile or safe enough?
                var imgblob = Utilities.newBlob(Utilities.base64Decode(imgb64), contentType, id); // decode and blob
                if (imgTitle != null) imgToReplace.push([imgTitle[1], imgVars[i], id, imgblob]);
              }
            }
          }
        }

        for (var i = 0; i < imgToReplace.length; i++) {
          inlineImages[imgToReplace[i][2]] = imgToReplace[i][3];
          var newImg = imgToReplace[i][1].replace(/src="[^\"]+\"/, "src=\"cid:" + imgToReplace[i][2] + "\"");
          body = body.replace(imgToReplace[i][1], newImg);
        }
      }

      var options = {
        cc          : message.getCc(),
        bcc         : message.getBcc(),
        htmlBody    : body,
        replyTo     : message.getReplyTo(),
        inlineImages: inlineImages,
        name        : message.getFrom().match(/[^<]*/)[0].trim(),
        attachments : message.getAttachments()
      }

      GmailApp.sendEmail(message.getTo(), message.getSubject(), body, options);
      message.moveToTrash();
      return "Delivered";
    } else {
      return "Message not found in Drafts";
    }
  } catch (e) {
    return e.toString();
  }
}
