# Copyright (c) 2025, Hybrowlabs and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class EventNotification(Document):
	pass


@frappe.whitelist()
def publish_realtime(docname):
	doc = frappe.get_doc("Event Notification", docname)
	if doc.type == "Universal":
		frappe.publish_realtime(
				event="event_notification",
				message={"message": doc},
				after_commit=True,
			)