// Copyright (c) 2025, Hybrowlabs and contributors
// For license information, please see license.txt

frappe.ui.form.on("Chatnext Notification", {
	refresh(frm) {
        if(!frm.is_new() && frm.doc.type=="Universal") {
        frm.add_custom_button(__('Publish Notification'), function() {
            frappe.call({
                method: "chatnext_notification_broadcast.chatnext_notification_broadcast.doctype.chatnext_notification.chatnext_notification.publish_realtime",
                args: {
                    docname: frm.doc.name
                },
                callback: function(r) {
                    if (r.message) {
                        frappe.msgprint(r.message);
                    }
                }
            });
        })
    }

	},
});
