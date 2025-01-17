// Function to check and show birthday message
async function checkAndShowBirthdayMessage() {
  const userEmail = window.frappe.session.user
  if(userEmail=="Administrator") {
      return
  }
  try {
      const all_messges = await frappe.db.get_list('Event Broadcast', {
        fields: ['name'],filters: {event_doctype: 'User',docname: userEmail, seen: 0}
      });
      for (let i = 0; i < all_messges.length; i++) {
          // Check if the message has been seen before
          const seenResponse = await frappe.db.get_value('Event Broadcast', { 'name': all_messges[i].name }, ['*']);
          if (seenResponse.message.seen) {
              console.log("User has already seen the message.");
              return;  // Do not show the message again
          }
          // Show the birthday message dialog
          const messageResponse = await frappe.db.get_value('Event Notification', {"name":seenResponse.message.message}, ['title', 'message']);
          const messageDialog = new frappe.ui.Dialog({
              title: messageResponse.message.title,
              fields: [
                  {
                      fieldname: 'message',
                      fieldtype: 'HTML',
                      options: messageResponse.message.message
                  }
              ],
              primary_action_label: 'Close',
              primary_action: function () {
                  // Call API to mark message as seen when the button is clicked
                  frappe.call({
                      method: 'frappe.client.set_value',
                      args: {
                          doctype: 'Event Broadcast',
                          name: seenResponse.message.name,
                          fieldname: 'seen',
                          value: 1
                      },
                      callback: function (response) {
                          if (!response.exc) {
                              console.log('You will not see this message again.');
                          }
                      }
                  });
                  messageDialog.hide();
              }
          });
          messageDialog.show();
        }
  } catch (error) {
      console.error("Error fetching birth date:", error);
  }
// }, 100);
}

setTimeout(() => {
  checkAndShowBirthdayMessage();
}, 1000);

// checkAndShowBirthdayMessage();



$(document).on('app_ready', function () {
  frappe.realtime.on("event_notification", (data) => {
    const userEmail = window.frappe.session.user;
        // frappe.msgprint({
        //     title: __(data.message.title),
        //     message: __(data.message.message),
        //     indicator: data.message.indicator,
        //     label: 'GO TO MESSAGE'
        // });


        const messageDialog = new frappe.ui.Dialog({
            title: data.message.title,
            fields: [
                {
                    fieldname: 'message',
                    fieldtype: 'HTML',
                    options: data.message.message
                }
            ],
            primary_action_label: 'Close',
            primary_action: function () {
                // Call API to mark message as seen when the button is clicked
                frappe.call({
                    method: 'frappe.client.insert',
                        args: {
                            doc: {
                            doctype: 'Event Broadcast',
                            event_doctype: 'User',
                            docname: userEmail,
                            message: data.message.name,
                            seen: 1
                        }
                    },
                    callback: function (response) {
                        if (!response.exc) {
                            console.log('You will not see this message again.');
                        }
                    }
                });
                messageDialog.hide();
            }
        });
        messageDialog.show();



  });
});
